import UserRepository from "../../../../domain/Repository/UserRepository";
import Client, { Product } from "../../../../domain/entities/User";

export class AddClientUseCase {
  constructor(private clientRepo: UserRepository) {}

  async execute(
    email: string,
    clientName: string,
    attendedDate: Date,
    contactNumber: string,
    address: string,
    products: Product[]
  ): Promise<Client | null> {
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