import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ComplaintFormData } from '../../../../types/complaint';

interface DeleteConfirmationProps {
  complaint: ComplaintFormData;
  onCancel: () => void;
  onConfirm: () => void;
  submitError: string | null;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  complaint,
  onCancel,
  onConfirm,
  submitError
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          Delete Complaint
        </h3>
        <p className="text-gray-600">
          Are you sure you want to delete this complaint? This action cannot be undone.
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700">Customer</p>
          <p className="text-gray-900">{complaint.customerName || complaint.customerEmail}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Description</p>
          <p className="text-gray-900 line-clamp-2">{complaint.description}</p>
        </div>
      </div>
      
      {submitError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {submitError}
        </div>
      )}
      
      <div className="flex justify-center gap-3">
        <motion.button
          onClick={onCancel}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        
        <motion.button
          onClick={onConfirm}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DeleteConfirmation;