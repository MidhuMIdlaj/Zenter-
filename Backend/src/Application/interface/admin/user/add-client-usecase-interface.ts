import { ICreateUserUsecase } from "../../../../domain/dtos/user-usecase/create-user-usecase-interface";
import { Product } from "../../../../domain/entities/User";


export interface IAddClientUseCase {
  execute(
    email: string,
    clientName: string,
    attendedDate: Date,
    contactNumber: string,
    address: string,
    products: Product[]
  ): Promise<ICreateUserUsecase | null>;
}
