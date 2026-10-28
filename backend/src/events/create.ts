import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isEventInput, json, readBody } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = readBody(event.body);
  if (!isEventInput(body)) {
    return json(400, { message: 'artist, space, time (HH:mm) y status válidos son obligatorios' });
  }

  console.log('POST evento:', body.artist);
  return json(201, { id: 'EVT-NEW', ...body, artist: body.artist.trim(), space: body.space.trim() });
};
