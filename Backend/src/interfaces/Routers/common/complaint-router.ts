import express from 'express';
import ComplaintController from '../../controllers/common/complaint-controller';
import { checkRole, verifyToken } from '../../../middleware/auth-middleware';
import { asyncHandler } from '../../../middleware/async-handler';
import { container } from '../../../infrastructure/DIContainer/container';
import { TYPES } from '../../../types';
import { MulterConfig } from '../../../infrastructure/Services/multer-service';
const multerConfig = new MulterConfig()
const upload = multerConfig.getUpload();
const router = express.Router();

const complaintController = container.get<ComplaintController>(TYPES.ComplaintController)

router.use(asyncHandler(verifyToken));
router.get('/getAllComplaint',checkRole([ 'admin','coordinator','mechanic']) ,complaintController.getAllComplaints)
router.post('/initialCreate',checkRole([ 'admin','coordinator']) ,complaintController.findCustomerByEmail);
router.post('/createComplaint',checkRole([ 'admin','coordinator']) , complaintController.createClientComplaint);
router.get('/available-mechanics',checkRole([ 'admin','coordinator']) ,complaintController.getAvailableMechanicsHandler)
router.post('/validate-email', checkRole([ 'admin','coordinator']) ,complaintController.validateAdminCoordinatorEmail);
router.get('/customer-emails', checkRole([ 'admin','coordinator' , 'mechanic']), complaintController.getCustomerEmails);
router.get('/coordinator-emails',checkRole([ 'admin','coordinator']) , complaintController.getCoordinatorEmails);
router.get('/by-coordinator', checkRole([ 'admin','coordinator']), complaintController.getComplaintsByCoordinator)

router.get('/getMechanicComplaint/:id', checkRole([ 'mechanic']), complaintController.getMechanicComplaint)
router.post('/acceptComplaint/:id', checkRole(['mechanic']), complaintController.acceptComplaint)
router.post('/rejectComplaint/:id', checkRole(['mechanic']) , complaintController.rejectComplaint);
router.patch('/ChangeStatus/:id',checkRole(['mechanic' , 'coordinator']) , complaintController.ChangeStatus)
router.put( "/deleteComplaint/:id",checkRole(['coordinator' ,'admin']) ,complaintController.DeleteComplaint)
router.put('/updateComplaint/:id', checkRole(['mechanic', 'coordinator']), complaintController.updateComplaint);
router.post('/completeTask',checkRole(['mechanic']),upload.array('photos', 10), complaintController.completeTask);
export default router;