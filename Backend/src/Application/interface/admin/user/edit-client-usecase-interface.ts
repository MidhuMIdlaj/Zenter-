import { IEditClientUsecase } from "../../../../domain/dtos/user-usecase/edit-client-usecase-interface";
import { EditClientDTO } from "../../../usecases/admin/Users/edit-client-usecase";


export interface IEditClientUseCase {
  execute(dto: EditClientDTO): Promise<IEditClientUsecase | null>;
}
