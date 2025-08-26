// src/interfaces/Routers/videoCall/VideoCallRouter.ts
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { checkRole, verifyToken } from '../../../middleware/auth-middleware';
import {VideoCallController} from '../../controllers/common/video-call-controller';
import { asyncHandler } from '../../../middleware/async-handler';
import { container } from '../../../infrastructure/DIContainer/container';
import { TYPES } from '../../../types';

const router = express.Router();
const videoCallController = container.get<VideoCallController>(TYPES.VideoCallController)
router.use(asyncHandler(verifyToken));
router.post('/send-invitations',checkRole(['admin']) , videoCallController.sendInvitations);

export default router;