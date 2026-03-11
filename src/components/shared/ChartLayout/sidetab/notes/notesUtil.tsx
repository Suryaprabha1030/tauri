import { NotesRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";

const notesformatDateTime = (isoString: any) => {
  // Remove everything after the seconds (microseconds)
  const cleanedIsoString = isoString?.split(".")[0] + "Z"; // Ensure it's treated as UTC

  const dateObj = new Date(cleanedIsoString); // Parse ISO string

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  // Format in IST using toLocaleString with timeZone
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    dateObj
  );
  return formattedDate.replace(",", "").replace(" at", " ."); // Optional cleanup
};

export { notesformatDateTime };
