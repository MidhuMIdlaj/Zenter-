import { IAddEmployeeDTO } from "../../../../domain/dtos/Employee-usecase/add-employee-usecase-interface";
import { ResponseDTO } from "../../../../domain/dtos/Response";

export interface IAddEmployeeUseCase {
  execute(data: IAddEmployeeDTO): Promise<ResponseDTO<IAddEmployeeDTO>>;
}