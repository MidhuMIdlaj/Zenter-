export interface IUpdateProfileUsecase {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
