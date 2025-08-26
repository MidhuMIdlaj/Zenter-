import express from "express";
import AdminController from "../../controllers/admin/admin-auth-controller";
import { checkRole, verifyToken } from "../../../middleware/auth-middleware";
import { asyncHandler } from "../../../middleware/async-handler";
import { container } from "../../../infrastructure/DIContainer/container";
import { TYPES } from "../../../types";

const adminController = container.get<AdminController>(TYPES.AuthController)

const router = express.Router();
router.use(asyncHandler(verifyToken));
router.get('/getAllAdmins',checkRole(['admin','coordinator']) , adminController.getAllAdmins);
router.get('/profile',checkRole(['admin']), adminController.getProfile);
router.put('/updateProfile', checkRole(['admin']), adminController.updatedProfile);

export default router;
