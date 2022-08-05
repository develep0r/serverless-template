import { RemovalPolicy, Stack, StackProps, Stage } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps, NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { join } from 'path';
import { EmployeeServiceStack } from './employee-service-stack';

export class ServerlessTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Provision Employee Service Stack
    new EmployeeServiceStack(this, 'employee-service-stack', props);

    // Code Pipeline Setup
    const codePipeline = new CodePipeline(this, 'employee-pipeline', {
      pipelineName: 'employee-pipeline',
      dockerEnabledForSynth: true,
      synth: new ShellStep('Build', {
        input: CodePipelineSource.gitHub('develep0r/serverless-template', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

  // const staging = codePipeline.addStage(new Stage(this, 'staging', {
  //   env: { account: '478602235759', region: 'us-east-1'}
  // }));

  // staging.addPost(new ManualApprovalStep('APPROVAL REQUIRED: Deploy to Production'));

  // const production = codePipeline.addStage(new Stage(this, 'production', {
  //   env: { account: '478602235759', region: 'us-east-1'}
  // }));

  }
}
