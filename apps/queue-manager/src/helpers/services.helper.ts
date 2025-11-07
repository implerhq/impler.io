import { StorageTypeEnum } from '@impler/shared';
import {
  AzureStorageService,
  EmailService,
  S3StorageService,
  SESEmailService,
  StorageService,
  PaymentAPIService,
} from '@impler/services';

let storageService: StorageService;
let emailService: EmailService;
let paymentApiService: PaymentAPIService;

// Implementing singleton pattern for storage service
export function getStorageServiceClass() {
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

export function getPaymentApiServiceClass() {
  if (paymentApiService) return paymentApiService;
  paymentApiService = new PaymentAPIService();

  return paymentApiService;
}
