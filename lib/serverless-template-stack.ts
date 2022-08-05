import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { EmployeeServiceStage } from './employee-service-stage';

export class ServerlessTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Code Pipeline Setup
    const codePipeline = new CodePipeline(this, 'employee-pipeline', {
      pipelineName: 'employee-pipeline',
      dockerEnabledForSynth: true,
      synth: new ShellStep('Build', {
        input: CodePipelineSource.gitHub('develep0r/serverless-template', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const staging = codePipeline.addStage(new EmployeeServiceStage(this, 'staging', {
      env: { account: '478602235759', region: 'us-east-1'}
    }));

    staging.addPost(new ManualApprovalStep('APPROVAL REQUIRED: Deploy to Production'));

    const production = codePipeline.addStage(new EmployeeServiceStage(this, 'production', {
      env: { account: '478602235759', region: 'us-east-1'}
    }));

  }
}
