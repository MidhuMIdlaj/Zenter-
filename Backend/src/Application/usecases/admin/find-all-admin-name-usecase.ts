import { inject, injectable } from "inversify";
import { IAdminRepository } from "../../../domain/Repository/i-admin-repository";
import { TYPES } from "../../../types";
import { IFindAdminNameUseCase } from "../../interface/admin/admin/find-all-admin-name-usecase-interface";

@injectable()
export class FindAdminNameUseCase implements IFindAdminNameUseCase {
   constructor(
     @inject(TYPES.IAdminRepository) private adminRepo : IAdminRepository
    ){}

  async execute(id: string): Promise<string | null> {
    if (!id || typeof id !== 'string') {
      throw new Error("Invalid ID provided");
    }

    return await this.adminRepo.findByAdminName(id);
  }
}
