import express from "express";
import ClientController  from "../../controllers/admin/ClientController";
const clientController = new ClientController();
const router = express.Router();

router.post('/createUser',clientController.addClient);
router.get('/getAllClients',clientController.getClients);
 export default router;