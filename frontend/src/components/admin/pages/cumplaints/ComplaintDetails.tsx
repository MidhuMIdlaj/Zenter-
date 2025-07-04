import React from 'react';
import { User, Mail, Phone, Clock, Tag, CheckCircle, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ComplaintFormData, coordinator, Mechanic } from '../../../../types/complaint';
import { StatusType } from '../../../../api/cplaint/complaint';
import config from '../../../../config/config';

interface ComplaintDetailsProps {
  complaint: ComplaintFormData;
  mechanics: Mechanic[];
  coordinator: coordinator[];
  onClose: () => void;
  onEdit: () => void;
  createdByName?: string;
}

type PriorityType = 'low' | 'medium' | 'high';

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaint,
  mechanics,
  coordinator,
  onClose,
}) => {
  console.log(mechanics, 'mechanics')
  const assignedMechanics = Array.isArray(complaint.assignedMechanicId) 
    ? complaint.assignedMechanicId.map(assignment => {
        const mechanic = mechanics.find(m => m.mechanicId === assignment.mechanicId);
        return {
          ...assignment,
          mechanicDetails: mechanic
        };
      })
    : [];
  const coordinatorName = coordinator.find(c => c.id === complaint.createdBy)?.name || 'Unknown Coordinator';

  const formatDate = (date?: string | Date) => {
    if (!date) return 'N/A';
    
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  console.log(complaint, 'complaint' )
  const getStatusColor = (status: string | StatusType | undefined): string => {
    if (!status) return "#6B7280";
    
    const statusString = typeof status === 'string' ? status : status.status;
    if (!statusString) return "#6B7280";
    
    switch (statusString.toLowerCase()) {
      case "pending": return "#F59E0B";
      case "in-progress":
      case "processing": return "#3B82F6";
      case "resolved":
      case "completed": return "#10B981";
      case "cancelled": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getStatusText = (status: string | StatusType | undefined): string => {
    if (!status) return 'Unknown';
    return typeof status === 'string' ? status : status.status || 'Unknown';
  };
  
  const getPriorityColor = (priority: string | undefined): string => {
    if (!priority) return 'bg-gray-100 text-gray-800';
    
    switch(priority.toLowerCase() as PriorityType) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string | undefined): string => {
    if (!priority) return 'Unknown Priority';
    return `${priority.charAt(0).toUpperCase()}${priority.slice(1)} Priority`;
  };
  console.log(complaint.completionDetails?.photos[0], 'complaint.completionDetails?.photos[0]')
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Complaint Details
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <span 
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            color: getStatusColor(complaint.status),
            backgroundColor: getStatusColor(complaint.status) + '20'
          }}
        >
          <p className="text-sm font-medium">Status</p>
          <p>{getStatusText(complaint.status)}</p>
        </span>
        
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
          {getPriorityText(complaint.priority)}
        </span>
      </div>         
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div>
          <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Customer Information</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start mb-3">
              <User size={18} className="text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Customer Name</p>
                <p className="text-gray-900">{complaint.customerName || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-3">
              <Mail size={18} className="text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">{complaint.customerEmail}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone size={18} className="text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-gray-900">{complaint.contactNumber}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Complaint Timeline</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start mb-3">
              <Clock size={18} className="text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Created</p>
                <p className="text-gray-900">{formatDate(complaint.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-3">
              <Clock size={18} className="text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                <p className="text-gray-900">{formatDate(complaint.updatedAt)}</p>
              </div>
            </div>
            
            {complaint.resolvedAt && (
              <div className="flex items-start">
                <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Resolved</p>
                  <p className="text-gray-900">{formatDate(complaint.resolvedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Description</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-900">{complaint.description}</p>
        </div>
      </div>
      
      {/* Completion Details Section - Only shown if completionDetails exists */}
      {complaint.completionDetails && (
        <div className="mb-6">
          <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Completion Details</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Completion Description</p>
              <p className="text-gray-900">{complaint.completionDetails.description}</p>
            </div>
            
            {complaint.completionDetails.photos && complaint.completionDetails.photos.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ImageIcon size={16} className="mr-1" /> Completion Photos
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {complaint.completionDetails.photos.map((photo, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                 <img 
                    src={photo}
                    alt={`Completion photo ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      // Or use a placeholder:
                      // (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-start">
              <Clock size={18} className="text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Completed At</p>
                <p className="text-gray-900">{formatDate(complaint.completionDetails.completedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div>
          <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Assigned Mechanics</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            {assignedMechanics.length > 0 ? (
                  <div className="space-y-3">
                    {assignedMechanics.map((assignment, index) => (
                      <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <p className="font-medium text-gray-900">
                          {assignment.mechanicDetails?.name || 'Unknown Mechanic'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Status: {assignment.status || 'N/A'}
                        </p>
                        {assignment.reason && (
                          <p className="text-gray-600 text-sm">
                            Reason: {assignment.reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No mechanics assigned</p>
                )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Additional Information</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start mb-3">
              <Tag size={18} className="text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Created By</p>
                <p className="text-gray-900">
                  {coordinatorName || 'Unknown'}
                </p>
              </div>
            </div>
            
            {complaint.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                <p className="text-gray-900">{complaint.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <motion.button
          onClick={onClose}
          className="px-4 py-2 mr-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Close
        </motion.button>
      </div>
    </div>
  );
};

export default ComplaintDetails;