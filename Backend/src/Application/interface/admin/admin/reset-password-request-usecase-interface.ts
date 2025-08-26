export interface IResetPasswordRequestUseCase {
  execute(email: string): Promise<{ otp: string }>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
}
