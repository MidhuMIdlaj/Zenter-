import React from 'react';
import { User, Mail, Phone, Clock, Tag, CheckCircle, X, Image as ImageIcon, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { ComplaintFormData, coordinator, Mechanic } from '../../../../types/complaint';
import { StatusType } from '../../../../api/cplaint/complaint';

interface ComplaintDetailsProps {
  complaint: ComplaintFormData;
  mechanics: Mechanic[];
  coordinator: coordinator[];
  onClose: () => void;
}

type PriorityType = 'low' | 'medium' | 'high';

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, mechanics, coordinator, onClose }) => {
  
  const assignedMechanics = Array.isArray(complaint.assignedMechanicId)
    ? complaint.assignedMechanicId.map(assignment => {
        const mechanic = mechanics.find(m => m.mechanicId === assignment.mechanicId);
        return { ...assignment, mechanicDetails: mechanic };
      })
    : [];

  const coordinatorName = coordinator.find(c => c.id === complaint.createdBy)?.name || 'Unknown';

  const formatDate = (date?: string | Date) => {
    if (!date) return 'N/A';
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status?: string | StatusType) => {
    if (!status) return '#6B7280';
    const s = typeof status === 'string' ? status : status.status;
    switch (s.toLowerCase()) {
      case 'pending': return '#F59E0B';
      case 'processing': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'bg-gray-100 text-gray-800';
    switch(priority.toLowerCase() as PriorityType) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-2xl font-bold text-gray-800">Complaint Details</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
          <X size={28} />
        </button>
      </div>

      {/* Status & Priority */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: getStatusColor(complaint.status) + '20', color: getStatusColor(complaint.status) }}>
          Status: {complaint.status || complaint.status}
        </span>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(complaint.priority)}`}>
          {complaint.priority?.charAt(0).toUpperCase() + complaint.priority?.slice(1)} Priority
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Customer Info */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg shadow-inner">
          <h4 className="text-gray-700 font-semibold mb-3">Customer Information</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="text-blue-500 mr-2" />
              <p className="text-gray-900">{complaint.customerName || 'Unknown'}</p>
            </div>
            <div className="flex items-center">
              <Mail className="text-blue-500 mr-2" />
              <p className="text-gray-900">{complaint.customerEmail}</p>
            </div>
            <div className="flex items-center">
              <Phone className="text-blue-500 mr-2" />
              <p className="text-gray-900">{complaint.contactNumber}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-lg shadow-inner">
          <h4 className="text-gray-700 font-semibold mb-3">Timeline</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <Clock className="text-green-500 mr-2" />
              <p>Created: {formatDate(complaint.createdAt)}</p>
            </div>
            <div className="flex items-center">
              <Clock className="text-green-500 mr-2" />
              <p>Last Updated: {formatDate(complaint.updatedAt)}</p>
            </div>
            {complaint.completionDetails?.completedAt && (
              <div className="flex items-center">
                <CheckCircle className="text-green-600 mr-2" />
                <p>Completed: {formatDate(complaint.completionDetails.completedAt)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 p-5 rounded-lg mb-6 shadow-inner">
        <h4 className="text-gray-700 font-semibold mb-2">Description</h4>
        <p className="text-gray-900">{complaint.description}</p>
      </div>

      {/* Completion Details */}
      {complaint.completionDetails && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-lg mb-6 shadow-inner">
          <h4 className="text-gray-700 font-semibold mb-3">Completion Details</h4>

          {complaint.completionDetails.description && (
            <p className="mb-3"><strong>Description:</strong> {complaint.completionDetails.description}</p>
          )}

          {/* Photos */}
          {complaint.completionDetails.photos?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              {complaint.completionDetails.photos.map((photo, idx) => (
                <img key={idx} src={photo} alt={`Photo ${idx + 1}`} className="rounded-lg object-cover w-full h-32 border" />
              ))}
            </div>
          )}

          {/* Payment Info */}
          {complaint.completionDetails.amount && (
            <div className="flex items-center mb-2">
              <CreditCard className="text-purple-500 mr-2" />
              <p>Payment Amount: ${complaint.completionDetails.amount}</p>
            </div>
          )}
          {complaint.completionDetails.paymentMethod && (
            <div className="flex items-center">
              <CreditCard className="text-purple-500 mr-2" />
              <p>Payment Method: {complaint.completionDetails.paymentMethod}</p>
            </div>
          )}
        </div>
      )}

      {/* Assigned Mechanics */}
      <div className="bg-gray-50 p-5 rounded-lg mb-6 shadow-inner">
        <h4 className="text-gray-700 font-semibold mb-3">Assigned Mechanics</h4>
        {assignedMechanics.length > 0 ? (
          <ul className="space-y-2">
            {assignedMechanics.map((assignment, idx) => (
              <li key={idx} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{assignment.mechanicDetails?.name || 'Unknown'}</p>
                  <p className="text-gray-600 text-sm">Status: {assignment.status}</p>
                </div>
                {assignment.reason && <p className="text-red-500 text-sm">{assignment.reason}</p>}
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500">No mechanics assigned</p>}
      </div>

      {/* Close Button */}
      <div className="flex justify-end mt-4">
        <motion.button
          onClick={onClose}
          className="px-5 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close
        </motion.button>
      </div>
    </div>
  );
};

export default ComplaintDetails;
