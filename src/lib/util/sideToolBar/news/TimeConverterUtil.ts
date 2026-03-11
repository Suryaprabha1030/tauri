const formatDateOrTimeAgo = (publishedAt: any) => {
  const publishedDate: any = new Date(publishedAt);
  const now: any = new Date();
  const timeDiffInSeconds = Math.floor((now - publishedDate) / 1000);

  // Time thresholds in seconds
  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;

  if (timeDiffInSeconds < secondsInMinute) {
    return `${timeDiffInSeconds} seconds ago`;
  } else if (timeDiffInSeconds < secondsInHour) {
    const minutes = Math.floor(timeDiffInSeconds / secondsInMinute);
    return `${minutes} minutes ago`;
  } else if (timeDiffInSeconds < secondsInDay) {
    const hours = Math.floor(timeDiffInSeconds / secondsInHour);
    return `${hours} hours ago`;
  } else {
    // Format the date if it's more than 24 hours ago
    return publishedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
};

const formatDateTime = (date: any) => {
  if (!date) return "";

  const dateObj = new Date(
    new Date(date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const datePart = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timePart = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart}, ${timePart}`;
};

export { formatDateTime, formatDateOrTimeAgo };
