import { SearchParams, SearchResult } from "../../../usecases/admin/Employee/search-employee-usecase";

export default interface ISearchEmployeesUseCase {
  execute(params: SearchParams): Promise<SearchResult>;
}