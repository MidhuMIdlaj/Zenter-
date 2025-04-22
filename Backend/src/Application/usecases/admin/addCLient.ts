import UserRepository from "../../../domain/interfaces/UserRepository";
import Client from "../../../domain/entities/User";

export class AddClientUseCase {
  constructor(private clientRepo: UserRepository) {}
  async execute(
    email: string,
    clientName: string,
    attendedDate: Date,
    contactNumber: string,
    address: string,
    productName: string,
    quantity: string,
    version: string,
    brand: string,
    model: string,
    warrantyDate: Date,
    guaranteeDate: Date,
  ): Promise<Client | null> {
    return await this.clientRepo.createUser(email, clientName, attendedDate, contactNumber, address, productName, quantity, version, brand, model, warrantyDate, guaranteeDate);
  }
}
