import React from "react";
interface NewsPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const NewsPagination: React.FC<NewsPaginationProps> = ({
  currentPage,
  setCurrentPage,
}) => {
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="flex justify-center space-x-2 py-2 max-md:gap-0.5 md:max-xl:space-x-4 xl:max-2xl:py-[0.8rem]">
      {[...Array(10)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`rounded-lg border text-[0.75rem] max-md:px-1.5 max-md:py-0.5 md:max-xl:mt-2 md:max-xl:px-2.5 md:max-xl:py-1 xl:h-7 xl:w-7 xl:px-2 xl:py-1 ${
              currentPage === page
                ? "bg-z-green-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default NewsPagination;
