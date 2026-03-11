import React from "react";

interface SaveCancelButtonProps {
  handleSaveClick: (index: any) => void;
  index: number;
  setEditOrderId: React.Dispatch<React.SetStateAction<any>>;
}

const SaveCancelButton: React.FC<SaveCancelButtonProps> = ({
  handleSaveClick,
  index,
  setEditOrderId,
}) => {
  return (
    <>
      <button
        onClick={(e) => {
          handleSaveClick(index);
          e.stopPropagation();
        }}
        className="mr-2 rounded-3xl border border-z-green-500 px-2 py-0.5 font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white sm:max-xl:mb-2 sm:max-md:py-1 sm:max-md:text-[0.7rem] md:max-xl:px-4 md:max-xl:py-1.5"
      >
        Save
      </button>

      <button
        onClick={() =>
          setTimeout(() => {
            setEditOrderId(null);
          }, 300)
        }
        className=" rounded-3xl rounded-3xl  border border-gray-400 px-2 py-0.5 font-medium leading-none text-gray-500 hover:bg-gray-100 sm:max-xl:mb-2 sm:max-md:py-1 sm:max-md:text-[0.7rem] md:max-xl:px-4 md:max-xl:py-1.5"
      >
        Cancel
      </button>
    </>
  );
};

export default SaveCancelButton;
