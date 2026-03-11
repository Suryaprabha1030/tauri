import { ToastContainer } from "react-toastify";

const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="bottom-right"
      containerId="custom-toast"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      style={{ zIndex: 10000 }}
    />
  );
};

export default CustomToastContainer;
