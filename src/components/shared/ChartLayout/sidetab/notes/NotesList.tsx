import { NotesRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { notesformatDateTime } from "./notesUtil";
import Image from "next/image";
import PaginationLoading from "@/components/shared/commonUtil/PaginationLoading";
import LoadingComponent from "@/components/shared/loading/Loading";
import CommonNotesList from "../../sidetoolbar/notes/CommonNotesList";
import InfoNotes from "../InfoNotes";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface NoteListProps {
  onEdit: any;
  showCreateNotes: boolean;
  symbolNotesList: any;
  setSymbolNotesList: Dispatch<SetStateAction<any>>;
  setShowCreateNotes: Dispatch<SetStateAction<any>>;
  clickedSymbolData: any;
  setNoteToEdit: Dispatch<SetStateAction<any>>;
}
const NoteList: React.FC<NoteListProps> = ({
  onEdit,
  showCreateNotes,
  symbolNotesList,
  setSymbolNotesList,
  setShowCreateNotes,
  clickedSymbolData,
  setNoteToEdit,
}) => {
  const listContainerRef = useRef(null);
  const [isEndList, setIsEndList] = useState(false);
  const [callEndList, setCallEndList] = useState(true);
  const [listPageNum, setListPageNum] = useState(1);

  const router = useRouter();
  // get symbol notes
  const ListSymbolNotes = (identifier: any, pageNum: any) => {
    const notesApi = new NotesRouterApi(baseConfig());
    notesApi
      .getNotesByIdentifierV1UsersMeNotesBySymbolIdentifierGet(
        identifier,
        pageNum,
      )
      .then((res: any) => {
        const notes = res?.data;

        setSymbolNotesList((prev: any) => [...prev, ...notes]);
        if (res.status == 204) {
          setCallEndList(false);
        }
        setIsEndList(false);
      })
      .catch((error: any) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  useEffect(() => {
    setSymbolNotesList([]);

    ListSymbolNotes(clickedSymbolData?.identifier, 1);
    setListPageNum(1);
    setCallEndList(true);
  }, [clickedSymbolData]);

  useEffect(() => {
    if (isEndList) {
      ListSymbolNotes(clickedSymbolData?.identifier, listPageNum);
    }
  }, [isEndList]);

  // delete notes
  const DeleteNotes = (id: any) => {
    const notesApi = new NotesRouterApi(baseConfig());
    notesApi
      .deleteItemV1UsersMeNotesIdDelete(id)
      .then((res: any) => {
        setSymbolNotesList((prevNotes: any) =>
          prevNotes.filter((note: any) => note.id !== id),
        );
        setNoteToEdit(null);
      })
      .catch((error: any) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };
  const checkIfAtEndSymbol = () => {
    const container: any = listContainerRef.current;

    if (container) {
      if (
        container.scrollHeight - container.scrollTop <=
          container.clientHeight + 1 &&
        symbolNotesList?.length % 10 === 0 &&
        callEndList
      ) {
        setListPageNum(listPageNum + 1);
        setIsEndList(true);
      }
    } else {
      setIsEndList(false);
    }
  };

  useEffect(() => {
    const container: any = listContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIfAtEndSymbol);
    }
    return () => {
      const container: any = listContainerRef.current;
      if (container) {
        container.removeEventListener("scroll", checkIfAtEndSymbol);
      }
    };
  }, [symbolNotesList]);

  return (
    <div
      className={`w-full max-sm:mt-[0.5rem] sm:max-md:mt-3 md:max-xl:mt-6 ${
        showCreateNotes
          ? "max-sm:h-[69%] sm:max-md:h-[85%] md:max-lg:h-[70%] lg:max-xl:h-[72%] xl:max-2xl:h-[66%] 2xl:h-[71%]"
          : "max-sm:h-[82%] sm:max-md:h-[100%] md:max-lg:h-[80%] lg:max-xl:h-[88%] xl:max-2xl:h-[90%] 2xl:h-full"
      }`}
    >
      <div
        ref={listContainerRef}
        className="mt-2 flex h-full w-full flex-col overflow-y-auto rounded-lg border border-2 bg-white px-4 py-1 text-[0.75rem] shadow-lg scrollbar-thin"
      >
        {symbolNotesList?.length > 0 ? (
          <>
            <CommonNotesList
              allNotes={symbolNotesList}
              notesformatDateTime={notesformatDateTime}
              sideTabEdit={true}
              onEdit={onEdit}
              DeleteNotes={DeleteNotes}
              setShowCreateNotes={setShowCreateNotes}
            />

            <div className="flex h-20 w-full items-center justify-center">
              {isEndList ? <PaginationLoading /> : ""}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center gap-1 text-center text-[0.75rem] font-letter">
            <InfoNotes name="Add Notes" hideNotes={true} />
            <span
              className="group relative inline-block cursor-pointer"
              onClick={() => {
                setShowCreateNotes(true);
                setNoteToEdit(null);
              }}
            >
              <img
                src="/svg/notes.svg"
                className="cursor-pointer"
                height={15}
                width={15}
                alt=""
              />
              <span className="pointer-events-none absolute left-12 top-10 z-[1001] ml-1 w-[4.5rem] -translate-x-full -translate-y-1/2 transform rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden">
                Add Notes
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default NoteList;
