import UserModel from "../db/models/EmployeeModel";
import User from "../../domain/entities/User";
import UserRepository from "../../domain/interfaces/UserRepository";
import bcrypt from "bcrypt";
import ClientModel from "../db/models/Admin/ClientModel";

export default class UserRepoImpl implements UserRepository {
  async createUser(
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
  ): Promise<User | null> {
    let user = await ClientModel.create({ email, clientName, attendedDate , contactNumber, address, productName, quantity, version, brand, model, warrantyDate, guaranteeDate });
    console.log(user , "user created successfully")
    return user ;
  }

  async comparePassword(input: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(input, hashed);
  }

  async getAllClients(): Promise<User[]> {
    const clients = await ClientModel.find({})
    return clients.map(client => new User(client.email, client.clientName, client.attendedDate, client.contactNumber, client.address, client.productName, client.quantity, client.version, client.brand, client.model, client.warrantyDate, client.guaranteeDate));
  }
}
