import express from "express";
import { container } from "../../../infrastructure/DIContainer/container";
import EmployeeAuthController from "../../controllers/employee/employee-auth-controller";
import { TYPES } from "../../../types";
const router = express.Router();

const employeeController = container.get<EmployeeAuthController>(TYPES.EmployeeAuthController)

router.post('/loginEmployee', employeeController.login);
router.post('/requestResetPassword', employeeController.requestResetPassword);
router.post('/verifyOtp', employeeController.verifyOTP);
router.post('/ResendOtp', employeeController.resendOTP);
router.post('/resetPassword', employeeController.resetPassword);
export default router;