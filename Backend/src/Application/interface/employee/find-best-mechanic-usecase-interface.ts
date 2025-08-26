import { ISafeEmployee } from "../../../domain/dtos/Employee-usecase/safe-employee-interface";

export interface IFindBestMechanicUseCase {
  execute(
    productType: string,
    priority: "low" | "medium" | "high" | "critical"
  ): Promise<ISafeEmployee | null>;
}
