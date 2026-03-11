import { formatDateOrTimeAgo } from "@/lib/util/sideToolBar/news/TimeConverterUtil";
import Image from "next/image";
import React from "react";

interface NewsBoxProps {
  newsData: any;
  tagTrue: boolean;
  AllNews: boolean;
}

const NewsBox: React.FC<NewsBoxProps> = ({ newsData, tagTrue, AllNews }) => {
  return (
    <div className="">
      {newsData &&
        newsData?.map((item: any, index: any) => (
          <div
            key={index}
            className={` flex flex-col justify-between py-3  ${
              index !== newsData.length - 1 ? "border-b-2" : ""
            }`}
          >
            <div className="flex flex-row items-start justify-between ">
              <div
                className={`w-[80%] text-[0.75rem]  font-[370] text-black md:max-2xl:text-standard ${AllNews ? "2xl:text-global" : "w-[85%] 2xl:text-[0.8rem]"} `}
              >
                {item.title}
              </div>
              <Image
                src="/svg/newtab.svg"
                alt="Open in new tab"
                width={15}
                height={15}
                className="cursor-pointer"
                onClick={() => window.open(item.url, "_blank")}
              />
            </div>

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-5 ">
                <div className=" text-[0.7rem] font-table text-gray-400">
                  {item.publisher}
                </div>
                {/* forsymbol tag */}
                {tagTrue ? (
                  <div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.tags.map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="rounded-lg  bg-blue-100 px-[0.3rem] py-[0.1rem] text-[0.55rem] text-indigo-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="text-[0.7rem] text-gray-400">
                <div>{formatDateOrTimeAgo(item.published_at)}</div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NewsBox;
