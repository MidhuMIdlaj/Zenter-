import { inject, injectable } from "inversify";
import IEmployeeRepository from "../../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../../types";
import { ResponseDTO } from "../../../../domain/dtos/Response";
import { StatusCode } from "../../../../shared/enums/statusCode";
import { IGetAllEmployeesUseCase } from "../../../interface/admin/employee/get-all-employee-usecase-interface";

@injectable()
export class GetAllEmployeesUseCase implements IGetAllEmployeesUseCase {
  constructor(
    @inject(TYPES.IEmployeeRepository) private employeeRepo: IEmployeeRepository
  ) {}
  async execute(page: number, limit: number): Promise<ResponseDTO> {
  try {
    const { employees, total } = await this.employeeRepo.getAllEmployees(page, limit);
    return {
      success: true,
      message: "Fetched employees successfully",
      data: {
        employees,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit
        }
      },
      statusCode: StatusCode.OK
    };
  } catch (error: unknown) {
    let message = "Something went wrong";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      message,
      statusCode: StatusCode.INTERNAL_SERVER_ERROR
    };
  }
}
}
