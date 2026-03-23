import { formatDateToCustomString } from "../../OIUtil";

const CombinedOiData = (data: any) => {
  const ceSeries = data?.latest_oi?.map((i: any) => i.total_ce_oi) || [];
  const peSeries = data?.latest_oi?.map((i: any) => i.total_pe_oi) || [];
  const simpledata = [ceSeries, peSeries];
  const series = [
    {
      data: simpledata.flat(),
    },
  ];
  // above for bar series data
  const spotArr = Array.isArray(data?.spot_price) ? data?.spot_price : [];

  // spot transfrm
  const transformedSpot = spotArr
    ?.map((data: any) => {
      return {
        [data?.time]: data?.spot_price,
      };
    })
    .sort(
      (a:any, b:any) =>
        new Date(Object.keys(a)[0]).getTime() -
        new Date(Object.keys(b)[0]).getTime()
    );

  const transformStrikePriceData = (data: any) => {
    const total_ce_oi: Record<string, number>[] = [];
    const total_pe_oi: Record<string, number>[] = [];

    if (Array.isArray(data?.strike_price_data)) {
      data?.strike_price_data.forEach((entry: any) => {
        total_ce_oi.push({ [entry?.created_at]: entry?.total_ce_oi });
        total_pe_oi.push({ [entry?.created_at]: entry?.total_pe_oi });
      });

      // Sorting by created_at timestamps
      total_ce_oi?.sort(
        (a, b) =>
          new Date(Object.keys(a)[0]).getTime() -
          new Date(Object.keys(b)[0]).getTime()
      );
      total_pe_oi?.sort(
        (a, b) =>
          new Date(Object.keys(a)[0]).getTime() -
          new Date(Object.keys(b)[0]).getTime()
      );
    }

    return [{ totalCeOi: total_ce_oi, totalPeOi: total_pe_oi }];
  };

  // strike transform
  const transformedStrike = transformStrikePriceData(data);

  const filterdata = (arr1:any, arr2:any) => {
    const keySet1 = new Set(arr1?.map((data: any) => Object.keys(data)[0]));

    const filter2 = arr2?.map((item:any) => ({
      totalCeOi: item.totalCeOi.filter((dataObj:any) =>
        keySet1.has(Object.keys(dataObj)[0])
      ),
      totalPeOi: item.totalPeOi.filter((dataObj:any) =>
        keySet1.has(Object.keys(dataObj)[0])
      ),
      // keySet1.has(Object.keys(item)[0])
    }));

    const keySet2 = new Set(
      arr2?.flatMap((item: any) =>
        item?.totalCeOi?.map((data: any) => Object.keys(data)[0])
      )
    );

    const filter1 = arr1?.filter((item:any) => keySet2.has(Object.keys(item)[0]));

    return {
      filterArr1: filter1,
      filterArr2: filter2,
    };
  };
  // filtered array
  const { filterArr1, filterArr2 } = filterdata(
    transformedSpot,
    transformedStrike
  );

  // for y axix min,max set
  const ltp1 = Array.isArray(filterArr1)
    ? filterArr1?.map((data) => Object.values(data)[0])
    : [];
  // for x axix
  const xAxisValues1 = Array.isArray(filterArr1)
    ? filterArr1?.flatMap(
        (item: any) => formatDateToCustomString(Object.keys(item)[0]) || []
      )
    : [];

  // for series
  const lineSeries: any = [
    {
      name: "Spot Price",
      data: Array.isArray(filterArr1)
        ? filterArr1.map((data: any) => Object.values(data)[0])
        : [],
      color: "#000000",
      yAxis: 0,
      type: "line",
    },

    {
      name: "Call ",
      data: Array.isArray(filterArr2)
        ? filterArr2
            ?.map((i) => i.totalCeOi.map((data: any) => Object.values(data)[0]))
            .flat()
        : [],
      color: "#F44336",
    },
    {
      name: "Put ",
      data: Array.isArray(filterArr2)
        ? filterArr2
            ?.map((i) => i.totalPeOi.map((data: any) => Object.values(data)[0]))
            .flat()
        : [],
      color: "#4CAF50",
    },
  ];

  return {
    series,
    xAxisValues: xAxisValues1,
    lineSeries,
    ltp: ltp1,
    oiData: [
      filterArr2?.map((i:any) =>
        i.totalCeOi.map((data: any) => Object.values(data)[0]).flat()
      ),
      filterArr2?.map((i:any) =>
        i.totalPeOi.map((data: any) => Object.values(data)[0]).flat()
      ),
    ].flat(),
  };
};

export default CombinedOiData;
