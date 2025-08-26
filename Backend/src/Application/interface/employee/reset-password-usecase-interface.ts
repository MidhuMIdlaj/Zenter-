export interface IResetPasswordEmployeeUseCase {
  execute(email: string, password: string): Promise<void>;
}
