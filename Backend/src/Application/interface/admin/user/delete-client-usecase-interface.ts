import { ResponseDTO } from "../../../../domain/dtos/Response";

export default interface ISoftDeleteUserUseCase {
  execute(clientId: string): Promise<ResponseDTO<null>>;
}
