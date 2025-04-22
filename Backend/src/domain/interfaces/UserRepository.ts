import User from "../entities/User";

export default interface UserRepository {
  createUser(
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
  ): Promise<User | null>;
  comparePassword(
    inputPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
