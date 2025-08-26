import { inject, injectable } from "inversify";
import IUserRepository from "../../../../domain/Repository/i-user-repository";
import Client from "../../../../domain/entities/User";
import { TYPES } from "../../../../types";
import { IEditClientUsecase } from "../../../../domain/dtos/user-usecase/edit-client-usecase-interface";
import { IEditClientUseCase } from "../../../interface/admin/user/edit-client-usecase-interface";

export interface EditClientDTO {
  clientId: string;
  updateData: Partial<Client>;
}

@injectable()
export class EditClientUseCase implements IEditClientUseCase {
   constructor(
      @inject(TYPES.IUserRepository) private clientRepo : IUserRepository
   ){}
  async execute(dto: EditClientDTO): Promise<IEditClientUsecase | null> {
    const { clientId, updateData } = dto;
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    const updatedClient = await this.clientRepo.updateClient(clientId, updateData);
    return updatedClient;
  }
}
