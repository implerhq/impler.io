import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileNotExistError, Defaults } from '@impler/shared';

// Azure Storage imports
import {
  BlobSASPermissions,
  BlobServiceClient,
  BlockBlobUploadResponse,
  ContainerSASPermissions,
} from '@azure/storage-blob';

export interface IFilePath {
  path: string;
  name: string;
}

export interface StorageResponse {
  success: boolean;
  metadata?: any;
}

export abstract class StorageService {
  abstract uploadFile(key: string, file: Buffer | string | Readable, contentType: string): Promise<StorageResponse>;
  abstract getFileContent(key: string, encoding?: BufferEncoding): Promise<string>;
  abstract getFileStream(key: string): Promise<Readable>;
  abstract writeStream(key: string, stream: Readable, contentType: string): Promise<void>;
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

  async uploadFile(key: string, file: Buffer | string | Readable, contentType: string): Promise<StorageResponse> {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    const result = await this.s3.send(command);
    return {
      success: true,
      metadata: {
        eTag: result.ETag,
        versionId: result.VersionId,
      },
    };
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
        throw new FileNotExistError(key);
      }
      throw error;
    }
  }

  async getFileStream(key: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });
      const data = await this.s3.send(command);
      return data.Body as Readable;
    } catch (error) {
      if (error.code === Defaults.NOT_FOUND_STATUS_CODE || error.message === 'The specified key does not exist.') {
        throw new FileNotExistError(key);
      }
      throw error;
    }
  }

  async writeStream(key: string, stream: Readable, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: stream,
      ContentType: contentType,
    });
    await this.s3.send(command);
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
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }
}

export class AzureStorageService implements StorageService {
  private isAzureConnected = false;
  private blobServiceClient: BlobServiceClient;
  private containerClient: any;

  constructor() {
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured');
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    this.containerClient = this.blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER || 'default-container'
    );

    // Verify connection
    this.blobServiceClient
      .listContainers()
      .next()
      .then(() => {
        this.isAzureConnected = true;
      })
      .catch(() => {
        this.isAzureConnected = false;
      });
  }

  async uploadFile(key: string, file: Buffer | string | Readable, contentType: string): Promise<StorageResponse> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    let uploadResponse: BlockBlobUploadResponse;

    if (typeof file === 'string') {
      const buffer = Buffer.from(file);
      uploadResponse = await blockBlobClient.upload(buffer, buffer.length);
    } else if (file instanceof Buffer) {
      uploadResponse = await blockBlobClient.upload(file, file.length);
    } else {
      // For Readable streams
      const chunks: Buffer[] = [];
      for await (const chunk of file) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      uploadResponse = await blockBlobClient.upload(buffer, buffer.length);
    }

    await blockBlobClient.setHTTPHeaders({ blobContentType: contentType });
    return {
      success: true,
      metadata: {
        eTag: uploadResponse.etag,
      },
    };
  }

  async getFileContent(key: string, encoding = 'utf8' as BufferEncoding): Promise<string> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(key);
      const downloadResponse = await blockBlobClient.download();
      const content = await downloadResponse.blobBody?.toString(encoding);
      if (!content) {
        throw new Error('Failed to download file content');
      }
      return content;
    } catch (error) {
      if (error.name === 'RestError' && error.statusCode === 404) {
        throw new FileNotExistError(key);
      }
      throw error;
    }
  }

  async getFileStream(key: string): Promise<Readable> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(key);
      const downloadResponse = await blockBlobClient.download();
      return Readable.from(downloadResponse.blobBody as any);
    } catch (error) {
      if (error.name === 'RestError' && error.statusCode === 404) {
        throw new FileNotExistError(key);
      }
      throw error;
    }
  }

  async writeStream(key: string, stream: Readable, contentType: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    await blockBlobClient.upload(buffer, buffer.length);
    await blockBlobClient.setHTTPHeaders({ blobContentType: contentType });
  }

  async deleteFile(key: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    await blockBlobClient.delete();
  }

  isConnected(): boolean {
    return this.isAzureConnected;
  }

  async getSignedUrl(key: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    const permissions = BlobSASPermissions.parse('r');

    return blockBlobClient.generateSasUrl({
      permissions,
      expiresOn: new Date(Date.now() + 3600 * 1000), // 1 hour expiry
    });
  }
}
