
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface NewsFilterProps {
  setNewsData: Dispatch<SetStateAction<any>>;
  setActiveFilters: Dispatch<SetStateAction<any>>;
  activeFilters: any;
  newsData: any;
}

const NewsFilter: React.FC<NewsFilterProps> = ({
  setNewsData,
  setActiveFilters,
  activeFilters,
  newsData,
}) => {
  const filters = [
    {
      label: "Quarterly Results",
      value: "quarterly results",
      title: "Quarterly Results",
      keywords: ["Q1", "Q2", "Q3", "Q4", "FY23", "FY24", "FY25"],
    },
    {
      label: "Dividend",
      value: "dividend",
      title: "Dividend",
      keywords: ["dividend"],
    },
    { label: "Bonus", value: "bonus", title: "Bonus", keywords: ["bonus"] },
  ];

  const handleFilterClick = (filter: string) => {
    setActiveFilters((prevFilters: any) =>
      prevFilters.includes(filter) ? [] : [filter]
    );
  };

  useEffect(() => {
    if (activeFilters.length > 0) {
      const activeFilter = filters.find((f) => f.value === activeFilters[0]);
      if (activeFilter) {
        const filteredNews = newsData?.filter((news: any) =>
          activeFilter.keywords.some((keyword) =>
            news.title.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        setNewsData(filteredNews);
      }
    } else {
      setNewsData(newsData);
    }
  }, [activeFilters, newsData]);

  return (
    <div className="flex w-full items-center justify-center sm:max-md:py-[0.7rem] md:max-lg:py-[1rem] lg:max-xl:py-[1.3rem] xl:max-2xl:py-[0.5rem]">
      {filters.map(({ label, value, title }, index) => {
        let roundedClass = "";
        if (index === 0)
          roundedClass = "rounded-l-full"; // Left rounded
        else if (index === filters.length - 1)
          roundedClass = "rounded-r-full"; // Right rounded
        else roundedClass = "rounded-none"; // No rounded corners

        return (
          <button
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
            key={value}
            className={` border border-gray-200 px-3 py-1 text-[0.65rem]   font-medium transition max-xl:mt-2 max-sm:mt-0 max-sm:px-2 max-sm:text-[0.55rem] 
              ${roundedClass} 
              ${
                activeFilters.includes(value)
                  ? "bg-z-green-500 text-white"
                  : "bg-white text-gray-400 xl:hover:bg-gray-200 xl:hover:text-black"
              }`}
            onClick={() => handleFilterClick(value)}
            title={title}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default NewsFilter;
