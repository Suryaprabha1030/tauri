import React from "react";

interface ComingSoonModalProps {
  show: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className=" w-[280px] overflow-hidden rounded-2xl bg-white text-center shadow-lg">
        <h3 className="w-full bg-z-green-500 py-2 text-lg font-semibold text-white">
          Coming Soon...
        </h3>
        <div className="flex flex-col items-center gap-4 p-6">
          <p className="mt-2 text-sm text-gray-500">
            Integration in progress. <br />
            We’ll notify you once it’s complete.
          </p>

          <button
            onClick={onClose}
            className="flex w-[5rem] items-center justify-center rounded-3xl border border-z-green-500  px-2 py-1  font-medium leading-none  text-z-green-500 hover:bg-z-green-500 hover:text-white max-sm:mb-[1.25rem]  max-sm:text-[0.6rem] sm:max-md:mt-[1.2rem] sm:max-md:text-[0.75rem] md:max-lg:mt-[1.4rem] md:max-lg:text-[0.9rem]  lg:max-xl:text-[0.8rem] xl:py-2 xl:text-[0.8rem]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
