import { NotesRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface NotesFormProps {
  noteToEdit: any;
  clickedSymbolData: any;
  setNoteToEdit: React.Dispatch<React.SetStateAction<any>>;
  setShowCreateNotes: React.Dispatch<React.SetStateAction<boolean>>;
  setSymbolNotesList: React.Dispatch<React.SetStateAction<any>>;
}
const NotesForm: React.FC<NotesFormProps> = ({
  noteToEdit,
  clickedSymbolData,
  setNoteToEdit,
  setShowCreateNotes,
  setSymbolNotesList,
}) => {
  const [addNote, setAddNote] = useState(noteToEdit?.notes || "");

  const isEditing = noteToEdit !== null;
  const router = useRouter();
  // Reset the input field when noteToEdit changes
  useEffect(() => {
    if (noteToEdit) {
      setAddNote(noteToEdit.notes);
    } else {
      setAddNote("");
    }
  }, [noteToEdit]);

  // Function to handle save/update note
  const handleSaveNote = () => {
    if (addNote?.trim()) {
      const newNote = {
        notes: addNote?.trim(),
      };
      const notesApi = new NotesRouterApi(baseConfig());
      notesApi
        .createItemV1UsersMeNotesPost(clickedSymbolData?.identifier, newNote)
        .then((res: any) => {
          setSymbolNotesList((prevNotes: any) => [res?.data, ...prevNotes]);
          setAddNote("");
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
    }
  };
  const updatNotes = () => {
    const updateNote = {
      notes: addNote?.trim(),
    };
    const notesApi = new NotesRouterApi(baseConfig());

    notesApi
      .updateItemV1UsersMeNotesIdPatch(noteToEdit?.id, updateNote)
      .then((res: any) => {
        const updateNote = res?.data;

        setSymbolNotesList((prevNotes: any) =>
          prevNotes.map((note: any) =>
            note.id === noteToEdit?.id ? updateNote : note
          )
        );
        setAddNote("");
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

  const handleCancel = () => {
    setNoteToEdit(null);
    setAddNote("");
    setShowCreateNotes(false);
  };

  return (
    <div className="h-[15%]    w-full  text-[0.75rem]">
      <textarea
        className="scrollbar-track scrollbar-thumb h-10  w-full    resize-none overflow-y-scroll rounded-lg    border border-gray-300 px-2 scrollbar-thin focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Add Notes"
        value={addNote}
        onChange={(e) => {
          if (e.target.value.length <= 300) {
            setAddNote(e.target.value);
          }
        }}
      />

      <div className="  flex h-5 justify-end space-x-1">
        <button
          onClick={handleCancel}
          className=" rounded-3xl rounded-3xl  border border-gray-400 px-4 py-0.5 font-medium   leading-none text-gray-500  hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={isEditing ? updatNotes : handleSaveNote}
          className="flex items-center justify-center rounded-3xl border border-z-green-500 px-4   font-medium   leading-none text-z-green-500 text-z-green-500 hover:bg-z-green-500 hover:text-white"
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default NotesForm;
