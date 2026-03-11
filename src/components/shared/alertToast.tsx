"use client";
import config from "@/lib/config";
import ErrorAlert from "./ErrorAlert";
import { useState, useEffect } from "react";

const AlertToast = (props: {
  errorMessage: string;
  toggleComponent: () => void;
}) => {
  useEffect(() => {
    // Set a timeout to hide the component after 10 seconds
    const timeout = setTimeout(() => {
      props.toggleComponent();
    }, config.alertToastTimeout);
  }, []);

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
