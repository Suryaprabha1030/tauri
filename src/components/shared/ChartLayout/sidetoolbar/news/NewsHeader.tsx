import React from "react";
import Headings from "../sharedContent/headings";
import RemoveButton from "../sharedContent/RemoveButton";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import NewsFilter from "../../sidetab/News/NewsFilter";

interface NewsHeaderProps {
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
  setNewsData: React.Dispatch<React.SetStateAction<any>>;
  setActiveFilters: React.Dispatch<React.SetStateAction<any>>;
  activeFilters: any;
  newsData: any;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({
  leftWidth,
  setLeftWidth,
  setNewsData,
  setActiveFilters,
  activeFilters,
  newsData,
}) => {
  return (
    <div
      className="flex flex-row items-center justify-between sm:max-md:sticky sm:max-md:top-0 md:max-xl:py-1 xl:max-2xl:h-[6%] "
      onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
    >
      <Headings name="All News" />
      {/* <div className="flex w-[50%] items-center justify-center max-sm:w-[12rem] xl:max-2xl:h-full xl:max-2xl:w-[55%]">
        <NewsFilter
          setNewsData={setNewsData}
          setActiveFilters={setActiveFilters}
          activeFilters={activeFilters}
          newsData={newsData}
        />
      </div> */}

      <div
        className="flex w-[7rem] flex-row items-center justify-between max-sm:w-[3rem] xl:max-2xl:w-[4rem]"
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        <RemoveButton />
      </div>
    </div>
  );
};

export default NewsHeader;
