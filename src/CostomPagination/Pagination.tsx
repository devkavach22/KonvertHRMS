import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface PaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ total, limit, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div className="text-muted">
        Showing {Math.min((currentPage - 1) * limit + 1, total)} - {Math.min(currentPage * limit, total)} of {total} entries
      </div>
      
      <nav aria-label="Page navigation">
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button 
              className="page-link" 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
          </li>
          
          {pageNumbers.map((pageNum) => (
            <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(pageNum)}>
                {pageNum}
              </button>
            </li>
          ))}
          
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button 
              className="page-link" 
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;