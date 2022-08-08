import { marshall } from "@aws-sdk/util-dynamodb";
import { DynamoDB } from 'aws-sdk';
import Employee from "../model/employee";
import { dynamoClient } from "./database";



export async function getEmployee(employeeId: string) {
    console.log("getEmployee");

    try {
        const params: DynamoDB.DocumentClient.GetItemInput = {
            TableName!: process.env.DYNAMODB_TABLE_NAME!,
            Key: marshall({ id: employeeId })
        };
        const result = await dynamoClient.get(params).promise();
        if (!result.Item) {
            console.error(result.$response.error);
            throw new Error(`No employee with id:${employeeId}`);
        }
        const employee = result.Item as Employee;
        return employee;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
  
  export async function getAllEmployees() {
    console.log("getAllEmployees");
    try {
        const params: DynamoDB.DocumentClient.ScanInput = {
            TableName: process.env.DYNAMODB_TABLE_NAME!
        };
        const result = await dynamoClient.scan(params).promise();
        if (!result.Items) {
            console.error(result.$response.error);
            throw new Error('No employees in the Database');
        }
        const employees = result.Items.map(item => item as Employee);
        return employees;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
    