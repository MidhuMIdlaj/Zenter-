export interface IInitialComplaintUseCase {
    execute(data: {
      registeredEmail: string;
      contactNumber: string;
      complaintDescription: string;
    }): Promise<{
      userId: string;
      userEmail: string;
      productIds: string[];
      message: string;
    }>;
  }
  