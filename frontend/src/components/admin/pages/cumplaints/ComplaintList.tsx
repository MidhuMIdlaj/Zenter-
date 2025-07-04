import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ComplaintResponse } from "../../../../types/complaint";

// In ComplaintList.tsx
interface ComplaintListProps {
  isLoading: boolean;
  currentItems: ComplaintResponse[];  
  getStatusColor?: (workingStatus: string) => string;
  onView: (complaint: ComplaintResponse) => void;  
  onDelete: (id: string) => void;
}

const ComplaintList: React.FC<ComplaintListProps> = ({
  isLoading,
  currentItems,
  onView,
  onDelete,
}) => {
  type StatusValue = 
    | 'pending' 
    | 'processing' 
    | 'accept' 
    | 'in-progress' 
    | 'resolved' 
    | 'cancelled'
    | 'completed'
    | 'rejected'
    | string;

  const StatusBadge = ({ workingStatus, statusObj }: { 
  workingStatus?: StatusValue;
  statusObj?: { status: string; updatedAt: string; updatedBy: string };
}) => {
  const actualStatus = statusObj?.status || workingStatus || "";
  
  const statusText: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    accept: "Accepted",
    "in-progress": "In Progress",
    resolved: "Resolved",
    cancelled: "Cancelled",
    completed: "Completed",
    rejected: "Rejected",
  };

  const statusColors: Record<string, string> = {
    pending: "#F59E0B",
    processing: "#3B82F6",
    accept: "#10B981",
    "in-progress": "#3B82F6",
    resolved: "#10B981",
    cancelled: "#EF4444",
    completed: "#10B981",
    rejected: "#EF4444",
    "": "#6B7280",
  };

  const color = statusColors[actualStatus] || "#6B7280";
  const bgColor = `${color}20`;
  
  return (
    <div
      className="px-3 py-1 rounded-full inline-flex items-center"
      style={{ backgroundColor: bgColor }}
    >
      <span
        className="w-2 h-2 rounded-full mr-1.5"
        style={{ backgroundColor: color }}
      ></span>
      <span className="text-xs font-medium" style={{ color }}>
        {statusText[actualStatus] || actualStatus}
      </span>
    </div>
  );
};

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    let color, bgColor;

    switch (priority) {
      case "low":
        color = "#10B981";
        bgColor = "#10B98120";
        break;
      case "medium":
        color = "#F59E0B";
        bgColor = "#F59E0B20";
        break;
      case "high":
        color = "#EF4444";
        bgColor = "#EF444420";
        break;
      default:
        color = "#6B7280";
        bgColor = "#6B728020";
    }

    return (
      <div
        className="px-3 py-1 rounded-full inline-flex items-center"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-xs font-medium" style={{ color }}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (currentItems.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No complaints found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by registering a new complaint.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
              <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
          >
            Complaint No
          </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Priority
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((complaint) => (
            <motion.tr
              key={complaint.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                 {complaint.complaintNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {complaint.customerName
                        ? `${complaint.customerName.split(" ")[0][0]}${
                            complaint.customerName.split(" ")[1]?.[0] || ""
                          }`
                        : complaint.customerEmail.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {complaint.customerName || "Unknown Customer"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {complaint.customerEmail}
                    </div>
                    <div className="text-xs text-gray-400">
                      {complaint.contactNumber}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {complaint.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge
                  workingStatus={
                    (complaint.workingStatus ||
                      complaint.status ||
                      "") as StatusValue
                  }
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PriorityBadge priority={complaint.priority} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {complaint.createdAt
                  ? new Date(complaint.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onView(complaint)}
                    className="text-gray-500 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-blue-50"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(complaint?.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintList;