import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { EmployeeFormData } from "../../../../api/admin/Employee";

interface DeleteConfirmationProps {
  employee: EmployeeFormData;
  onCancel: () => void;
  onConfirm: () => void;
  submitError: string | null;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  employee,
  onCancel,
  onConfirm,
  submitError,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-md"
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 rounded-full p-2">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Employee
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete {employee.employeeName}? This action cannot be undone.
        </p>

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DeleteConfirmation;