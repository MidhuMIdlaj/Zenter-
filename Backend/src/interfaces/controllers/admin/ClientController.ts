import { Request, Response } from "express";
import UserRepoImpl from "../../../infrastructure/repositories/UserRepoImpl";
import { AddClientUseCase } from "../../../Application/usecases/admin/addCLient";

export default class ClientController {
  private clientRepository = new UserRepoImpl();
  private addClientUseCase = new AddClientUseCase(this.clientRepository);

  addClient = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const {
        email,
        clientName,
        attendedDate,
        contactNumber,
        address,
        productName,
        quantity,
        version,
        brand,
        model,
        warrantyDate,
        guaranteeDate,
      } = req.body;

      const newClient = await this.addClientUseCase.execute(
        email,
        clientName,
        attendedDate,
        contactNumber,
        address,
        productName,
        quantity,
        version,
        brand,
        model,
        warrantyDate,
        guaranteeDate
      );
      res
        .status(201)
        .json({ message: "Client created successfully", client: newClient });
    } catch (err: any) {
      console.error("Error adding client:", err.message);
      res.status(500).json({ message: "Server error while adding client" });
    }
  };

  getClients = async (req: Request, res: Response) => {
    try {
      const clients = await this.clientRepository.getAllClients();
      res.status(200).json({ message: "fetched clients successfully", clients });
    } catch (err: any) {
      console.error("Error fetching clients:", err.message);
      res.status(500).json({ message: "Server error while fetchin clients" });
    }
  };
}
