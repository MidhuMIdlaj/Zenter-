// interfaces/Routers/AuthRoutes.ts
import express from "express";
import AdminController from "../../controllers/admin/AuthController";
const adminController = new AdminController();
const router = express.Router();

router.post("/login", adminController.adminLogin);
router.post('/requestForgotPassword', adminController.requestForgotPassword);
router.post('/resendOtp', adminController.resendOTP);
router.post('/verifyOtp', adminController.verifyOTP);
router.post('/resetPassword', adminController.resetPassword);
export default router;