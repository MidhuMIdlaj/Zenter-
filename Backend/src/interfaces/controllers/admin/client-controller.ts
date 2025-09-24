import { RequestHandler, Request, Response, NextFunction } from "express";
import { StatusCode } from "../../../shared/enums/statusCode";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import { IAddClientUseCase } from "../../../Application/interface/admin/user/add-client-usecase-interface";
import ISoftDeleteUserUseCase from "../../../Application/interface/admin/user/delete-client-usecase-interface";
import { IEditClientUseCase } from "../../../Application/interface/admin/user/edit-client-usecase-interface";
import { IGetClientByIdUseCase } from "../../../Application/interface/admin/user/get-client-by-id-usecase-interface";
import { IGetClientsUseCase } from "../../../Application/interface/admin/user/get-client-usecase-interface";
import ISearchClientsUseCase from "../../../Application/interface/admin/user/search-client-usecase-interface";
import IUpdateClientStatusUseCase from "../../../Application/interface/admin/user/update-client-status-usecase-interface";

@injectable()
export default class ClientController {
  constructor(
    @inject(TYPES.addClientUsecases) private addClientUseCase : IAddClientUseCase,
    @inject(TYPES.getClientsUsecases) private getClientsUsecases : IGetClientsUseCase,
    @inject(TYPES.editClientUsecases) private editClientUsecases : IEditClientUseCase,
    @inject(TYPES.updateClientSatatusUsecases) private updateClientSatatusUsecases :  IUpdateClientStatusUseCase,
    @inject(TYPES.findClientByIdUsecases) private findClientByIdUsecases : IGetClientByIdUseCase,
    @inject(TYPES.softDeleteUserUsecases) private deleteUserUsecases : ISoftDeleteUserUseCase,
    @inject(TYPES.searchClientUsecases) private searchClientUsecases : ISearchClientsUseCase
  ){}
  
  addClient: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        email,
        clientName,
        attendedDate,
        contactNumber,
        address,
        products
      } = req.body;
     
      if (!products || !Array.isArray(products)) {
        res.status(StatusCode.BAD_REQUEST).json({ message: "Products must be an array" });
        return;
      }
      const newClient = await this.addClientUseCase.execute(
        email,
        clientName,
        attendedDate,
        contactNumber,
        address,
        products
      );

      res.status(StatusCode.CREATED).json({
        message: newClient ? "Client created/updated successfully" : "Failed to create/update client",
        client: newClient,
      });
    } catch (err: unknown) {
      next(err instanceof Error ? err : new Error("Unknown error occurred"));
   }
  };

  getClients: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { clients, total } = await this.getClientsUsecases.execute({page, limit});
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetched clients successfully",
        clients,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (err: unknown) {
     next(err instanceof Error ? err : new Error("Unknown error occurred"));
   }
  };

  editClient: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientId = req.params.ClientId;
      const updateData = req.body;

      if (!clientId) {
        res.status(StatusCode.BAD_REQUEST).json({ message: "Client ID is required" });
        return;
      }

      const updatedClient = await this.editClientUsecases.execute(
       { clientId,
        updateData}
      );

      if (!updatedClient) {
        res.status(StatusCode.NOT_FOUND).json({ message: "Client not found" });
        return;
      }

      res.status(StatusCode.OK).json({
        message: "Client updated successfully",
        client: updatedClient,
      });
      return;
    } catch (err: unknown) {
      next(err);
    }
  };

  updateStatus: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ClientId } = req.params;
      const { status } = req.body;
      const clientId = ClientId
      const success = await this.updateClientSatatusUsecases.execute(
        {clientId,
        status}
      );
      if (!success) {
        res.status(StatusCode.NOT_FOUND).json({
          message: "Client not found or status unchanged",
        });
        return;
      }
      res.status(StatusCode.OK).json({ message: "Client status updated" });
    } catch (err: unknown) {
      next(err);
    }
  };

  getClientId: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const client = await this.findClientByIdUsecases.execute(id);
      if (!client) {
        res.status(StatusCode.NOT_FOUND).json({ message: "Client not found" });
        return;
      }
      res.status(StatusCode.OK).json(client);
    } catch (error) {
      next(error);
    }
  };

  SoftDeleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ClientId } = req.params;
      const result = await this.deleteUserUsecases.execute(ClientId);

      if (!result) {
        res.status(StatusCode.NOT_FOUND).json({ message: "User not found or already deleted" });
        return;
      }
      res.status(StatusCode.OK).json({ message: "User soft deleted successfully" });
      return;
    } catch (error: unknown) {
      next(error);
    }
  };

  searchClients: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { searchTerm, status } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { clients, total } = await this.searchClientUsecases.execute(
        searchTerm as string,
        status as string,
        page,
        limit
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Searched clients successfully",
        clients,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (err: unknown) {
      next(err);
    }
  };
}