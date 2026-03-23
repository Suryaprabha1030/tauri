import { NotesRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";

import React, { useEffect, useRef, useState } from "react";

import { notesformatDateTime } from "../../sidetab/notes/notesUtil";
import LoadingComponent from "../../../loading/Loading";
import { SymbolNotes } from "./SymbolNotes";
import CommonNotesList from "./CommonNotesList";
import PaginationLoading from "../../../commonUtil/PaginationLoading";
import RemoveButton from "../sharedContent/RemoveButton";
import Headings from "../sharedContent/headings";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";

interface AllNotesProps {
  brokerCode: any;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const AllNote: React.FC<AllNotesProps> = ({
  brokerCode,
  leftWidth,
  setLeftWidth,
}) => {
  const [allNotes, setAllNotes] = useState<any[]>([]);

  const [pageName, setPageName] = useState("All Notes");

  const [pageNum, setPageNum] = useState(1);
  const [callEnd, setCallEnd] = useState(true);
  const [symbolIdentifiers, setSymbolSymbolIdentifiers] = useState<any>([]);
  const [symbolName, setSymbolName] = useState<any>({});
  const [showSymbolNotes, setShowSymbolNotes] = useState(false);
  const [symbIdentifier, setSymbSymbolIdentifier] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef(null);
  const [isEnd, setIsEnd] = useState(false);

  const getAllNotes = (payload: any) => {
    const notesApi = new NotesRouterApi(baseConfig());
    notesApi
      .getAllItemsV1UsersMeNotesAllGet(payload)
      .then((res) => {
        const notesData: any = res?.data?.items || [];
        const identifires: any = res?.data?.identifiers || [];

        setAllNotes((prevNotes) => [...prevNotes, ...notesData]);
        setSymbolSymbolIdentifiers((prevNotes: any) => [
          ...prevNotes,
          ...identifires,
        ]);

        if (res.status == 204) {
          setCallEnd(false);
        }
        setIsEnd(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error, "error");
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getAllNotes(pageNum);
  }, []);
  useEffect(() => {
    if (isEnd) {
      getAllNotes(pageNum);
    }
  }, [isEnd]);

  const handleSymbolNotes = (identifier: any) => {
    setTimeout(() => {
      setShowSymbolNotes(true);
      setSymbSymbolIdentifier(identifier);
      setPageName(
        identifier?.includes(":") ? identifier.split(":")[1] : identifier
      );
    }, 500);
  };

  const checkIfAtEnd = () => {
    const container: any = containerRef.current;

    if (container) {
      if (
        container?.scrollHeight - container.scrollTop <=
          container?.clientHeight &&
        allNotes?.length % 10 === 0 &&
        callEnd
      ) {
        setPageNum((prevPage) => prevPage + 1);

        setIsEnd(true);
      }
    } else {
      setIsEnd(false);
    }
  };

  useEffect(() => {
    const container: any = containerRef.current;
    if (container && !showSymbolNotes) {
      container.addEventListener("scroll", checkIfAtEnd);
    }
    return () => {
      const container: any = containerRef.current;
      if (container) {
        container.removeEventListener("scroll", checkIfAtEnd);
      }
    };
  }, [allNotes, showSymbolNotes]);

  const handleBack = () => {
    setTimeout(() => {
      setShowSymbolNotes(false);

      setPageName("All Notes");
    }, 500);
  };
  return (
    <>
      <div
        className="flex flex-row items-center justify-between max-xl:sticky max-xl:left-0 max-xl:top-0 md:max-xl:py-1"
        onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
      >
        <span
          className="flex flex-row max-md:gap-6 max-md:px-4 md:max-xl:gap-3 "
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
        >
          <Headings
            name={pageName}
            xlTextSize={
              pageName === "All Notes"
                ? "xl:max-2xl:text-xl"
                : "xl:max-2xl:text-[1rem]"
            }
          />

          {showSymbolNotes && (
            <span
              className={` flex cursor-pointer gap-2  py-4 text-[0.75rem] font-table text-gray-500 xl:max-2xl:py-[0.85rem]`}
              onClick={handleBack}
            >
              &lt;&lt; Back
            </span>
          )}
        </span>
        <div
          className="flex w-[7rem] flex-row items-center justify-between"
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
        >
          <RemoveButton />
        </div>
      </div>

      {showSymbolNotes && (
        <SymbolNotes symbIdentifier={symbIdentifier} symbolName={symbolName} />
      )}

      {!showSymbolNotes && (
        <div
          className="mx-6 overflow-y-auto rounded-lg border border-2 scrollbar-thin max-xl:h-[80%] sm:max-xl:my-4 xl:h-[75%]"
          ref={containerRef}
        >
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center ">
              {/* Add your loading icon here */}
              <LoadingComponent />
            </div>
          ) : allNotes.length > 0 ? (
            <div className="cursor-pointer p-4">
              <CommonNotesList
                allNotes={allNotes}
                handleSymbolNotes={handleSymbolNotes}
                notesformatDateTime={notesformatDateTime}
                sideTabEdit={false}
              />

              <div className="flex h-10 w-full items-center justify-center  ">
                {isEnd ? (
                  <>
                    <PaginationLoading />
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4">
              No Notes Available
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllNote;
