"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const Toaster = () => {
  const [toastStyle, setToastStyle] = useState({});

  useEffect(() => {
    const updateToastStyle = () => {
      const width = window.innerWidth;
      if (width >= 300 && width <= 768) {
        setToastStyle({
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "4rem",
          width: "70%",
          zIndex: "10000000",
          height: "1%",
          fontSize: "0.75rem",
        });
      } else {
        setToastStyle({
          marginTop: "0",
        });
      }
    };

    // Initial check
    updateToastStyle();

    // Listen for window resize
    window.addEventListener("resize", updateToastStyle);

    return () => window.removeEventListener("resize", updateToastStyle);
  }, []);

  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      style={toastStyle}
    />
  );
};

export default Toaster;
