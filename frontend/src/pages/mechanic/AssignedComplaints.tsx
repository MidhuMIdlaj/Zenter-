import React, { useState, } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Complaint } from '../../types/complaint';
import { acceptComplaint, rejectComplaint } from '../../api/cplaint/complaint';
import AcceptRejectModal from './AcceptRejectModal';

interface AssignedComplaintsListProps {
  complaints: Complaint[];
  isLoading: boolean;
  mechanicId: string;
  onComplaintUpdate?: (updatedComplaint: Complaint) => void; 
}

const AssignedComplaintsList: React.FC<AssignedComplaintsListProps> = ({
  complaints,
  isLoading,
  mechanicId,
  onComplaintUpdate 
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false);

  // Filter to only show pending complaints for this mechanic
  const pendingComplaints = complaints.filter(complaint => {
    console.log(`Complaint ${complaint._id}: workingStatus = ${complaint.workingStatus}, assignedMechanicId = ${complaint.assignedMechanicId}, mechanicId = ${mechanicId}`);
    return complaint.workingStatus === 'pending' && complaint.assignedMechanicId === mechanicId;
  });

  console.log('AssignedComplaintsList rendered with mechanicId:', pendingComplaints.map(c => c.workingStatus))

  const handleAccept = async (complaint: Complaint) => {
    try {
      const updatedComplaint = await acceptComplaint(complaint._id, mechanicId);
      if (onComplaintUpdate) {
        onComplaintUpdate(updatedComplaint);
      }
      setShowAcceptRejectModal(false);
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error accepting complaint:', error);
    }
  };

  const handleReject = async (complaint: Complaint) => {
    try {
      const response = await rejectComplaint(complaint._id, mechanicId, "Rejected by mechanic");
      let updatedComplaint: Complaint;
      
      if (response && typeof response.complaintId === 'object' && response.complaintId !== null) {
        updatedComplaint = response.complaintId;
      } else {
        // Use 'rejected' to match the schema
        updatedComplaint = { 
          ...complaint, 
          workingStatus: 'rejected' as const
        };
      }
      
      if (onComplaintUpdate) {
        onComplaintUpdate(updatedComplaint);
      }
      
      setShowAcceptRejectModal(false);
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error rejecting complaint:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check filtered complaints, not all complaints
  if (!pendingComplaints.length) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No pending complaints</h3>
        <p className="mt-1 text-sm text-gray-500">No pending complaints have been assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingComplaints.map((complaint) => (
        <motion.div
          key={complaint._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {complaint.description}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {complaint.customerName}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Created: {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-col items-end space-y-2 ml-4">
              <span 
                className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  complaint.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : complaint.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {complaint.priority}
              </span>
              
              <span 
                className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  complaint.workingStatus === 'completed' 
                    ? 'bg-blue-100 text-blue-800' 
                    : complaint.workingStatus === 'processing'
                    ? 'bg-purple-100 text-purple-800'
                    : complaint.workingStatus === 'rejected'
                    ? 'bg-gray-100 text-gray-800'
                    : complaint.workingStatus === 'accepted' // Using 'accepted' to match TypeScript type
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {complaint.workingStatus}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Contact</p>
              <p className="text-sm font-medium truncate">
                {complaint.customerPhone || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Product</p>
              <p className="text-sm font-medium truncate">
                {complaint.productName || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Created At </p>
              <p className="text-sm font-medium"> {complaint.createdAt 
                  ? new Date(complaint.createdAt).toLocaleString() 
                  : 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Last Update </p>
              <p className="text-sm font-medium truncate"> {complaint.updatedAt 
                  ? new Date(complaint.updatedAt).toLocaleString() 
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Accept/Reject button - This will always show since we're only showing pending complaints */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setSelectedComplaint(complaint);
                setShowAcceptRejectModal(true);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Accept/Reject
            </motion.button>
          </div>
        </motion.div>
      ))}

      {/* Accept/Reject Modal */}
      {showAcceptRejectModal && selectedComplaint && (
        <AcceptRejectModal
          complaint={selectedComplaint}
          mechanicId={mechanicId}
          onClose={() => {
            setShowAcceptRejectModal(false);
            setSelectedComplaint(null);
          }}
          onAccept={() => handleAccept(selectedComplaint)}
          onReject={() => handleReject(selectedComplaint)}
        />
      )}
    </div>
  );
};

export default AssignedComplaintsList;