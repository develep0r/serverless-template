import { DynamoDB } from 'aws-sdk';
// Create an Amazon DynamoDB service client object.
const dynamoClient = new DynamoDB.DocumentClient();
export { dynamoClient };