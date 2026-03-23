"use client";

import ErrorAlert from "./ErrorAlert";


const AlertToast = (props: {
  errorMessage: string;
  toggleComponent: () => void;
}) => {
  

  return (
    <div
      id="toast-danger"
      className="fixed bottom-4 right-4 max-w-md items-center rounded-lg bg-white text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400"
      role="alert"
    >
      <ErrorAlert errorMessage={props.errorMessage} />
    </div>
  );
};

export default AlertToast;
