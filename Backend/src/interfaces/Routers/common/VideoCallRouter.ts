// src/interfaces/Routers/videoCall/VideoCallRouter.ts
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../../middleware/authMiddleware';
import {VideoCallController} from '../../controllers/common/VideoController';

const videoCallController = new VideoCallController();
const router = express.Router();

router.use(verifyToken as (req: Request, res: Response, next: NextFunction) => void);
router.post('/send-invitations', videoCallController.sendInvitations);

export default router;