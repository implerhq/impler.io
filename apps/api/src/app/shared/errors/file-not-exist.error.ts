export class FileNotExistError extends Error {
  constructor() {
    super('File not found for the key provided');
    this.name = 'NonExistingFileError';
  }
}
