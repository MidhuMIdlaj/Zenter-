// update-employee-status.usecase.ts
import { inject, injectable } from "inversify";
import IEmployeeRepository from "../../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../../types";
import { ResponseDTO } from "../../../../domain/dtos/Response";
import { StatusCode } from "../../../../shared/enums/statusCode";
import { ISoftDeleteEmployeeUseCase } from "../../../interface/admin/employee/delete-employee-usecase-interface";

@injectable()
export class SoftDeleteEmployeeUseCase  implements ISoftDeleteEmployeeUseCase {
    constructor(
        @inject(TYPES.IEmployeeRepository) private employeeRepo: IEmployeeRepository
    ) {}
    async execute(employeeId: string): Promise<ResponseDTO>{
        try {
            const employee = await this.employeeRepo.findByEmployeeId(employeeId);
             if (!employee) {
             return {
              success: false,
              message: "Employee not found",
              statusCode: StatusCode.NOT_FOUND
            };
           }
            if (employee.isDeleted) {
            return {
            success: false,
            data: employee,
            message: "Employee already deleted",
            statusCode: StatusCode.BAD_REQUEST
           };
          }
            const updatedEmployee =  await this.employeeRepo.softDeleteEmployee(employeeId);
            return {
            success: true,
            data : updatedEmployee,
            message: "Employee soft deleted successfully",
            statusCode: StatusCode.OK
          };
        } catch (error) {
            console.error("Error in UpdateEmployeeStatusUseCase:", error);
            throw error; 
        }
    }
}