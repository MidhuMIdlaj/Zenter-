import express from 'express';
import ComplaintController from '../../controllers/common/ComplaintController';
import { verifyToken } from '../../../middleware/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import upload from '../../../utils/multer';

const router = express.Router();
const complaintController = new ComplaintController();
router.use(verifyToken as (req: Request, res: Response, next: NextFunction) => void);
router.get('/getAllComplaint', complaintController.getAllComplaints)
router.post('/initialCreate', complaintController.findCustomerByEmail);
router.post('/createComplaint', complaintController.createClientComplaint);
router.get('/available-mechanics', complaintController.getAvailableMechanicsHandler)
router.post('/validate-email',complaintController.validateAdminCoordinatorEmail);
router.get('/customer-emails', complaintController.getCustomerEmails);
router.get('/coordinator-emails', complaintController.getCoordinatorEmails);
router.get('/by-coordinator', complaintController.getComplaintsByCoordinator)

router.get('/getMechanicComplaint/:id', complaintController.getMechanicComplaint)
router.post('/acceptComplaint/:id', complaintController.acceptComplaint)
router.post('/rejectComplaint/:id', complaintController.rejectComplaint);
router.patch('/ChangeStatus/:id', complaintController.ChangeStatus)
router.put( "/deleteComplaint/:id", complaintController.DeleteComplaint)
router.put('/updateComplaint/:id', complaintController.updateComplaint);
router.post('/completeTask', upload.array('photos', 10), complaintController.completeTask);
export default router;