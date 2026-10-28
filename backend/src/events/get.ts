import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catalog, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });

  const festivalEvent = catalog.find((item) => item.id === id);
  if (!festivalEvent) return json(404, { message: 'Actuación no encontrada' });

  console.log('GET evento:', id);
  return json(200, festivalEvent);
};
