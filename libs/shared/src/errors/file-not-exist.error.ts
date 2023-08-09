export class FileNotExistError extends Error {
  constructor(name?: string) {
    super('File not found for the key provided ' + name);
    this.name = 'NonExistingFileError';
  }
}
