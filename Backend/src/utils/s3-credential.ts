import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { Credentials } from "@aws-sdk/types";
import path from 'path';
import fs from 'fs/promises';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  } as Credentials,
});


export const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
  const fileExtension = path.extname(file.originalname);
  const filename = `${uuidv4()}${fileExtension}`;
  const fileBuffer = await fs.readFile(file.path);
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: filename,
    Body: fileBuffer,
    ContentType: file.mimetype,
  };
 
  console.log(`Uploading file to S3: ${uploadParams.Body}`);
  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);
  
  return `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
};
