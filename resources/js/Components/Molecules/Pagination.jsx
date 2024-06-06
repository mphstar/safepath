import React, { useEffect, useState } from "react";

const Pagination = ({ page, setPage, showItem, total, limit }) => {
  const [lastPage, SetLastPage] = useState(Math.ceil(total / limit));

  const clickPage = (value) => {
    setPage(value);
  };

  const previusPage = () => {
    setPage(page - 1);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    SetLastPage(Math.ceil(total / limit));
  }, [total, showItem]);

  return (
    <div className="w-full h-fit flex flex-col md:flex-row mt-8 justify-center items-center md:justify-between gap-2 mb-4">
      <div>
        Showing <span className="font-bold">{showItem}</span> From{" "}
        <span className="font-bold">{total}</span> Data
      </div>
      <div className="flex flex-row gap-1">
        {page > 1 ? (
          <div
            onClick={previusPage}
            className="flex px-3 py-1 hover:bg-gray-100 cursor-pointer rounded-md border-[2px] duration-300 ease-in-out"
          >
            {"<"}
          </div>
        ) : undefined}

        {lastPage <= 1
          ? undefined
          : Array.from({ length: lastPage }, (_, index) => {
              const pageNumber = index + 1;

              if (pageNumber === 1 || pageNumber === lastPage) {
                return (
                  <div
                    onClick={() => clickPage(pageNumber)}
                    key={index}
                    className={`flex px-3 py-1 ${
                      page === pageNumber
                        ? "bg-slate-900 text-white"
                        : "hover:bg-gray-200"
                    } rounded-md border-[2px] duration-300 ease-in-out cursor-pointer`}
                  >
                    {pageNumber}
                  </div>
                );
              } else if (Math.abs(page - pageNumber) <= 1) {
                return (
                  <div
                    onClick={() => clickPage(pageNumber)}
                    key={index}
                    className={`flex px-3 py-1 ${
                      page === pageNumber
                        ? "bg-slate-900 text-white dark:text-white"
                        : "hover:bg-gray-200"
                    } rounded-md border-[2px] duration-300 ease-in-out cursor-pointer`}
                  >
                    {pageNumber}
                  </div>
                );
              }
            })}

        {page < lastPage ? (
          <div
            onClick={nextPage}
            className="flex px-3 py-1 hover:bg-gray-100 cursor-pointer rounded-md border-[2px] duration-300 ease-in-out"
          >
            {">"}
          </div>
        ) : undefined}
      </div>
    </div>
  );
};

export default Pagination;
