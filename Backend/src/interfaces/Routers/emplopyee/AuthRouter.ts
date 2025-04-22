import express from "express";
import EmployeeController  from "../../controllers/employee/EmployeeController"; 
const employeeController = new EmployeeController();  
const router = express.Router();

router.post('/loginEmployee', employeeController.login);
router.post('/requestResetPassword', employeeController.requestResetPassword);
router.post('/ResendOtp', employeeController.resendOTP);
router.post('/resetPassword', employeeController.resetPassword);
export default router;