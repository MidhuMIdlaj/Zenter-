import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmployeeFilterProps {
  searchTerm: string;
  statusFilter: "all" | "active" | "inactive";
  positionFilter: "all" | "coordinator" | "mechanic";
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  onPositionFilterChange: (value: "all" | "coordinator" | "mechanic") => void;
}

// EmployeeFilter.tsx

interface EmployeeFilterProps {
  searchTerm: string;
  statusFilter: "all" | "active" | "inactive";
  positionFilter: "all" | "coordinator" | "mechanic";
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  onPositionFilterChange: (value: "all" | "coordinator" | "mechanic") => void;
}

export const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  searchTerm,
  statusFilter,
  positionFilter,
  onSearchChange,
  onStatusFilterChange,
  onPositionFilterChange,
}) => {
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showPositionFilter, setShowPositionFilter] = useState(false);

  return (
    <div className="p-6 border-b border-gray-200 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name, email, or location..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              <span>
                Status: {statusFilter === "all" ? "All" : statusFilter === "active" ? "Active" : "Inactive"}
              </span>
              <ChevronDown size={16} />
            </motion.button>
            
            {showStatusFilter && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2 border border-gray-200"
              >
                <button
                  onClick={() => {
                    onStatusFilterChange("all");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  {statusFilter === "all" && <Check size={16} className="text-blue-600" />}
                  <span className={statusFilter === "all" ? "text-blue-600 font-medium" : ""}>All Statuses</span>
                </button>
                <button
                  onClick={() => {
                    onStatusFilterChange("active");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  {statusFilter === "active" && <Check size={16} className="text-blue-600" />}
                  <span className={statusFilter === "active" ? "text-blue-600 font-medium" : ""}>Active Only</span>
                </button>
                <button
                  onClick={() => {
                    onStatusFilterChange("inactive");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  {statusFilter === "inactive" && <Check size={16} className="text-blue-600" />}
                  <span className={statusFilter === "inactive" ? "text-blue-600 font-medium" : ""}>Inactive Only</span>
                </button>
              </motion.div>
            )}
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPositionFilter(!showPositionFilter)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              <span>
                Position: {positionFilter === "all" ? "All" : positionFilter === "coordinator" ? "Coordinator" : "Mechanic"}
              </span>
              <ChevronDown size={16} />
            </motion.button>
            
            {showPositionFilter && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2 border border-gray-200"
              >
                <button
                  onClick={() => {
                    onPositionFilterChange("all");
                    setShowPositionFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  {positionFilter === "all" && <Check size={16} className="text-blue-600" />}
                  <span className={positionFilter === "all" ? "text-blue-600 font-medium" : ""}>All Positions</span>
                </button>
                <button
                  onClick={() => {
                    onPositionFilterChange("coordinator");
                    setShowPositionFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  {positionFilter === "coordinator" && <Check size={16} className="text-blue-600" />}
                  <span className={positionFilter === "coordinator" ? "text-blue-600 font-medium" : ""}>Coordinators</span>
                </button>
                <button
                  onClick={() => {
                    onPositionFilterChange("mechanic");
                    setShowPositionFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  {positionFilter === "mechanic" && <Check size={16} className="text-blue-600" />}
                  <span className={positionFilter === "mechanic" ? "text-blue-600 font-medium" : ""}>Mechanics</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};