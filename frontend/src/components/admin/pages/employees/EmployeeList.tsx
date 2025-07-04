import React from 'react';
import { Edit2, Trash2, Eye, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmployeeFormData, EmployeeResponse } from '../../../../api/admin/Employee';

interface EmployeeListProps {
  isLoading: boolean;
  currentItems: EmployeeResponse[];
  onView: (employee: EmployeeFormData) => void;
  onEdit: (employee: EmployeeFormData) => void;
  onDelete: (employee: EmployeeFormData) => void;
  onToggleStatus: (id: string, newStatus: 'active' | 'inactive') => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
   isLoading,
  currentItems,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600"
          ></motion.div>
          <p className="mt-4 text-gray-600 font-medium">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
            <th className="p-4 font-medium">Employee</th>
            <th className="p-4 font-medium hidden md:table-cell">Email</th>
            <th className="p-4 font-medium hidden sm:table-cell">Position</th>
            <th className="p-4 font-medium hidden lg:table-cell">Contact</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentItems.length > 0 ? (
            currentItems.map((employee, index) => (
              <motion.tr
                key={employee.employeeId}
                custom={index}
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                className="hover:bg-blue-50 transition-colors group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-medium border-2 border-blue-200 shadow-sm">
                      {employee.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {employee.employeeName}
                      </p>
                      <p className="text-sm text-gray-500 md:hidden">
                        {employee.emailId}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <p className="text-gray-700">{employee.emailId}</p>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <p className="text-gray-700 capitalize">{employee.position}</p>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <p className="text-gray-700">{employee.contactNumber}</p>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleStatus(
                      employee.id!,
                      employee.status === "active" ? "inactive" : "active"
                    )}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      employee.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${employee.status === "active" ? "bg-green-500" : "bg-red-500"}`}></span>
                      {employee.status}
                    </span>
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onView(employee)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(employee)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(employee)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle size={48} className="text-gray-300 mb-4" />
                  <p className="text-lg font-medium">No employees found</p>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;