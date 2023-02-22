import * as fs from 'fs';
import * as path from 'path';

export class FileService {
  constructor(private fileDir: string = '/tmp/files') {
    if (!fs.existsSync(this.fileDir)) {
      fs.mkdirSync(this.fileDir, { recursive: true });
    }
    if (!this.fileDir.endsWith('/')) {
      this.fileDir += '/';
    }
  }
  // put file to local directory
  putFile(key: string, file: Buffer) {
    // check directory exists
    let filePath = path.join(this.fileDir, key);
    let folderPathArr = filePath.split('/');
    folderPathArr.pop();
    let folderPath = folderPathArr.join('/');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    fs.writeFileSync(filePath, file);
  }
  // get file from local directory
  getFile(key: string) {
    try {
      return fs.readFileSync(path.join(this.fileDir, key));
    } catch (error) {
      return null;
    }
  }
  // delete file from local directory
  deleteFile(key: string) {
    try {
      fs.unlinkSync(path.join(this.fileDir, key));
    } catch (error) {}
  }
}
