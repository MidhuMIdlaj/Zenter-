import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, PenTool as Tool } from 'lucide-react';
import { Complaint } from '../../types/complaint';
import { acceptComplaint, rejectComplaint } from '../../api/cplaint/complaint';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import { toast } from 'react-toastify';

interface AcceptRejectModalProps {
  complaint: Complaint;
  mechanicId: string;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

const AcceptRejectModal: React.FC<AcceptRejectModalProps> = ({
  complaint,
  mechanicId,
  onClose,
  onAccept,
  onReject
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'accept' | 'reject'>('accept');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<'accept' | 'reject' | null>(null);
  const complaintId = useSelector((state: RootState) => state.Complaint.complaintId);

  const initiateAccept = () => {
    setConfirmationAction('accept');
    setShowConfirmation(true);
  };

  const initiateReject = () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    setConfirmationAction('reject');
    setShowConfirmation(true);
  };

  const handleAccept = async () => {  
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (complaintId) {
        await acceptComplaint(complaintId, mechanicId);
        
        toast.success('Complaint accepted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });        
        onAccept();
        onClose();
      } else {
        throw new Error('Complaint ID is missing.');
      }
    } catch (err) {
      console.error(err);
      toast.error((err instanceof Error ? err.message : 'Failed to accept complaint'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setError('Failed to accept complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (complaintId) {
        await rejectComplaint(complaintId, mechanicId, rejectionReason);
        
        toast.success('Complaint rejected successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        onReject();
        onClose();
      } else {
        throw new Error('Complaint ID is missing.');
      }
    } catch (err) {
      console.error(err);
      
      toast.error((err instanceof Error ? err.message : 'Failed to reject complaint'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      setError('Failed to reject complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmationAction === 'accept') {
      handleAccept();
    } else if (confirmationAction === 'reject') {
      handleReject();
    }
  };
  
  // Confirmation Dialog
  if (showConfirmation) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="text-center mb-6 pt-4">
            <div className={`w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full ${
              confirmationAction === 'accept' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {confirmationAction === 'accept' ? (
                <Tool size={36} className="text-green-600" />
              ) : (
                <AlertTriangle size={36} className="text-red-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {confirmationAction === 'accept' ? 'Accept Assignment?' : 'Reject Assignment?'}
            </h2>
            <p className="text-gray-600 mt-3 max-w-sm mx-auto">
              {confirmationAction === 'accept' 
                ? 'You are about to accept this repair assignment. You will be responsible for resolving this issue.'
                : 'You are about to reject this repair assignment. This action cannot be undone.'}
            </p>
          </div>
          
          {/* Task details summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Info size={16} className="text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Task Summary</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Customer:</span> {complaint.customerName || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Issue:</span> {complaint.description || 'N/A'}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowConfirmation(false)}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleConfirmAction}
              className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center justify-center min-w-[120px] ${
                confirmationAction === 'accept' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </>
              ) : (
                <>
                  {confirmationAction === 'accept' ? (
                    <>
                      <CheckCircle size={18} className="mr-2" />
                      Confirm Accept
                    </>
                  ) : (
                    <>
                      <XCircle size={18} className="mr-2" />
                      Confirm Reject
                    </>
                  )}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-5 mt-2">
          Complaint Assignment
        </h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="mb-3">
            <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">Customer</p>
            <p className="text-gray-900 font-medium">{complaint.customerName || complaint.customerEmail}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">Contact</p>
            <p className="text-gray-900 font-medium">{complaint.contactNumber || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">Description</p>
            <p className="text-gray-900">{complaint.description}</p>
          </div>
        </div>
        
        {/* Priority indicator */}
        <div className="flex items-center mb-5">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            complaint.priority === 'high' ? 'bg-red-500' : 
            complaint.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
          }`}></div>
          <span className="text-sm text-gray-600">
            {complaint.priority === 'high' ? 'High' : 
              complaint.priority === 'medium' ? 'Medium' : 'Low'} Priority
          </span>
        </div>
        
        {/* Tab navigation */}
        <div className="flex mb-5 border-b border-gray-200">
          <motion.button
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center ${
              activeTab === 'accept'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('accept')}
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.025)' }}
          >
            <CheckCircle size={16} className="mr-1.5" />
            Accept
            {activeTab === 'accept' && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                layoutId="tabIndicator"
              ></motion.div>
            )}
          </motion.button>
          
          <motion.button
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center ${
              activeTab === 'reject'
                ? 'text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reject')}
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.025)' }}
          >
            <XCircle size={16} className="mr-1.5" />
            Reject
            {activeTab === 'reject' && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                layoutId="tabIndicator"
              ></motion.div>
            )}
          </motion.button>
        </div>
        
        {activeTab === 'accept' ? (
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Tool className="text-green-600" size={28} />
              </div>
            </div>
            <p className="text-center text-gray-600 mb-4">
              By accepting this assignment, you agree to work on this complaint and resolve it as soon as possible.
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
              <div className="flex">
                <Info size={16} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  Once accepted, you'll be responsible for diagnosing the issue, completing the repair, and submitting proof of completion.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="text-amber-500 mr-2" size={18} />
              <p className="text-amber-700 font-medium">
                Please provide a reason for rejection
              </p>
            </div>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (error) setError(null);
              }}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                error && !rejectionReason ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Explain why you cannot accept this assignment..."
            ></textarea>
            
            {error && (
              <p className="mt-1.5 text-sm text-red-600 flex items-start">
                <AlertTriangle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>
        )}
        
        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
          
          {activeTab === 'accept' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={initiateAccept}
              className={`px-5 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg text-sm font-medium text-white flex items-center shadow-sm ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              <CheckCircle size={16} className="mr-1.5" />
              Accept Assignment
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={initiateReject}
              className={`px-5 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg text-sm font-medium text-white flex items-center shadow-sm ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              <XCircle size={16} className="mr-1.5" />
              Reject Assignment
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AcceptRejectModal;