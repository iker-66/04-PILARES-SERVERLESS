import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catalog, isEventInput, json, readBody } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  if (!catalog.some((item) => item.id === id)) return json(404, { message: 'Actuación no encontrada' });

  const body = readBody(event.body);
  if (!isEventInput(body)) {
    return json(400, { message: 'artist, space, time (HH:mm) y status válidos son obligatorios' });
  }

  return json(200, { id, ...body, artist: body.artist.trim(), space: body.space.trim(), operation: 'REPLACED' });
};
