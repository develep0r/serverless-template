import { marshall } from '@aws-sdk/util-dynamodb/dist-types/marshall';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import AttributeMap = DocumentClient.AttributeMap;
import ScanOutput = DocumentClient.ScanOutput;
import PutItemInput = DocumentClient.PutItemInput;
import ScanInput = DocumentClient.ScanInput;
import GetItemInput = DocumentClient.GetItemInput;
import GetItemOutput = DocumentClient.GetItemOutput;


export class Employee {
    public id : string;
    public firstName: string;
    public middleName: string | undefined;
    public lastName: string;
    public title: string;

    constructor(attr : AttributeMap) {
        this.id = attr.id;
        this.firstName = attr.firstName;
        this.middleName = attr.middleName;
        this.lastName = attr.lastName;
        this.title = attr.title;
    }
}

export const save = async (employee : Employee) : Promise<Employee> => {
    const params : PutItemInput = {
        Item: employee,
        TableName: process.env.TABLE_NAME!,
    };

    const dynamoClient : DocumentClient = new DynamoDB.DocumentClient();
    await dynamoClient.put(params).promise();

    return employee;
};

export const getEmployee = async (employeeId: string): Promise<Employee> => {
    const params: GetItemInput = {
        TableName: process.env.TABLE_NAME!,
        Key: marshall({ id: employeeId })
    }
    const dynamoClient : DocumentClient = new DynamoDB.DocumentClient();
    const data: GetItemOutput = await dynamoClient.get(params).promise();
    if (!data.Item) {
        throw new Error(`No employee with id:${employeeId} exists`);
    }
    return new Employee(data.Item!.attr);
};

export const getAllEmployees = async () : Promise<Employee[]> => {
    const params: ScanInput = {
        TableName: process.env.TABLE_NAME!,
        Limit: 1000,
    }
    const dynamoClient : DocumentClient = new DynamoDB.DocumentClient();
    const data : ScanOutput = await dynamoClient.scan(params).promise();

    if (!data.Items) {
        return [];
    }
    const employees : Employee[] = data.Items.map((attr : AttributeMap) => new Employee(attr));
    return employees;
};