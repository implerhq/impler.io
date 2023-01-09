import { S3StorageService, StorageService } from '@impler/shared/dist/services/storage';

let storageService: StorageService;

// Implementing singleton pattern for storage service
export function getStorageServiceClass() {
  if (storageService) return storageService;
  storageService = new S3StorageService();

  return storageService;
}
