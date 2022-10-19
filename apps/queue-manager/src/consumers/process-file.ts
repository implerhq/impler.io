import { ProcessFileData } from '@impler/shared';

export async function processFile(message) {
  const data = JSON.parse(message.content) as ProcessFileData;
  console.log('Recived data', data);
}
