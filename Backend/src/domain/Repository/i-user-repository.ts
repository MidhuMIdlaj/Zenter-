import Client from "../entities/User";
import User, { Product } from "../entities/User";
export default interface IUserRepository {
  createUser(
    email: string,
    clientName: string,
    attendedDate: Date,
    contactNumber: string,
    address: string,
    products: Product[]
  ): Promise<User | null>;

   searchClients(
    searchTerm: string,
    status: string,
    page: number,
    limit: number
  ): Promise<{ clients: Client[]; total: number }>;
  getCustomerEmails(): Promise<{ email: string; name: string }[]>;
  getClientById(id: string): Promise<Client | null>;
  softDeleteUser(id: string): Promise<boolean>;
  addProductsToClient(
    email: string,
    products: Product[]
  ): Promise<User | null>;
  
  getAllClients(page: number, limit: number): Promise<{ clients: Client[]; total: number }>;
  comparePassword(
    inputPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  updateClient(
    id: string,
    data: Partial<Omit<User, 'id'>>
  ): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateClientStatus(id: string, status: string): Promise<boolean>;
}
