// ReusableTable.tsx
import { motion } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import React from "react";

export interface TableColumn {
  key: string;
  header: string;
  hidden?: "sm" | "md" | "lg" | "xl";
  icon?: React.ReactNode;
  sortable?: boolean;
  capitalize?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn[];
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort?: (key: string) => void;
  onToggleStatus?: (id: string, newStatus: string) => void;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  statusKey?: string;
  priorityKey?: string;
  idKey?: string;
  nameKey?: string;
  emailKey?: string;
  emptyMessage?: {
    title: string;
    description: string;
  };
  rowVariants?: any;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  sortConfig,
  onSort,
  onToggleStatus,
  onView,
  onEdit,
  onDelete,
  statusKey = "status",
  priorityKey = "priority",
  idKey = "id",
  nameKey = "name",
  emailKey = "email",
  emptyMessage = {
    title: "No data found",
    description: "Try adjusting your search or filter criteria",
  },
  rowVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  },
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-left border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`p-4 font-medium ${
                  column.hidden ? `hidden ${column.hidden}:table-cell` : ""
                } ${column.sortable ? "cursor-pointer" : ""}`}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.icon && column.icon}
                  <span>{column.header}</span>
                  {column.sortable && sortConfig?.key === column.key && (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp size={16} className="text-blue-600" />
                    ) : (
                      <ChevronDown size={16} className="text-blue-600" />
                    )
                  )}
                </div>
              </th>
            ))}
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item, index) => (
              <motion.tr
                key={item[idKey]}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="hover:bg-blue-50 transition-colors group"
              >
                {columns.map((column) => (
                  <td
                    key={`${item[idKey]}-${column.key}`}
                    className={`p-4 ${
                      column.hidden ? `hidden ${column.hidden}:table-cell` : ""
                    }`}
                  >
                    {column.key === nameKey ? (
                      // Avatar + Name + Email
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-medium border-2 border-blue-200 shadow-sm">
                          {item[nameKey]?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            {item[nameKey]}
                          </p>
                          {!column.hidden && (
                            <p className="text-sm text-gray-500 md:hidden">
                              {item[emailKey]}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : column.key === statusKey ? (
                      // Status Badge with click handler
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onToggleStatus?.(item[idKey], item[statusKey] === "active" ? "inactive" : "active")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer
                          ${
                            item[statusKey] === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : item[statusKey] === "inactive"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : ["resolved", "completed", "accept"].includes(
                                  item[statusKey]
                                )
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : ["pending", "processing", "in-progress"].includes(
                                  item[statusKey]
                                )
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : ["cancelled", "rejected"].includes(item[statusKey])
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        title={`Click to change to ${item[statusKey] === "active" ? "inactive" : "active"}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item[statusKey] === "active"
                              ? "bg-green-500"
                              : item[statusKey] === "inactive"
                              ? "bg-red-500"
                              : ["resolved", "completed", "accept"].includes(
                                  item[statusKey]
                                )
                              ? "bg-green-500"
                              : ["pending", "processing", "in-progress"].includes(
                                  item[statusKey]
                                )
                              ? "bg-blue-500"
                              : ["cancelled", "rejected"].includes(item[statusKey])
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {item[statusKey]}
                      </motion.button>
                    ) : column.key === priorityKey ? (
                      // Priority Badge
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                          ${
                            item[priorityKey] === "low"
                              ? "bg-green-100 text-green-800"
                              : item[priorityKey] === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : item[priorityKey] === "high"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {item[priorityKey]
                          ? item[priorityKey].charAt(0).toUpperCase() +
                            item[priorityKey].slice(1)
                          : "Unknown"}
                      </span>
                    ) : (
                      <p
                        className={`text-gray-700 ${
                          column.capitalize ? "capitalize" : ""
                        }`}
                      >
                        {item[column.key]}
                      </p>
                    )}
                  </td>
                ))}

                {/* Actions */}
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onView(item)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </motion.button>
                    )}
                    {onEdit && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                    )}
                    {onDelete && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="p-8 text-center text-gray-500"
              >
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle size={48} className="text-gray-300 mb-4" />
                  <p className="text-lg font-medium">{emptyMessage.title}</p>
                  <p className="text-gray-500 mt-1">
                    {emptyMessage.description}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;