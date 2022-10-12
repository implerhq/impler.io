import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { FileNotExistError } from '../errors/file-not-exist.error';

export interface IFilePath {
  path: string;
  name: string;
}

export abstract class StorageService {
  abstract uploadFile(
    key: string,
    file: Buffer | string,
    contentType: string,
    isPublic?: boolean
  ): Promise<PutObjectCommandOutput>;
  abstract getFileContent(key: string, encoding: string): Promise<string>;
  abstract deleteFile(key: string): Promise<void>;
}

async function streamToString(stream: Readable, encoding: BufferEncoding): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString(encoding)));
  });
}

export class S3StorageService implements StorageService {
  private s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_LOCAL_STACK || undefined,
    forcePathStyle: true,
  });

  async uploadFile(key: string, file: Buffer, contentType: string, isPublic = false): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ACL: isPublic ? 'public-read' : 'private',
      ContentType: contentType,
    });

    return await this.s3.send(command);
  }

  async getFileContent(key: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });
      const data = await this.s3.send(command);

      return await streamToString(data.Body as Readable, encoding);
    } catch (error) {
      if (error.code === 404 || error.message === 'The specified key does not exist.') {
        throw new FileNotExistError();
      }
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    await this.s3.send(command);
  }
}
