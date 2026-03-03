import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileNotExistError, Defaults } from '@impler/shared';

// Azure Storage imports
import { BlobSASPermissions, BlobServiceClient, BlockBlobUploadResponse } from '@azure/storage-blob';

export interface IFilePath {
  path: string;
  name: string;
}

export interface IStorageResponse {
  success: boolean;
  metadata?: any;
}

export abstract class StorageService {
  abstract uploadFile(key: string, file: Buffer | string | Readable, contentType: string): Promise<IStorageResponse>;
  abstract getFileContent(key: string, encoding?: BufferEncoding): Promise<string>;
  abstract getFileStream(key: string): Promise<Readable>;
  abstract writeStream(key: string, stream: Readable, contentType: string): Promise<void>;
  abstract deleteFile(key: string): Promise<void>;
  abstract deleteFolder(key: string): Promise<void>;
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
  async deleteFolder(prefix: string): Promise<void> {
    try {
      // Ensure prefix ends with '/' if it's not empty
      const folderPrefix = prefix && !prefix.endsWith('/') ? `${prefix}/` : prefix;

      let continuationToken: string | undefined;

      do {
        // List objects with the given prefix
        const listCommand = new ListObjectsV2Command({
          Bucket: process.env.S3_BUCKET_NAME,
          Prefix: folderPrefix,
          ContinuationToken: continuationToken,
        });

        const listResponse = await this.s3.send(listCommand);

        if (listResponse.Contents && listResponse.Contents.length > 0) {
          // Prepare objects for deletion (max 1000 objects per delete request)
          const objectsToDelete = listResponse.Contents.map((obj) => ({
            Key: obj.Key,
          }));

          // Delete the objects
          const deleteCommand = new DeleteObjectsCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Delete: {
              Objects: objectsToDelete,
              Quiet: true, // Don't return details about deleted objects
            },
          });

          await this.s3.send(deleteCommand);
        }

        // Check if there are more objects to delete
        continuationToken = listResponse.NextContinuationToken;
      } while (continuationToken);
    } catch (error) {
      console.error('[StorageService] Failed to delete S3 folder:', error?.message || error);
    }
  }

  async uploadFile(key: string, file: Buffer | string | Readable, contentType: string): Promise<IStorageResponse> {
    try {
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
    } catch (error) {
      console.error(`[StorageService] Failed to upload file '${key}':`, error?.message || error);
      throw error;
    }
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

        return;
      })
      .catch(() => {
        this.isAzureConnected = false;
      });
  }

  async uploadFile(key: string, file: Buffer | string | Readable, contentType: string): Promise<IStorageResponse> {
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

      if (!downloadResponse.readableStreamBody) {
        throw new Error('Failed to download file content - no readable stream');
      }

      // Convert the readable stream to string
      const chunks: Buffer[] = [];
      const stream = downloadResponse.readableStreamBody as Readable;

      for await (const chunk of stream) {
        chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
      }

      const buffer = Buffer.concat(chunks);
      const content = buffer.toString(encoding);

      if (!content) {
        throw new Error('Failed to download file content - empty content');
      }

      return content;
    } catch (error: any) {
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

      if (!downloadResponse.readableStreamBody) {
        throw new Error('Failed to get file stream - no readable stream');
      }

      return downloadResponse.readableStreamBody as Readable;
    } catch (error: any) {
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

  async deleteFolder(prefix: string): Promise<void> {
    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blob.name);
      await blockBlobClient.deleteIfExists();
    }
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
