export interface IRejectComplaintUseCase {
  execute(
    complaintId: string,
    mechanicId: string,
    reason: string
  ): Promise<{
    success: boolean;
    message: string;
    complaint?: any;
    currentStatus?: string;
  }>;
}
