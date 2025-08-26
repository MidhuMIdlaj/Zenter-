import { IGetAllAdminUsecase } from "../../../../domain/dtos/Admin-usecase/get-all-admin-usecase-interface";

export interface IGetAllAdminsUseCase {
  execute(
    page?: number,
    limit?: number
  ): Promise<{ admins: IGetAllAdminUsecase[]; total: number }>;
}