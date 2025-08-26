import { inject, injectable } from "inversify";
import IUserRepository from "../../../../domain/Repository/i-user-repository";
import { TYPES } from "../../../../types";
import { ResponseDTO } from "../../../../domain/dtos/Response";
import ISoftDeleteUserUseCase from "../../../interface/admin/user/delete-client-usecase-interface";

@injectable()
export class SoftDeleteUserUseCase implements ISoftDeleteUserUseCase  {
  constructor(
    @inject(TYPES.IUserRepository) private clientRepo: IUserRepository
  ) {}

  async execute(clientId: string): Promise<ResponseDTO<null>> {
    if (!clientId) {
      throw new Error("Client ID is required");
    }

    const result = await this.clientRepo.softDeleteUser(clientId);

    if (!result) {
      return {
        success: false,
        message: "User not found or already deleted",
        statusCode: 404
      };
    }

    return {
      success: true,
      message: "User soft deleted successfully",
      statusCode: 200
    };
  }
}
