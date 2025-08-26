export interface IComplaintAttachmentRepository {
  uploadFile(file: Express.Multer.File): Promise<string>;
}
