import express from "express";
import EmployeeController  from "../../controllers/admin/EmployeeController";   
const employeeController = new EmployeeController();
const router = express.Router();


router.post('/createEmployee', employeeController.addEmployee);

export default router;
