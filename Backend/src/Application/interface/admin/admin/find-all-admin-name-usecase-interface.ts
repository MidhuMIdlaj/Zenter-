
export interface IFindAdminNameUseCase {
  execute(id: string): Promise<string | null>;
}
