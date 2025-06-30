import { StorageTypeEnum } from '@impler/shared';
import { AzureStorageService, EmailService, S3StorageService, SESEmailService, StorageService } from '@impler/services';

let storageService: StorageService;
let emailService: EmailService;

// Implementing singleton pattern for storage service
export function getStorageServiceClass() {
  console.log('storageService >>', storageService);
  console.log('storageType >>', process.env.STORAGE_TYPE);
  console.log('process.env.STORAGE_TYPE === StorageTypeEnum.AZURE', process.env.STORAGE_TYPE === StorageTypeEnum.AZURE);
  if (storageService) return storageService;
  storageService =
    process.env.STORAGE_TYPE === StorageTypeEnum.AZURE ? new AzureStorageService() : new S3StorageService();

  return storageService;
}

export function getEmailServiceClass() {
  if (emailService) return emailService;
  emailService = new SESEmailService();

  return emailService;
}
