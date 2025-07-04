import express from "express";
import AdminController from "../../controllers/admin/AuthController";
import { verifyToken } from "../../../middleware/authMiddleware";
import { Request, Response, NextFunction } from 'express';
const adminController  =  new AdminController();
const router = express.Router();

router.use(verifyToken as (req: Request, res: Response, next: NextFunction) => void);
router.get('/getAllAdmins/', adminController.getAllAdmins);
router.get('/profile', adminController.getProfile)
router.put('/updateProfile', adminController.updatedProfile);
export default router;
