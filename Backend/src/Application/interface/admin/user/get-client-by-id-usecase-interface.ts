import { IGetClientByIdUsecase } from "../../../../domain/dtos/user-usecase/get-client-by-id-usecase-interface";

export interface IGetClientByIdUseCase {
  execute(id: string): Promise<IGetClientByIdUsecase | null>;
}
