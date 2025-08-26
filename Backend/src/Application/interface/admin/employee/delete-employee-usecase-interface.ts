import { ResponseDTO } from "../../../../domain/dtos/Response";

export interface ISoftDeleteEmployeeUseCase {
  execute(employeeId: string): Promise<ResponseDTO>;
}
