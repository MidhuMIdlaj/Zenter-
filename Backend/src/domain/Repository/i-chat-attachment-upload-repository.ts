export interface IChatAttachmentUploaderRepository {
  upload(file: Express.Multer.File): Promise<string>;
}
