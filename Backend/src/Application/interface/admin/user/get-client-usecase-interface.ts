import { GetClientsDTO, GetClientsResponse } from "../../../usecases/admin/Users/get-client-usecase";

export interface IGetClientsUseCase {
  execute(dto: GetClientsDTO): Promise<GetClientsResponse>;
}
