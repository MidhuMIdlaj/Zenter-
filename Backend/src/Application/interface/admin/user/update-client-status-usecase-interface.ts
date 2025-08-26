import { ResponseDTO } from "../../../../domain/dtos/Response";
import { UpdateClientStatusDTO } from "../../../usecases/admin/Users/update-client-status-usecase";

export default interface IUpdateClientStatusUseCase {
  execute(dto: UpdateClientStatusDTO): Promise<ResponseDTO<null>>;
}