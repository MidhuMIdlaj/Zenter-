import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", duration: 0.5 } 
    },
    exit: { 
      opacity: 0, 
      y: -50, 
      scale: 0.95, 
      transition: { duration: 0.3 } 
    }
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdrop}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div
          variants={modalVariants}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-6 flex items-center justify-between border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={24} />
              Confirm Deactivation
            </h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>
          
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate the customer{" "}
              <span className="font-medium text-gray-800">{customerName}</span>?
              <br /><br />
              The customer will be marked as inactive but their data will be preserved in the system.
            </p>
            <div className="flex gap-3 w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel 
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Deactivate
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmation;