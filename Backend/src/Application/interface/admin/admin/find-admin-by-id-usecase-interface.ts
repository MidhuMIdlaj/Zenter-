import { IFindAdminByIdResponse } from "../../../../domain/dtos/Admin-usecase/find-admin-by-id-usecase-interface";

export interface IFindAdminByIdUseCase {
  execute(adminId: string): Promise<IFindAdminByIdResponse | null>;
}