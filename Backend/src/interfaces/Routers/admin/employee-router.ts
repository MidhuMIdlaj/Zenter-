import { Request, Response, NextFunction } from 'express';
import EmployeeController  from "../../controllers/admin/employee-controller";   
import { checkRole, verifyToken } from "../../../middleware/auth-middleware";
import express from 'express';
import { asyncHandler } from '../../../middleware/async-handler';
import { container } from '../../../infrastructure/DIContainer/container';
import { TYPES } from '../../../types';
const router = express.Router();

const employeeController = container.get<EmployeeController>(TYPES.EmployeeController)

router.use(asyncHandler(verifyToken));
router.post('/createEmployee', checkRole(['admin']), employeeController.addEmployee);
router.get('/getAllEmployees',checkRole(['admin', 'coordinator', 'mechanic']), employeeController.getAllEmployees);
router.patch('/updateEmployeeStatus/:employeeId',checkRole(['admin', 'coordinator' , 'mechanic']) , employeeController.updateStatus);
router.put('/editEmployee/:employeeId', checkRole(['admin']), employeeController.editEmployee);
router.patch('/softDeleteEmployee/:employeeId',checkRole(['admin']) ,employeeController.SoftDeleteUser)
router.get('/searchEmployee',checkRole(['admin']) ,employeeController.searchEmployees);

router.get('/:employeeId',checkRole(['coordinator' , 'mechanic']) ,employeeController.getEmployeeProfile);
router.patch('/:employeeId/profile',checkRole(['coordinator' , 'mechanic']), employeeController.updateEmployeeProfile);
export default router;
