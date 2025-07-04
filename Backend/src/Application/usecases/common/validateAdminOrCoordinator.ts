import { AdminRepository } from '../../../domain/Repository/AdminRepository';
import  CoordinatorRepository  from '../../../domain/Repository/EmployeeRepository';

export class ValidateAdminCoordinator {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly coordinatorRepository: CoordinatorRepository
  ) {}

  async execute(email: string): Promise<{
    isValid: boolean;
    userType?: 'admin' | 'coordinator';
    user?: { email: string };
    id : string
  }> {
    const admin = await this.adminRepository.findByEmail(email);
    if (admin) {
      return {
        isValid: true,
        userType: 'admin',
        user: { email: admin.email},
        id : admin._id
      };
    }

    const coordinator = await this.coordinatorRepository.findByEmail(email);
    if (coordinator) {
      return {
        isValid: true,
        userType: 'coordinator',
        user: { email: coordinator.emailId },
        id :coordinator.id
      };
    }
    return { isValid: false, id: '' };
  }
}