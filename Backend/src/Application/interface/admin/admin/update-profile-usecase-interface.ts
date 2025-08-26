import { IUpdateProfileUsecase } from "../../../../domain/dtos/Admin-usecase/update-admin-profile-usecase-interface";
import { UpdateProfileInput } from "../../../usecases/admin/update-profile-usecase";


export interface IUpdateProfileUseCase {
  execute(adminId: string, data: UpdateProfileInput): Promise<IUpdateProfileUsecase>;
}
