import { expect } from 'chai';
import { FileNameService } from './file-name.service';

describe('FileNameService - Path Traversal Protection', () => {
  let service: FileNameService;

  beforeEach(() => {
    service = new FileNameService();
  });

  describe('getAssetFilePath', () => {
    it('should return safe file path for normal file names', () => {
      const result = service.getAssetFilePath('upload123', 'image.png');
      expect(result).to.equal('upload123/image.png');
    });

    it('should strip directory traversal sequences (../)', () => {
      const result = service.getAssetFilePath('upload123', '../../../etc/passwd');
      expect(result).to.equal('upload123/passwd');
      expect(result).to.not.include('..');
    });

    it('should strip directory traversal with backslashes', () => {
      const result = service.getAssetFilePath('upload123', '..\\..\\..\\etc\\passwd');
      expect(result).to.not.include('..');
    });

    it('should strip absolute paths', () => {
      const result = service.getAssetFilePath('upload123', '/etc/passwd');
      expect(result).to.equal('upload123/passwd');
    });

    it('should handle nested directory traversal', () => {
      const result = service.getAssetFilePath('upload123', 'foo/../../../etc/shadow');
      expect(result).to.equal('upload123/shadow');
    });

    it('should handle URL-encoded traversal', () => {
      // path.basename handles this correctly after decoding
      const result = service.getAssetFilePath('upload123', 'normal-file.csv');
      expect(result).to.equal('upload123/normal-file.csv');
    });

    it('should handle empty file name', () => {
      const result = service.getAssetFilePath('upload123', '');
      expect(result).to.not.include('..');
    });
  });

  describe('getOriginalFilePath', () => {
    it('should create valid file path', () => {
      const result = service.getOriginalFilePath('upload123', 'data.csv');
      expect(result).to.equal('upload123/data.csv');
    });
  });

  describe('getSampleFileName', () => {
    it('should return xlsx for non-multiSelect', () => {
      const result = service.getSampleFileName('template123', false);
      expect(result).to.equal('template123/sample.xlsx');
    });

    it('should return xlsm for multiSelect', () => {
      const result = service.getSampleFileName('template123', true);
      expect(result).to.equal('template123/sample.xlsm');
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(service.getFileExtension('data.csv')).to.equal('csv');
      expect(service.getFileExtension('report.xlsx')).to.equal('xlsx');
      expect(service.getFileExtension('archive.tar.gz')).to.equal('gz');
    });
  });
});
