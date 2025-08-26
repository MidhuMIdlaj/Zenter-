import { inject, injectable } from "inversify";
import { IAdminRepository } from "../../../domain/Repository/i-admin-repository";
import IEmployeeRepository from "../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../types";
import { EmailInfo } from "../../../domain/dtos/Employee-usecase/get-coordinator-email-interface";
import { IGetCoordinatorEmails } from "../../interface/employee/get-coordinator-email-usecase-interface";


@injectable()
export default class GetCoordinatorEmails implements IGetCoordinatorEmails {
  constructor(
    @inject(TYPES.IEmployeeRepository) private employeeRepo: IEmployeeRepository,
    @inject(TYPES.IAdminRepository) private adminRepo: IAdminRepository
  ) {}
  async execute():Promise<EmailInfo[]> {
    const coordinators = await this.employeeRepo.findCoordinators();
    const admins = await this.adminRepo.findAllAdmins();


   const coordinatorEmails: EmailInfo[] = coordinators.map(emp => ({
    id: emp._id.toString(),
    email: emp.emailId,
    name: emp.employeeName || "Coordinator"
    }));

    const adminEmails: EmailInfo[] = admins.map(admin => ({
      id: admin._id,
      email: admin.email,
      name: "Admin"
    }));

    return [...coordinatorEmails, ...adminEmails];
  }
}
