
export interface SoftDeleteEmployeeInput {
  employeeId: string;
}

export interface SoftDeleteEmployeeOutput {
  success: boolean;
  data?: any;
  message: string;
  statusCode: number;
}
