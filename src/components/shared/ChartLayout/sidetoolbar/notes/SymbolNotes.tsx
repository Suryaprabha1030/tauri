import React, { useEffect, useRef, useState } from "react";
import { notesformatDateTime } from "../../sidetab/notes/notesUtil";
import CommonNotesList from "./CommonNotesList";
import { error } from "console";
import { NotesRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import PaginationLoading from "@/components/shared/commonUtil/PaginationLoading";
import LoadingComponent from "@/components/shared/loading/Loading";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
interface symbNotesProps {
  symbIdentifier: any;
  symbolName: any;
}

export const SymbolNotes: React.FC<symbNotesProps> = ({
  symbIdentifier,
  symbolName,
}) => {
  const [symbPageNum, setSymbPageNum] = useState<any>(1);
  const [symbolWiseNotes, setSymbolWiseNotes] = useState<any>([]);
  const [isEndSymbolContainer, setIsEndSymbolContainer] = useState(false);
  const symbolContainerRef = useRef(null);
  const [callEndSymbs, setCallEndSymbs] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const fetchSymbolNotes = (symbolIdentifier: any, pageNumber: any) => {
    const notesApi = new NotesRouterApi(baseConfig());
    notesApi
      .getNotesByIdentifierV1UsersMeNotesBySymbolIdentifierGet(
        symbolIdentifier,
        pageNumber
      )
      .then((res: any) => {
        if (res.status == 204) {
          setCallEndSymbs(false);
          // setPageNum((prevPage) => prevPage - 1);
        }
        setSymbolWiseNotes((prev: any) => [...prev, ...res?.data]);
        setIsEndSymbolContainer(false);
        setIsLoading(false);
      })
      .catch((err: any) => {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };
  useEffect(() => {
    fetchSymbolNotes(symbIdentifier, symbPageNum);
  }, []);
  useEffect(() => {
    if (isEndSymbolContainer) fetchSymbolNotes(symbIdentifier, symbPageNum);
  }, [isEndSymbolContainer]);

  const checkIfAtEnd = () => {
    const container: any = symbolContainerRef.current;
    if (container) {
      if (
        container?.scrollHeight - container.scrollTop <=
          container?.clientHeight &&
        symbolWiseNotes?.length % 10 === 0 &&
        callEndSymbs
      ) {
        setSymbPageNum((prevPage: any) => prevPage + 1);

        setIsEndSymbolContainer(true);
      }
    } else {
      setIsEndSymbolContainer(false);
    }
  };

  useEffect(() => {
    const container: any = symbolContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIfAtEnd);
    }
    return () => {
      const container: any = symbolContainerRef.current;
      if (container) {
        container.removeEventListener("scroll", checkIfAtEnd);
      }
    };
  }, [symbolWiseNotes]);

  return (
    <div
      className="mx-6 h-[75%] overflow-y-auto rounded-lg border border-2 scrollbar-thin"
      ref={symbolContainerRef}
    >
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          {/* Add your loading icon here */}
          <LoadingComponent />
        </div>
      ) : symbolWiseNotes.length > 0 ? (
        <div className="p-4">
          <CommonNotesList
            allNotes={symbolWiseNotes}
            sideTabEdit={false}
            handleSymbolNotes={() => {
              console.log("null");
            }}
            notesformatDateTime={notesformatDateTime}
          />

          <div className="flex h-10 w-full items-center justify-center">
            {isEndSymbolContainer ? (
              <>
                <PaginationLoading />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white p-4 text-black">
          No notes available
        </div>
      )}
    </div>
  );
};
