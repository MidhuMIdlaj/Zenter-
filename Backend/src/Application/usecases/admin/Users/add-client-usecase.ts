import { inject, injectable } from "inversify";
import IUserRepository from "../../../../domain/Repository/i-user-repository";
import { Product } from "../../../../domain/entities/User";
import { TYPES } from "../../../../types";
import { ICreateUserUsecase } from "../../../../domain/dtos/user-usecase/create-user-usecase-interface";
import { IAddClientUseCase } from "../../../interface/admin/user/add-client-usecase-interface";

@injectable()
export class AddClientUseCase implements IAddClientUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private clientRepo : IUserRepository
  ){}

  async execute(
    email: string,
    clientName: string,
    attendedDate: Date,
    contactNumber: string,
    address: string,
    products: Product[]
  ): Promise<ICreateUserUsecase | null> {
    const existingClient = await this.clientRepo.findByEmail(email);
    
    if (existingClient) {
      return await this.clientRepo.addProductsToClient(email, products);
    } else {
      return await this.clientRepo.createUser(
        email,
        clientName,
        attendedDate,
        contactNumber,
        address,
        products
      );
    }
  }
}