import { Router } from 'express';
import { container } from '../../../infrastructure/DIContainer/container';
import { TYPES } from '../../../types';
import { VideoCallHistoryController } from '../../controllers/common/video-call-history-controller';
import { asyncHandler } from '../../../middleware/async-handler';
import { checkRole, verifyToken } from '../../../middleware/auth-middleware';

const router = Router();

const videoCallHistoryController = container.get<VideoCallHistoryController>(TYPES.VideoCallHistoryController);

router.use(asyncHandler(verifyToken));
router.post('/create', checkRole(['admin']), videoCallHistoryController.createCallRecord.bind(videoCallHistoryController));
router.put('/update-participants/:roomId', checkRole(['mechanic', 'coordinator']), videoCallHistoryController.updateParticipants.bind(videoCallHistoryController));
router.get('/history', checkRole(['admin']), videoCallHistoryController.getCallHistory.bind(videoCallHistoryController));
router.put('/end/:roomId', checkRole(['admin']), videoCallHistoryController.endCall.bind(videoCallHistoryController));

export default router;