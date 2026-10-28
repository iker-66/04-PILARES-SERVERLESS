import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catalog, json } from './model.js';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  json(200, catalog);
