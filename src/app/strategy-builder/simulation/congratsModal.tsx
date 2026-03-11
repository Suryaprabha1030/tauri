const CongratsModal = (props: {
  totalValue: number;
  hideModal: () => void;
}) => {
  return (
    <div
      id="popup-modal"
      className="fixed left-0 right-0 top-0 z-50 flex max-h-full items-center justify-center overflow-x-hidden bg-gray-500 bg-opacity-60 p-4 md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute right-2.5 top-3 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={props.hideModal}
          >
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <p>🎉</p>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Congrats On Your Profit!
            </h3>
            <h4>{props.totalValue}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongratsModal;
