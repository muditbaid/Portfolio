import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { CfnBudget } from 'aws-cdk-lib/aws-budgets'
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'
import {
  AllowedMethods,
  Distribution,
  HeadersFrameOption,
  HeadersReferrerPolicy,
  HttpVersion,
  PriceClass,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { OidcProviderNative, PolicyStatement, Role, WebIdentityPrincipal } from 'aws-cdk-lib/aws-iam'
import { ARecord, AaaaRecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3'
import type { Construct } from 'constructs'

export type SiteProps = StackProps & {
  /** Apex domain, e.g. muditbaid.dev. Its Route 53 hosted zone must exist. Omit to use the CloudFront URL. */
  domain?: string
  /** GitHub "owner/repo" allowed to deploy, and the branch it deploys from. */
  repo: string
  branch: string
  /** Where the monthly cost alert goes. */
  budgetEmail: string
}

/** Static site: private S3 bucket behind CloudFront, plus a keyless deploy role for GitHub Actions. */
export class SiteStack extends Stack {
  constructor(scope: Construct, id: string, props: SiteProps) {
    super(scope, id, props)

    const bucket = new Bucket(this, 'SiteBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
    })

    let domainNames: string[] | undefined
    let certificate: Certificate | undefined
    const zone = props.domain ? HostedZone.fromLookup(this, 'Zone', { domainName: props.domain }) : undefined
    if (props.domain && zone) {
      domainNames = [props.domain, `www.${props.domain}`]
      // CloudFront only accepts certificates from us-east-1, which is why this stack lives there.
      certificate = new Certificate(this, 'Certificate', {
        domainName: props.domain,
        subjectAlternativeNames: [`www.${props.domain}`],
        validation: CertificateValidation.fromDns(zone),
      })
    }

    const headers = new ResponseHeadersPolicy(this, 'SecurityHeaders', {
      securityHeadersBehavior: {
        strictTransportSecurity: { accessControlMaxAge: Duration.days(365), includeSubdomains: true, override: true },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: HeadersFrameOption.DENY, override: true },
        referrerPolicy: { referrerPolicy: HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN, override: true },
      },
    })

    const distribution = new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        responseHeadersPolicy: headers,
        compress: true,
      },
      defaultRootObject: 'index.html',
      // Unknown paths land on the app instead of an S3 error page.
      errorResponses: [403, 404].map((httpStatus) => ({
        httpStatus,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
        ttl: Duration.minutes(5),
      })),
      domainNames,
      certificate,
      httpVersion: HttpVersion.HTTP2_AND_3,
      priceClass: PriceClass.PRICE_CLASS_100,
    })

    if (props.domain && zone) {
      const target = RecordTarget.fromAlias(new CloudFrontTarget(distribution))
      for (const recordName of [props.domain, `www.${props.domain}`]) {
        const id = recordName.startsWith('www.') ? 'Www' : 'Apex'
        new ARecord(this, `${id}A`, { zone, recordName, target })
        new AaaaRecord(this, `${id}Aaaa`, { zone, recordName, target })
      }
    }

    // GitHub Actions assumes this role with a short-lived OIDC token: no AWS keys stored anywhere.
    const github = new OidcProviderNative(this, 'GitHubOidc', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    })
    const deployRole = new Role(this, 'DeployRole', {
      description: `Deploys ${props.repo} (${props.branch}) to the portfolio bucket`,
      maxSessionDuration: Duration.hours(1),
      assumedBy: new WebIdentityPrincipal(github.oidcProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          'token.actions.githubusercontent.com:sub': `repo:${props.repo}:ref:refs/heads/${props.branch}`,
        },
      }),
    })
    bucket.grantReadWrite(deployRole)
    bucket.grantDelete(deployRole)
    deployRole.addToPolicy(
      new PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [`arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`],
      }),
    )

    new CfnBudget(this, 'MonthlyBudget', {
      budget: {
        budgetName: 'portfolio-monthly',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: { amount: 2, unit: 'USD' },
      },
      notificationsWithSubscribers: [
        {
          notification: { notificationType: 'ACTUAL', comparisonOperator: 'GREATER_THAN', threshold: 100 },
          subscribers: [{ subscriptionType: 'EMAIL', address: props.budgetEmail }],
        },
        {
          notification: { notificationType: 'FORECASTED', comparisonOperator: 'GREATER_THAN', threshold: 100 },
          subscribers: [{ subscriptionType: 'EMAIL', address: props.budgetEmail }],
        },
      ],
    })

    new CfnOutput(this, 'BucketName', { value: bucket.bucketName })
    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId })
    new CfnOutput(this, 'DeployRoleArn', { value: deployRole.roleArn })
    new CfnOutput(this, 'SiteUrl', {
      value: props.domain ? `https://${props.domain}` : `https://${distribution.distributionDomainName}`,
    })
  }
}
