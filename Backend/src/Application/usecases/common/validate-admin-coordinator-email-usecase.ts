import { inject, injectable } from 'inversify';
import { IAdminRepository } from '../../../domain/Repository/i-admin-repository';
import  ICoordinatorRepository  from '../../../domain/Repository/i-employee-repository';
import { TYPES } from '../../../types';
import { IValidateAdminCoordinatorResult } from '../../../domain/dtos/complaint-usecase/validate-coordinator-admin-email-usecase-interface';
import { IValidateAdminCoordinatorUseCase } from '../../interface/common/validate-admin-coordinator-email-usecase-interface';


@injectable()
export class ValidateAdminCoordinator implements IValidateAdminCoordinatorUseCase{
  
  constructor(
    @inject(TYPES.IAdminRepository) private  adminRepository: IAdminRepository,
    @inject(TYPES.IEmployeeRepository) private coordinatorRepository: ICoordinatorRepository
  ) {}

  async execute(email: string): Promise<IValidateAdminCoordinatorResult> {
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