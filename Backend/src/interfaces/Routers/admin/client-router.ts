import express from "express";
import ClientController from "../../controllers/admin/client-controller";
import { asyncHandler } from "../../../middleware/async-handler";
import { checkRole, verifyToken } from "../../../middleware/auth-middleware";
import { container } from "../../../infrastructure/DIContainer/container";
import { TYPES } from "../../../types";

const router = express.Router();
const clientController = container.get<ClientController>(TYPES.ClientController)
router.use(asyncHandler(verifyToken));
router.post('/createUser',checkRole(['admin', 'coordinator']), clientController.addClient);
router.get('/getAllClients',checkRole(['admin', 'coordinator','mechanic']), clientController.getClients);
router.get('/getClient/:id', checkRole(['admin', 'coordinator','mechanic']),clientController.getClientId)
router.patch('/editClient/:ClientId',checkRole(['admin', 'coordinator','mechanic']), clientController.editClient);
router.patch('/updateStatusClient/:ClientId',checkRole(['admin', 'coordinator','mechanic']) ,clientController.updateStatus);
router.patch('/softDeleteUser/:ClientId',checkRole(['admin', 'coordinator','mechanic']) , clientController.SoftDeleteUser)
router.get('/search',checkRole(['admin', 'coordinator','mechanic']) ,clientController.searchClients);

export default router;