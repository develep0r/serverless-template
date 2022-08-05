import { RemovalPolicy, Stack, StackProps, Stage } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps, NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { join } from 'path';

export class ServerlessTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    

    // Provisioning DynamoDB Table
    const employeeTable = new Table(this, 'employee', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'employee',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          "aws-sdk",
          "@aws-sdk/client-dynamodb",
          "@aws-sdk/util-dynamodb"
        ]
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: employeeTable.tableName
      },
      runtime: Runtime.NODEJS_14_X
    }

    // Simple CRUD microservice powered by AWS Lambda
    const employeeLambdaFunction = new NodejsFunction(this, 'employeeLambdaFunction', {
      entry: join(__dirname, `/../src/employee/index.js`),
      ...nodeJsFunctionProps,
    })

    // Grant employeeLambdaFunction RW access employeeTable
    employeeTable.grantReadWriteData(employeeLambdaFunction);
    

    // API Gateway configuration
    // Exposes REST API with the following paths GET /employee and GET /employee{id}
    const employeeApi = new LambdaRestApi(this, 'employee-api', {
      restApiName: 'employee-api',
      handler: employeeLambdaFunction,
      proxy: false
    });

    const employee = employeeApi.root.addResource('employee');
    employee.addMethod('GET'); 
    
    const singleEmployee = employee.addResource('{id}'); 
    singleEmployee.addMethod('GET'); 

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
