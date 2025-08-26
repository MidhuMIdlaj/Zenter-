import { CustomerResponseDTO } from "../../../Application/usecases/common/find-customer-by-emial-usecase";

export interface IFindCustomerByEmailUsecase {
  exists: boolean;
  data: CustomerResponseDTO | null;
}
