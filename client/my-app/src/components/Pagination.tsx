import React from "react";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = 20;

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 3, 1);
    const end = Math.min(currentPage + 3, totalPages);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2 bg-gray-800 p-4 rounded-lg shadow-md">
     
      <Button
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 1
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-700"
        } text-white`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>

      <Button
        className={`px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-white transition ease-in-out duration-200`}
      >
        {currentPage}
      </Button>

      <Button
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-700"
        } text-white`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>

      {/* <Button
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-700"
        } text-white`}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </Button> */}
    </div>
  );
};

export default Pagination;
