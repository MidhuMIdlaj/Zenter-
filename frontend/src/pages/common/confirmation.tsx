import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  type: 'warning' | 'success' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  type,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;
  
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={28} className="text-green-600" />,
          bgColor: 'bg-green-100',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'danger':
        return {
          icon: <XCircle size={28} className="text-red-600" />,
          bgColor: 'bg-red-100',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
      default:
        return {
          icon: <AlertTriangle size={28} className="text-amber-600" />,
          bgColor: 'bg-amber-100',
          buttonColor: 'bg-amber-600 hover:bg-amber-700'
        };
    }
  };
  
  const { icon, bgColor, buttonColor } = getTypeStyles();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="text-center mb-6">
          <div className={`w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full ${bgColor}`}>
            {icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            {cancelLabel}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white transition-colors text-sm ${buttonColor}`}
          >
            {confirmLabel}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;