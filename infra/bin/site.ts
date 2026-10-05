import { App } from 'aws-cdk-lib'
import { SiteStack } from '../lib/site-stack.js'

const app = new App()

// Optional: `cdk deploy -c domain=example.dev` once the domain's hosted zone exists.
const domain: string | undefined = app.node.tryGetContext('domain') || undefined

new SiteStack(app, 'PortfolioSite', {
  // us-east-1 because CloudFront certificates must live there.
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
  domain,
  repo: 'muditbaid/Portfolio',
  branch: 'main',
  budgetEmail: 'muditbaid0407@gmail.com',
})
