import { ResponseDTO } from "../../../../domain/dtos/Response";
import { AdminLoginResponse } from "../../../usecases/admin/admin-auth-usecase";

export interface ILoginAdminUseCase {
  execute(email: string, password: string): Promise<ResponseDTO<AdminLoginResponse>>;
}