import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  GetObjectCommand,
  DeleteObjectCommand,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';
import { FileNotExistError } from '../../errors/file-not-exist.error';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Defaults } from '../../utils';

export interface IFilePath {
  path: string;
  name: string;
}

export abstract class StorageService {
  abstract uploadFile(key: string, file: Buffer | string, contentType: string): Promise<PutObjectCommandOutput>;
  abstract getFileContent(key: string, encoding?: BufferEncoding): Promise<string>;
  abstract deleteFile(key: string): Promise<void>;
  abstract isConnected(): boolean;
  abstract getSignedUrl(key: string): Promise<string>;
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
  private isS3Connected = false;
  private s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_LOCAL_STACK || undefined,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  constructor() {
    const command = new ListBucketsCommand({});
    this.s3
      .send(command)
      .then(() => {
        return (this.isS3Connected = true);
      })
      .catch(() => {
        this.isS3Connected = false;
      });
  }

  async uploadFile(key: string, file: Buffer, contentType: string): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    return await this.s3.send(command);
  }

  async getFileContent(key: string, encoding = 'utf8' as BufferEncoding): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });
      const data = await this.s3.send(command);

      return await streamToString(data.Body as Readable, encoding);
    } catch (error) {
      if (error.code === Defaults.NOT_FOUND_STATUS_CODE || error.message === 'The specified key does not exist.') {
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

  isConnected(): boolean {
    return this.isS3Connected;
  }

  async getSignedUrl(key: string): Promise<string> {
    return await getSignedUrl(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      }),
      // eslint-disable-next-line no-magic-numbers
      { expiresIn: 15 * 60 } // 15 minutes
    );
  }
}
