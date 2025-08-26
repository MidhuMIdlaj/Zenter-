import { inject, injectable } from "inversify";
import IUserRepository from "../../../../domain/Repository/i-user-repository";
import { TYPES } from "../../../../types";
import { IGetCustomerEmails } from "../../../interface/admin/user/get-customer-email-usecase";


@injectable()
export default class GetCustomerEmails implements IGetCustomerEmails{
   constructor(
        @inject(TYPES.IUserRepository) private clientRepo : IUserRepository
    ){}
  async execute(): Promise<{ email: string; name: string }[]> {
    return await this.clientRepo.getCustomerEmails();
  }
}
