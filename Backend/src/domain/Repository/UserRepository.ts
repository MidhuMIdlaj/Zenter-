import User, { Product } from "../entities/User";
export default interface UserRepository {
  createUser(
    email: string,
    clientName: string,
    attendedDate: Date,
    contactNumber: string,
    address: string,
    products: Product[]
  ): Promise<User | null>;

  addProductsToClient(
    email: string,
    products: Product[]
  ): Promise<User | null>;
  
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
