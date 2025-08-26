import { inject, injectable } from "inversify";
import IUserRepository from "../../../../domain/Repository/i-user-repository";
import Client from "../../../../domain/entities/User";
import { TYPES } from "../../../../types";
import { ISafeUserUsecase } from "../../../../domain/dtos/user-usecase/globel-user-interface";
import { IGetClientsUseCase } from "../../../interface/admin/user/get-client-usecase-interface";

export interface GetClientsDTO {
  page: number;
  limit: number;
}


export interface GetClientsResponse {
  clients: ISafeUserUsecase[];
  total: number;
  totalPages: number;
  currentPage: number;
}

@injectable()
export class GetClientsUseCase  implements IGetClientsUseCase {
   constructor(
      @inject(TYPES.IUserRepository) private clientRepo : IUserRepository
     ){}

  async execute(dto: GetClientsDTO): Promise<GetClientsResponse> {
    const { page, limit } = dto;
    const { clients, total } = await this.clientRepo.getAllClients(page, limit);
    return {
      clients,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }
}
