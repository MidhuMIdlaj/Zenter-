import { inject, injectable } from "inversify";
import Employee from "../../../../domain/entities/Employee";
import IEmployeeRepository from "../../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../../types";
import ISearchEmployeesUseCase from "../../../interface/admin/employee/search-employee-usecase-interface";

export interface SearchParams {
  searchTerm: string;
  status: string;
  position: string;
  page: number;
  limit: number;
}

export interface SearchResult {
  employees: Employee[];
  total: number;
}  

@injectable()
export class SearchEmployeesUseCase  implements ISearchEmployeesUseCase {
   constructor(
      @inject(TYPES.IEmployeeRepository) private employeeRepo : IEmployeeRepository
    ){}

  async execute(params: SearchParams): Promise<SearchResult> {
    const { searchTerm, status, position, page, limit } = params;

    return await this.employeeRepo.searchEmployees(
      searchTerm,
      status,
      position,
      page,  
      limit
    );
  }
}
