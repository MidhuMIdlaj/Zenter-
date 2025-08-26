import { SearchResult } from "../../../usecases/admin/Users/search-client-usecase";

export default interface ISearchClientsUseCase {
  execute(
    searchTerm: string,
    status: string,
    page: number,
    limit: number
  ): Promise<SearchResult>;
}