import React from "react";
import ReactPaginate from "react-paginate";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

const Pagination = ({ totalPages, pageChangeHandler }) => {
  const arrowClassName =
    "cursor-pointer bg-white text-gray-500 rounded-[8px] w-8 h-8 flex items-center justify-center cursor-pointer";
  return (
    <ReactPaginate
      onPageChange={pageChangeHandler}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={totalPages}
      initialPage={0}
      containerClassName="flex gap-2 m-4 justify-end select-none"
      pageClassName="bg-white text-gray-500 rounded-[8px] w-8 h-8 flex items-center justify-center cursor-pointer"
      activeClassName="!bg-[#233955] text-white"
      previousClassName={arrowClassName}
      nextClassName={arrowClassName}
      breakLabel="..."
      nextLabel={<GrNext />}
      previousLabel={<GrPrevious />}
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
