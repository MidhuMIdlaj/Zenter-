import multer, { diskStorage, Multer } from 'multer';
import path from 'path';
import fs from 'fs';

class ChatMulterConfig {
  private uploadDir: string;
  private storage: multer.StorageEngine;
  private upload: Multer;

  constructor() {
    this.uploadDir = path.join(__dirname, '../../Uploads/chat-attachments');
    this.ensureUploadDirExists();
    this.storage = this.configureStorage();
    this.upload = this.createMulterInstance();
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private configureStorage(): multer.StorageEngine {
    return diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `chat-${uniqueSuffix}${path.extname(file.originalname)}`);
      },
    });
  }

  private createMulterInstance(): Multer {
    return multer({
      storage: this.storage,
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.error('Invalid file type:', file.mimetype);
          cb(new Error(`Invalid file type: ${file.mimetype}`));
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 5,
      },
    });
  }

  public getUpload(): Multer {
    return this.upload;
  }
}

export default new ChatMulterConfig().getUpload();