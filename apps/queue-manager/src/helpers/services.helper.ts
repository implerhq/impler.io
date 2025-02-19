import { EmailService, S3StorageService, SESEmailService, StorageService } from '@impler/services';

let storageService: StorageService;
let emailService: EmailService;

// Implementing singleton pattern for storage service
export function getStorageServiceClass() {
  if (storageService) return storageService;
  storageService = new S3StorageService();

  return storageService;
}

export function getEmailServiceClass() {
  if (emailService) return emailService;
  emailService = new SESEmailService();

  return emailService;
}
