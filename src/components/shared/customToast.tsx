import { toast} from "react-toastify";
import clsx from "clsx";

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    REJECTED: "text-red-400",
    NOT_ACTIVE: "text-black",
    EXPIRED: "text-black",
    TRANSIT: "text-black",
    PENDING: "text-blue-400",
    OPEN: "text-blue-400",
    CANCELLED: "text-gray-400",
  };

  return statusColors[status] || "text-z-green-500"; // Default to green if status not found
};

const getBorderColor = (status: string) => {
  if (status === "REJECTED") return "border-red-500";
  if (status === "CANCELLED") return "border-gray-400";
  if (status === "PENDING" || status === "OPEN") return "border-blue-400";
  return "border-z-green-500";
};

const getIndicatorColor = (status: string) => {
  if (status === "REJECTED") return "bg-red-500";
  if (status === "CANCELLED") return "bg-gray-400";
  return "bg-z-green-500";
};

const ToastContent = ({ title, message, details }:any) => {
  return (
    <div
      className={clsx(
        "flex  items-start rounded-lg bg-white shadow-lg  max-sm:p-1 sm:p-1 xl:p-3",
        "border-l-4",
        getBorderColor(title),
      )}
    >
      {/* Left Indicator */}
      <div className={clsx("w-2 rounded-l-lg", getIndicatorColor(title))}></div>

      {/* Content */}
      <div className="ml-3 flex-1">
        <p
          className={clsx(
            "font-semibold max-sm:text-[0.8rem] sm:text-[0.8rem] xl:text-sm",
            getStatusColor(title),
          )}
        >
          {title}
        </p>
        <p className="text-gray-700 max-sm:w-[15rem] max-sm:text-[0.75rem] sm:text-[0.75rem] xl:text-sm">
          {message}
        </p>
        {details && <p className="mt-1 text-xs text-gray-500">{details}</p>}
      </div>

      {/* Close Button */}
      <button
        className="ml-3 text-gray-500 hover:text-gray-700"
        onClick={() => toast.dismiss()}
      >
        <img src="/svg/removeSymbol.svg" width={15} height={15} alt="Close" />
      </button>
    </div>
  );
};

// Function to show toast
export const showCustomToast = (
  title: string,
  message: string,
  details?: string,
) => {
  const audio = new Audio("/sound/toastSound.mp3");
  audio.play().catch((error) => console.error("Audio play failed:", error));
  toast(<ToastContent title={title} message={message} details={details} />, {
    position: "bottom-right",
    containerId: "custom-toast",
    autoClose: 3000,
    hideProgressBar: true,
    closeButton: false,
    className: "p-0 m-0 bg-transparent shadow-none  max-sm:!left-[80px]   ",

    style: {
      padding: 0,
      margin: 2,
      boxShadow: "none",
      background: "transparent",
    },
  });
};
