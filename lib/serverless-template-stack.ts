import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps, NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
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
          'aws-sdk'
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
    const employeeApi = new LambdaRestApi(this, 'employeeApi', {
      restApiName: 'Employee Service',
      handler: employeeLambdaFunction,
      proxy: false
    });

    const employee = employeeApi.root.addResource('employee');
    employee.addMethod('GET'); 
    
    const singleEmployee = employee.addResource('{id}'); 
    singleEmployee.addMethod('GET'); 
  }
}
