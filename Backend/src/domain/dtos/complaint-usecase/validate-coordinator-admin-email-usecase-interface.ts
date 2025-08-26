export interface IValidateAdminCoordinatorResult {
  isValid: boolean;
  userType?: 'admin' | 'coordinator';
  user?: { email: string };
  id: string;
}
