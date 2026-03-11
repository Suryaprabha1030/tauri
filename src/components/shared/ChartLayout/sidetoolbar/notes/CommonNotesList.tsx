import Image from "next/image";
import React from "react";

interface NoteItem {
  id: string;
  identifier: string;
  notes: string;
  created_at: string;
}

interface CommonNotesListProps {
  allNotes: NoteItem[];
  handleSymbolNotes?: (identifier: string) => void;
  notesformatDateTime: (date: string) => string;
  sideTabEdit: boolean;
  onEdit?: any;
  DeleteNotes?: any;
  setShowCreateNotes?: any;
}

const CommonNotesList: React.FC<CommonNotesListProps> = ({
  allNotes,
  handleSymbolNotes,
  notesformatDateTime,
  sideTabEdit,
  onEdit,
  DeleteNotes,
  setShowCreateNotes,
}) => {
  return (
    <>
      {allNotes.map((item: any, index: number) => (
        <div
          key={item.id}
          className={`group relative flex flex-col justify-between max-md:gap-[0.05rem] max-md:py-2 md:max-xl:gap-[0.2rem] md:max-xl:py-2 xl:gap-[0.35rem] ${sideTabEdit ? "xl:py-1" : "xl:py-3"}   ${
            index !== allNotes.length - 1 ? "border-b-2" : ""
          }`}
          onClick={() => handleSymbolNotes?.(item?.identifier)}
        >
          <div className="flex flex-col items-start max-md:justify-start max-md:gap-[0.01rem] xl:justify-between ">
            {!sideTabEdit && (
              <div className="title w-full break-words font-table text-black max-2xl:text-standard 2xl:text-global">
                {item?.identifier?.includes(":")
                  ? item.identifier.split(":")[1]
                  : item.identifier}
              </div>
            )}

            <div className="title w-full break-words font-[370] text-black max-2xl:text-standard 2xl:text-global">
              {item?.notes}
            </div>
          </div>
          <div
            className={`text-[0.7rem] text-gray-400 ${sideTabEdit ? "" : ""}`}
          >
            <div>{notesformatDateTime(item.created_at)}</div>
          </div>
          {sideTabEdit && (
            <div className="flex flex-col items-end space-y-1">
              <div className="absolute top-1 z-20 flex space-x-2 rounded-lg bg-white px-3 py-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => {
                    onEdit(index, item?.id);
                    setShowCreateNotes(true);
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  <Image
                    src="/svg/editNote.svg"
                    className="w-[1rem] cursor-pointer"
                    height={50}
                    width={50}
                    alt=""
                  />
                </button>
                <button
                  onClick={() => DeleteNotes(item?.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Image
                    src="/svg/deleteNotes.svg"
                    className="w-[1rem] cursor-pointer"
                    height={50}
                    width={50}
                    alt=""
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CommonNotesList;
