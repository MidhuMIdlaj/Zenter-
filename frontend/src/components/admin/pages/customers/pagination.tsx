import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  totalItems,
  onPageChange
}) => {
  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    
    // Always show first page
    if (currentPage > 3) {
      pages.push(1);
      // Add ellipsis if there's a gap
      if (currentPage > 4) {
        pages.push('...');
      }
    }
    
    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Always show last page
    if (currentPage < totalPages - 2) {
      // Add ellipsis if there's a gap
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 bg-white">
      <div className="text-sm text-gray-600 mb-4 md:mb-0">
        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
        <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> customers
      </div>
      
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`p-2 rounded-md flex items-center justify-center ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft size={16} />
        </motion.button>
        
        {getPaginationNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-1 text-gray-500">...</span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`w-9 h-9 rounded-md flex items-center justify-center font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </motion.button>
            )}
          </React.Fragment>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`p-2 rounded-md flex items-center justify-center ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;