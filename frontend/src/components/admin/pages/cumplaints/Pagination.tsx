import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  totalItems: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  totalItems,
  onPageChange
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    // Deduplicate and sort
    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 bg-gray-50">
      <div className="text-sm text-gray-700 mb-4 sm:mb-0">
        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
        <span className="font-medium">{indexOfLastItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft size={18} />
        </button>
        
        {pageNumbers.map((number, index) => {
          // Add ellipsis
          const showEllipsisStart = index > 0 && pageNumbers[index - 1] !== number - 1;
          const showEllipsisEnd = index < pageNumbers.length - 1 && pageNumbers[index + 1] !== number + 1;
          
          return (
            <React.Fragment key={number}>
              {showEllipsisStart && (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                  ...
                </span>
              )}
              
              <button
                onClick={() => onPageChange(number)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === number
                    ? 'z-10 bg-blue-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {number}
              </button>
              
              {showEllipsisEnd && (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                  ...
                </span>
              )}
            </React.Fragment>
          );
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <span className="sr-only">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;