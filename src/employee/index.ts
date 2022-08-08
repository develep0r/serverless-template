import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getEmployee, getAllEmployees } from './repository/employeeRepository';


export async function get(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  console.log(event);

    try {
      let body;
      switch (event.requestContext.http.method) {
        case "GET":
          if (event.pathParameters != null) {
            body = await getEmployee(event.pathParameters.id!); // GET employee/{id}
          } else {
            body = await getAllEmployees(); // GET employee
          }
          break;
        default:
          throw new Error(`Unsupported route: "${event.requestContext.http.method}"`);
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
          errorMsg: (e as Error).message,
          errorStack: (e as Error).stack,
        })
      };
    }
};
  