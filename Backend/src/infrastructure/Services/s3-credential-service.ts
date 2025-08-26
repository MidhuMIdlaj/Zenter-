import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

export class ComplaintAttachmentUploader  {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME!;
    this.region = process.env.AWS_REGION!;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;
    const fileBuffer = await fs.readFile(file.path);

    const uploadParams = {
      Bucket: this.bucketName,
      Key: filename,
      Body: fileBuffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${filename}`;
    return fileUrl;
  }
}
