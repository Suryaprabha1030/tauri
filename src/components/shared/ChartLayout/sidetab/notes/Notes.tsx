import { useState } from "react";
import NotesForm from "./NotesForm";
import NoteList from "./NotesList";

interface NotesProps {
  showCreateNotes: boolean;
  setShowCreateNotes: React.Dispatch<React.SetStateAction<any>>;
  noteToEdit: any;
  setNoteToEdit: React.Dispatch<React.SetStateAction<any>>;
  clickedSymbolData: any;
}

const Notes: React.FC<NotesProps> = ({
  showCreateNotes,
  setShowCreateNotes,
  noteToEdit,
  setNoteToEdit,
  clickedSymbolData,
}) => {
  const [notes, setNotes] = useState<any>([]);
  const [symbolNotesList, setSymbolNotesList] = useState<any>([]);

  const handleEditNote = (index: any, id: any) => {
    const noteToEdit: any = { ...symbolNotesList[index], index };
    setNoteToEdit(noteToEdit);
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-[0.85rem] pl-[1rem] pr-[0.85rem] max-sm:justify-start sm:max-xl:gap-[2rem] sm:max-md:mb-[4rem] md:max-xl:mb-[8%] xl:max-2xl:justify-start 2xl:justify-center ">
      <NoteList
        onEdit={handleEditNote}
        showCreateNotes={showCreateNotes}
        setSymbolNotesList={setSymbolNotesList}
        symbolNotesList={symbolNotesList}
        setShowCreateNotes={setShowCreateNotes}
        clickedSymbolData={clickedSymbolData}
        setNoteToEdit={setNoteToEdit}
      />
      {showCreateNotes && (
        <NotesForm
          noteToEdit={noteToEdit}
          clickedSymbolData={clickedSymbolData}
          setNoteToEdit={setNoteToEdit}
          setShowCreateNotes={setShowCreateNotes}
          setSymbolNotesList={setSymbolNotesList}
        />
      )}
    </div>
  );
};

export default Notes;
