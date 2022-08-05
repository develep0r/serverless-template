"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerlessTemplateStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
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
                    'aws-sdk'
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
        const employeeApi = new aws_apigateway_1.LambdaRestApi(this, 'employeeApi', {
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
exports.ServerlessTemplateStack = ServerlessTemplateStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVybGVzcy10ZW1wbGF0ZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZlcmxlc3MtdGVtcGxhdGUtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQStEO0FBQy9ELCtEQUEyRDtBQUMzRCwyREFBNkU7QUFDN0UsdURBQWlEO0FBQ2pELHFFQUFvRjtBQUVwRiwrQkFBNEI7QUFFNUIsTUFBYSx1QkFBd0IsU0FBUSxtQkFBSztJQUNoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBR3hCLDhCQUE4QjtRQUM5QixNQUFNLGFBQWEsR0FBRyxJQUFJLG9CQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNoRCxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUMzQjtZQUNELFNBQVMsRUFBRSxVQUFVO1lBQ3JCLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsV0FBVyxFQUFFLDBCQUFXLENBQUMsZUFBZTtTQUN6QyxDQUFDLENBQUM7UUFFSCxNQUFNLG1CQUFtQixHQUF3QjtZQUMvQyxRQUFRLEVBQUU7Z0JBQ1IsZUFBZSxFQUFFO29CQUNmLFNBQVM7aUJBQ1Y7YUFDRjtZQUNELFdBQVcsRUFBRTtnQkFDWCxXQUFXLEVBQUUsSUFBSTtnQkFDakIsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLFNBQVM7YUFDN0M7WUFDRCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1NBQzdCLENBQUE7UUFFRCxpREFBaUQ7UUFDakQsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQ2hGLEtBQUssRUFBRSxXQUFJLENBQUMsU0FBUyxFQUFFLDJCQUEyQixDQUFDO1lBQ25ELEdBQUcsbUJBQW1CO1NBQ3ZCLENBQUMsQ0FBQTtRQUVGLHVEQUF1RDtRQUN2RCxhQUFhLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUd6RCw0QkFBNEI7UUFDNUIsZ0ZBQWdGO1FBQ2hGLE1BQU0sV0FBVyxHQUFHLElBQUksOEJBQWEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3pELFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixLQUFLLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDRjtBQXJERCwwREFxREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IExhbWJkYVJlc3RBcGkgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgeyBBdHRyaWJ1dGVUeXBlLCBCaWxsaW5nTW9kZSwgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHsgUnVudGltZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgTm9kZWpzRnVuY3Rpb25Qcm9wcywgTm9kZWpzRnVuY3Rpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcblxuZXhwb3J0IGNsYXNzIFNlcnZlcmxlc3NUZW1wbGF0ZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBcblxuICAgIC8vIFByb3Zpc2lvbmluZyBEeW5hbW9EQiBUYWJsZVxuICAgIGNvbnN0IGVtcGxveWVlVGFibGUgPSBuZXcgVGFibGUodGhpcywgJ2VtcGxveWVlJywge1xuICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgIG5hbWU6ICdpZCcsXG4gICAgICAgIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HXG4gICAgICB9LFxuICAgICAgdGFibGVOYW1lOiAnZW1wbG95ZWUnLFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYmlsbGluZ01vZGU6IEJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVFxuICAgIH0pO1xuXG4gICAgY29uc3Qgbm9kZUpzRnVuY3Rpb25Qcm9wczogTm9kZWpzRnVuY3Rpb25Qcm9wcyA9IHtcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGV4dGVybmFsTW9kdWxlczogW1xuICAgICAgICAgICdhd3Mtc2RrJ1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICdpZCcsXG4gICAgICAgIERZTkFNT0RCX1RBQkxFX05BTUU6IGVtcGxveWVlVGFibGUudGFibGVOYW1lXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTRfWFxuICAgIH1cblxuICAgIC8vIFNpbXBsZSBDUlVEIG1pY3Jvc2VydmljZSBwb3dlcmVkIGJ5IEFXUyBMYW1iZGFcbiAgICBjb25zdCBlbXBsb3llZUxhbWJkYUZ1bmN0aW9uID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICdlbXBsb3llZUxhbWJkYUZ1bmN0aW9uJywge1xuICAgICAgZW50cnk6IGpvaW4oX19kaXJuYW1lLCBgLy4uL3NyYy9lbXBsb3llZS9pbmRleC5qc2ApLFxuICAgICAgLi4ubm9kZUpzRnVuY3Rpb25Qcm9wcyxcbiAgICB9KVxuXG4gICAgLy8gR3JhbnQgZW1wbG95ZWVMYW1iZGFGdW5jdGlvbiBSVyBhY2Nlc3MgZW1wbG95ZWVUYWJsZVxuICAgIGVtcGxveWVlVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGVtcGxveWVlTGFtYmRhRnVuY3Rpb24pO1xuICAgIFxuXG4gICAgLy8gQVBJIEdhdGV3YXkgY29uZmlndXJhdGlvblxuICAgIC8vIEV4cG9zZXMgUkVTVCBBUEkgd2l0aCB0aGUgZm9sbG93aW5nIHBhdGhzIEdFVCAvZW1wbG95ZWUgYW5kIEdFVCAvZW1wbG95ZWV7aWR9XG4gICAgY29uc3QgZW1wbG95ZWVBcGkgPSBuZXcgTGFtYmRhUmVzdEFwaSh0aGlzLCAnZW1wbG95ZWVBcGknLCB7XG4gICAgICByZXN0QXBpTmFtZTogJ0VtcGxveWVlIFNlcnZpY2UnLFxuICAgICAgaGFuZGxlcjogZW1wbG95ZWVMYW1iZGFGdW5jdGlvbixcbiAgICAgIHByb3h5OiBmYWxzZVxuICAgIH0pO1xuXG4gICAgY29uc3QgZW1wbG95ZWUgPSBlbXBsb3llZUFwaS5yb290LmFkZFJlc291cmNlKCdlbXBsb3llZScpO1xuICAgIGVtcGxveWVlLmFkZE1ldGhvZCgnR0VUJyk7IFxuICAgIFxuICAgIGNvbnN0IHNpbmdsZUVtcGxveWVlID0gZW1wbG95ZWUuYWRkUmVzb3VyY2UoJ3tpZH0nKTsgXG4gICAgc2luZ2xlRW1wbG95ZWUuYWRkTWV0aG9kKCdHRVQnKTsgXG4gIH1cbn1cbiJdfQ==