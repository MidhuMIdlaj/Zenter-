import React from 'react';
import { Edit2, Trash2, Eye, AlertCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmployeeFormData, EmployeeResponse } from '../../../../api/admin/Employee';
import Table, { TableColumn } from '../../../reusableComponent/ReusableTable';

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
  // Define table columns
  const employeeColumns: TableColumn[] = [
    {
      key: "employeeName",
      header: "Employee",
      sortable: true
    },
    {
      key: "emailId",
      header: "Email",
      hidden: "md",
      icon: <Mail size={16} className="text-gray-400" />
    },
    {
      key: "position",
      header: "Position",
      hidden: "sm",
      capitalize: true
    },
    {
      key: "contactNumber",
      header: "Contact",
      hidden: "lg"
    },
    {
      key: "status",
      header: "Status"
    }
  ];

  const rowVariants = {
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
      <Table<EmployeeResponse>
        data={currentItems}
        columns={employeeColumns}
        onToggleStatus={(id, newStatus) => 
          onToggleStatus(id, newStatus as "active" | "inactive")
        }
        onView={(employee) => onView(employee)}
        onEdit={(employee) => onEdit(employee)}
        onDelete={(employee) => onDelete(employee)}
        idKey="id"
        nameKey="employeeName"
        emailKey="emailId"
        rowVariants={rowVariants}
        emptyMessage={{
          title: "No employees found",
          description: "Try adjusting your search or filter criteria"
        }}
      />
    </div>
  );
};

export default EmployeeList;