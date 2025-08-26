import express from "express";
import AdminController from "../../controllers/admin/admin-auth-controller";
import { container } from "../../../infrastructure/DIContainer/container";
import { TYPES } from "../../../types";
const router = express.Router();

const adminController = container.get<AdminController>(TYPES.AuthController)

router.post("/login", adminController.adminLogin);
router.post('/requestForgotPassword', adminController.requestForgotPassword);
router.post('/resendOtp', adminController.resendOTP);
router.post('/verifyOtp', adminController.verifyOTP);
router.post('/resetPassword', adminController.resetPassword);
router.post("/refresh-token", adminController.refreshToken);

export default router;
