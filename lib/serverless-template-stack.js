"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerlessTemplateStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const pipelines_1 = require("aws-cdk-lib/pipelines");
const path_1 = require("path");
class ServerlessTemplateStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Provisioning DynamoDB Table
        const employeeTable = new aws_dynamodb_1.Table(this, 'employee', {
            partitionKey: {
                name: 'id',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            tableName: 'employee',
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST
        });
        const nodeJsFunctionProps = {
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
            runtime: aws_lambda_1.Runtime.NODEJS_14_X
        };
        // Simple CRUD microservice powered by AWS Lambda
        const employeeLambdaFunction = new aws_lambda_nodejs_1.NodejsFunction(this, 'employeeLambdaFunction', {
            entry: path_1.join(__dirname, `/../src/employee/index.js`),
            ...nodeJsFunctionProps,
        });
        // Grant employeeLambdaFunction RW access employeeTable
        employeeTable.grantReadWriteData(employeeLambdaFunction);
        // API Gateway configuration
        // Exposes REST API with the following paths GET /employee and GET /employee{id}
        const employeeApi = new aws_apigateway_1.LambdaRestApi(this, 'employee-api', {
            restApiName: 'employee-api',
            handler: employeeLambdaFunction,
            proxy: false
        });
        const employee = employeeApi.root.addResource('employee');
        employee.addMethod('GET');
        const singleEmployee = employee.addResource('{id}');
        singleEmployee.addMethod('GET');
        // Code Pipeline Setup
        const codePipeline = new pipelines_1.CodePipeline(this, 'employee-pipeline', {
            pipelineName: 'employee-pipeline',
            dockerEnabledForSynth: true,
            synth: new pipelines_1.ShellStep('Build', {
                input: pipelines_1.CodePipelineSource.gitHub('develep0r/serverless-template', 'master'),
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
exports.ServerlessTemplateStack = ServerlessTemplateStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVybGVzcy10ZW1wbGF0ZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZlcmxlc3MtdGVtcGxhdGUtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQXNFO0FBQ3RFLCtEQUEyRDtBQUMzRCwyREFBNkU7QUFDN0UsdURBQWlEO0FBQ2pELHFFQUFvRjtBQUNwRixxREFBd0c7QUFFeEcsK0JBQTRCO0FBRTVCLE1BQWEsdUJBQXdCLFNBQVEsbUJBQUs7SUFDaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4Qiw4QkFBOEI7UUFDOUIsTUFBTSxhQUFhLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDaEQsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU07YUFDM0I7WUFDRCxTQUFTLEVBQUUsVUFBVTtZQUNyQixhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLFdBQVcsRUFBRSwwQkFBVyxDQUFDLGVBQWU7U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxtQkFBbUIsR0FBd0I7WUFDL0MsUUFBUSxFQUFFO2dCQUNSLGVBQWUsRUFBRTtvQkFDZixTQUFTO29CQUNULDBCQUEwQjtvQkFDMUIsd0JBQXdCO2lCQUN6QjthQUNGO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixtQkFBbUIsRUFBRSxhQUFhLENBQUMsU0FBUzthQUM3QztZQUNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7U0FDN0IsQ0FBQTtRQUVELGlEQUFpRDtRQUNqRCxNQUFNLHNCQUFzQixHQUFHLElBQUksa0NBQWMsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDaEYsS0FBSyxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUM7WUFDbkQsR0FBRyxtQkFBbUI7U0FDdkIsQ0FBQyxDQUFBO1FBRUYsdURBQXVEO1FBQ3ZELGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBR3pELDRCQUE0QjtRQUM1QixnRkFBZ0Y7UUFDaEYsTUFBTSxXQUFXLEdBQUcsSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDMUQsV0FBVyxFQUFFLGNBQWM7WUFDM0IsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixLQUFLLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWxDLHNCQUFzQjtRQUN0QixNQUFNLFlBQVksR0FBRyxJQUFJLHdCQUFZLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQy9ELFlBQVksRUFBRSxtQkFBbUI7WUFDakMscUJBQXFCLEVBQUUsSUFBSTtZQUMzQixLQUFLLEVBQUUsSUFBSSxxQkFBUyxDQUFDLE9BQU8sRUFBRTtnQkFDNUIsS0FBSyxFQUFFLDhCQUFrQixDQUFDLE1BQU0sQ0FBQywrQkFBK0IsRUFBRSxRQUFRLENBQUM7Z0JBQzNFLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDO2FBQ3ZELENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxxRUFBcUU7UUFDckUseURBQXlEO1FBQ3pELE9BQU87UUFFUCxzRkFBc0Y7UUFFdEYsMkVBQTJFO1FBQzNFLHlEQUF5RDtRQUN6RCxPQUFPO0lBRVAsQ0FBQztDQUNGO0FBNUVELDBEQTRFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzLCBTdGFnZSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IExhbWJkYVJlc3RBcGkgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgeyBBdHRyaWJ1dGVUeXBlLCBCaWxsaW5nTW9kZSwgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHsgUnVudGltZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgTm9kZWpzRnVuY3Rpb25Qcm9wcywgTm9kZWpzRnVuY3Rpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqcyc7XG5pbXBvcnQgeyBDb2RlUGlwZWxpbmUsIENvZGVQaXBlbGluZVNvdXJjZSwgTWFudWFsQXBwcm92YWxTdGVwLCBTaGVsbFN0ZXAgfSBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJsZXNzVGVtcGxhdGVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgXG5cbiAgICAvLyBQcm92aXNpb25pbmcgRHluYW1vREIgVGFibGVcbiAgICBjb25zdCBlbXBsb3llZVRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdlbXBsb3llZScsIHtcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiAnaWQnLFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklOR1xuICAgICAgfSxcbiAgICAgIHRhYmxlTmFtZTogJ2VtcGxveWVlJyxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1RcbiAgICB9KTtcblxuICAgIGNvbnN0IG5vZGVKc0Z1bmN0aW9uUHJvcHM6IE5vZGVqc0Z1bmN0aW9uUHJvcHMgPSB7XG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtcbiAgICAgICAgICBcImF3cy1zZGtcIixcbiAgICAgICAgICBcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiLFxuICAgICAgICAgIFwiQGF3cy1zZGsvdXRpbC1keW5hbW9kYlwiXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBQUklNQVJZX0tFWTogJ2lkJyxcbiAgICAgICAgRFlOQU1PREJfVEFCTEVfTkFNRTogZW1wbG95ZWVUYWJsZS50YWJsZU5hbWVcbiAgICAgIH0sXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YXG4gICAgfVxuXG4gICAgLy8gU2ltcGxlIENSVUQgbWljcm9zZXJ2aWNlIHBvd2VyZWQgYnkgQVdTIExhbWJkYVxuICAgIGNvbnN0IGVtcGxveWVlTGFtYmRhRnVuY3Rpb24gPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgJ2VtcGxveWVlTGFtYmRhRnVuY3Rpb24nLCB7XG4gICAgICBlbnRyeTogam9pbihfX2Rpcm5hbWUsIGAvLi4vc3JjL2VtcGxveWVlL2luZGV4LmpzYCksXG4gICAgICAuLi5ub2RlSnNGdW5jdGlvblByb3BzLFxuICAgIH0pXG5cbiAgICAvLyBHcmFudCBlbXBsb3llZUxhbWJkYUZ1bmN0aW9uIFJXIGFjY2VzcyBlbXBsb3llZVRhYmxlXG4gICAgZW1wbG95ZWVUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZW1wbG95ZWVMYW1iZGFGdW5jdGlvbik7XG4gICAgXG5cbiAgICAvLyBBUEkgR2F0ZXdheSBjb25maWd1cmF0aW9uXG4gICAgLy8gRXhwb3NlcyBSRVNUIEFQSSB3aXRoIHRoZSBmb2xsb3dpbmcgcGF0aHMgR0VUIC9lbXBsb3llZSBhbmQgR0VUIC9lbXBsb3llZXtpZH1cbiAgICBjb25zdCBlbXBsb3llZUFwaSA9IG5ldyBMYW1iZGFSZXN0QXBpKHRoaXMsICdlbXBsb3llZS1hcGknLCB7XG4gICAgICByZXN0QXBpTmFtZTogJ2VtcGxveWVlLWFwaScsXG4gICAgICBoYW5kbGVyOiBlbXBsb3llZUxhbWJkYUZ1bmN0aW9uLFxuICAgICAgcHJveHk6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBjb25zdCBlbXBsb3llZSA9IGVtcGxveWVlQXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2VtcGxveWVlJyk7XG4gICAgZW1wbG95ZWUuYWRkTWV0aG9kKCdHRVQnKTsgXG4gICAgXG4gICAgY29uc3Qgc2luZ2xlRW1wbG95ZWUgPSBlbXBsb3llZS5hZGRSZXNvdXJjZSgne2lkfScpOyBcbiAgICBzaW5nbGVFbXBsb3llZS5hZGRNZXRob2QoJ0dFVCcpOyBcblxuICAvLyBDb2RlIFBpcGVsaW5lIFNldHVwXG4gIGNvbnN0IGNvZGVQaXBlbGluZSA9IG5ldyBDb2RlUGlwZWxpbmUodGhpcywgJ2VtcGxveWVlLXBpcGVsaW5lJywge1xuICAgIHBpcGVsaW5lTmFtZTogJ2VtcGxveWVlLXBpcGVsaW5lJyxcbiAgICBkb2NrZXJFbmFibGVkRm9yU3ludGg6IHRydWUsXG4gICAgc3ludGg6IG5ldyBTaGVsbFN0ZXAoJ0J1aWxkJywge1xuICAgICAgaW5wdXQ6IENvZGVQaXBlbGluZVNvdXJjZS5naXRIdWIoJ2RldmVsZXAwci9zZXJ2ZXJsZXNzLXRlbXBsYXRlJywgJ21hc3RlcicpLFxuICAgICAgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddXG4gICAgfSlcbiAgfSk7XG5cbiAgLy8gY29uc3Qgc3RhZ2luZyA9IGNvZGVQaXBlbGluZS5hZGRTdGFnZShuZXcgU3RhZ2UodGhpcywgJ3N0YWdpbmcnLCB7XG4gIC8vICAgZW52OiB7IGFjY291bnQ6ICc0Nzg2MDIyMzU3NTknLCByZWdpb246ICd1cy1lYXN0LTEnfVxuICAvLyB9KSk7XG5cbiAgLy8gc3RhZ2luZy5hZGRQb3N0KG5ldyBNYW51YWxBcHByb3ZhbFN0ZXAoJ0FQUFJPVkFMIFJFUVVJUkVEOiBEZXBsb3kgdG8gUHJvZHVjdGlvbicpKTtcblxuICAvLyBjb25zdCBwcm9kdWN0aW9uID0gY29kZVBpcGVsaW5lLmFkZFN0YWdlKG5ldyBTdGFnZSh0aGlzLCAncHJvZHVjdGlvbicsIHtcbiAgLy8gICBlbnY6IHsgYWNjb3VudDogJzQ3ODYwMjIzNTc1OScsIHJlZ2lvbjogJ3VzLWVhc3QtMSd9XG4gIC8vIH0pKTtcblxuICB9XG59XG4iXX0=