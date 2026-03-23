import { NewsRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "../../autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "../../autoLogoutUtil/brokerLogOutUtil";

const fetchNews = (
  currentPage: any,
  setNewsData: any,
  setLastUpdated: any,
  setDispNews: any,
  router: any
) => {
  const Allnews = new NewsRouterApi(baseConfig());

  Allnews.fetchPaginatedDataV1NewsAllGet(currentPage)
    .then((res) => {
      setNewsData(res.data.news); // Update news data
      setDispNews(res.data.news);
      setLastUpdated(new Date());
    })
    .catch((error) => {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      } // Log any errors
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    });
};

const startIntervalAtQuarterHour = (
  currentPage: any,
  setNewsData: any,
  setLastUpdated: any,
  setDispNews: any,
  router: any
) => {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Calculate milliseconds until the next 15-minute mark
  const timeUntilNextQuarterHour =
    ((15 - (minutes % 15)) * 60 - seconds) * 1000;

  // Initial timeout to align with the quarter-hour
  const timeoutId = setTimeout(() => {
    fetchNews(currentPage, setNewsData, setLastUpdated, setDispNews, router); // Call at the next 15-minute mark

    // Set interval to repeat every 15 minutes after the initial delay
    const intervalId = setInterval(fetchNews, 15 * 60 * 1000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, timeUntilNextQuarterHour);

  // Clear timeout on unmount
  return () => clearTimeout(timeoutId);
};

const fetchNewsMarks = (startTime: any, endTime: any, newsData: any) => {
  return newsData?.filter((event:any) => {
    const eventTimeSec = Math.floor(event.time / 1000);
    return eventTimeSec >= startTime && eventTimeSec <= endTime;
  });
};
const groupNewsByTime = (newsArray: any) => {
  const grouped: any = {};
  newsArray.forEach((item:any) => {
    const timeSec = Math.floor(item.time / 1000);
    if (!grouped[timeSec]) grouped[timeSec] = [];
    grouped[timeSec].push(item);
  });
  return grouped;
};
export {
  startIntervalAtQuarterHour,
  fetchNews,
  fetchNewsMarks,
  groupNewsByTime,
};
