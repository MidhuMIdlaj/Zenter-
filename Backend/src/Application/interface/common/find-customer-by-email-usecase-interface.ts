import { IFindCustomerByEmailUsecase } from "../../../domain/dtos/complaint-usecase/find-customer-by-email-usecase-interface";

export default interface IFindCustomerByEmailUseCase {
  execute(email: string): Promise<IFindCustomerByEmailUsecase>;
}
