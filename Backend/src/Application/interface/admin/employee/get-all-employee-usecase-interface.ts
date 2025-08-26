import { ResponseDTO } from "../../../../domain/dtos/Response";

export interface IGetAllEmployeesUseCase {
  execute(page: number, limit: number): Promise<ResponseDTO>;
}
