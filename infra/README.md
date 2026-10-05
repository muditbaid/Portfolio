# Portfolio hosting (AWS CDK)

One stack, `PortfolioSite`, in `us-east-1`:

- **S3** private bucket holding the built site
- **CloudFront** in front of it (HTTPS, HTTP/3, security headers, origin access control)
- **ACM certificate + Route 53 records** for the custom domain, when `-c domain=` is given
- **GitHub OIDC role** that only `main` of `muditbaid/Portfolio` can assume to deploy (no AWS keys in GitHub)
- **Budget alert** emailed when the month's cost goes over $2

## First deploy

```bash
aws login                                   # sign in once; opens the browser
cd infra && npm install
npx cdk bootstrap                           # once per account/region
npx cdk deploy                              # CloudFront URL only
npx cdk deploy -c domain=example.dev        # after the domain's hosted zone exists
```

Copy the stack outputs `DeployRoleArn`, `BucketName` and `DistributionId` into the `env:` block of
`.github/workflows/deploy.yml`. After that, every push to `main` builds and publishes the site.

## Costs

At portfolio traffic this sits inside the free tiers: S3 and CloudFront are cents at most.
A Route 53 hosted zone is $0.50/month, plus the yearly domain fee.
