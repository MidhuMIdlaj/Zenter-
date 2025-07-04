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
  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than or equal to max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More complex pagination with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle case
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
        <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
        <span className="font-medium">{totalItems}</span> customers
      </div>
      
      <div className="flex gap-1">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          <span>Previous</span>
        </motion.button>
        
        {getPageNumbers().map((page, index) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
          ) : (
            <motion.button
              key={`page-${page}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[40px] px-3 py-2 border rounded-md transition-colors ${
                currentPage === page
                  ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </motion.button>
          )
        ))}
        
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          <span>Next</span>
          <ChevronRight size={16} className="ml-1" />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;