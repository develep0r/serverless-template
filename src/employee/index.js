import { GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient";

exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    try {
      let body;
      switch (event.httpMethod) {
        case "GET":
          if (event.pathParameters != null) {
            body = await getEmployee(event.pathParameters.id); // GET employee/{id}
          } else {
            body = await getAllEmployees(); // GET employee
          }
          break;
        default:
          throw new Error(`Unsupported route: "${event.httpMethod}"`);
      }
      console.log(body);
      return {
        statusCode: 200,
        body: JSON.stringify(body)
      };

    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to perform operation.",
          errorMsg: e.message,
          errorStack: e.stack,
        })
      };
    }
};

const getEmployee = async (employeeId) => {
  console.log("getEmployee");

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: employeeId })
    };

    const { Item } = await ddbClient.send(new GetItemCommand(params));

    console.log(Item);
    return (Item) ? unmarshall(Item) : {};

  } catch(e) {
    console.error(e);
    throw e;
  }
}

const getAllEmployees = async () => {
  console.log("getAllEmployees");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME
    };

    const { Items } = await ddbClient.send(new ScanCommand(params));

    console.log(Items);
    return (Items) ? Items.map((employee) => unmarshall(employee)) : {};

  } catch(e) {
    console.error(e);
    throw e;
  }
}
  