import {
  convertStrikePriceOption,
  extractSumFalseData,
  extractSumFalseData2,
  formatDateToCustomString,
  generateColorFromStrikePrice,
} from "../../OIUtil";

const StraddleStrangleData = (data: any) => {
  const combData = data?.data || [];
  const ltp1 = data?.spot_price || [];
  const pcr = data?.pcr;
  const maxPain = data?.max_pain;
  // spot price set time key nd ltp value
  const transformedSpots = ltp1
    ?.map((item) => ({ [item.time]: item.spot_price }))
    .sort(
      (a, b) =>
        new Date(Object.keys(a)[0]).getTime() -
        new Date(Object.keys(b)[0]).getTime()
    );
  // strike price data like each obj like  key is created_at  and sumltp value, vwap is  value
  const transformedStrikes: any = [
    {
      sumLtp: combData
        ?.map((curr) => ({ [curr.created_at]: curr.strategy_price }))
        .sort(
          (a, b) =>
            new Date(Object.keys(a)[0]).getTime() -
            new Date(Object.keys(b)[0]).getTime()
        ),
      vwap: combData
        ?.map((curr) => ({ [curr.created_at]: curr.strategy_vwap }))
        .sort(
          (a, b) =>
            new Date(Object.keys(a)[0]).getTime() -
            new Date(Object.keys(b)[0]).getTime()
        ),
      maxPainValue: maxPain
        ?.map((curr: any) => ({
          [curr.interval_time]: curr.max_pain_strike, //  correct key/value
        }))
        .sort(
          (a: any, b: any) =>
            new Date(Object.keys(a)[0]).getTime() -
            new Date(Object.keys(b)[0]).getTime()
        ),
    },
  ];

  const transFormedPcrData = [
    {
      pcrValue: pcr
        ?.map((curr) => ({ [curr.created_at]: curr.pcr }))
        .sort(
          (a, b) =>
            new Date(Object.keys(a)[0]).getTime() -
            new Date(Object.keys(b)[0]).getTime()
        ),
    },
  ];

  // get strike price option key and value is subkey => created_at and value is ce_ltp and pe ltp
  const sumFalseData1 = Array.isArray(extractSumFalseData2(data?.data))
    ? extractSumFalseData2(data?.data)
    : [];
  // fliter by key wise if common key(create_at) only filtered and
  function filterMatchingKeys(
    arr1: any,
    arr2: any,
    arr3: any,
    transFormedPcrData: any
    // transFormedMaxPainData: any
  ) {
    const keysSet = new Set(arr1?.map((obj: any) => Object.keys(obj)[0]));

    const filteredArr2 = arr2?.map((item: any) => ({
      sumLtp: item?.sumLtp?.filter((dataObj: any) =>
        keysSet.has(Object.keys(dataObj)[0])
      ),
      vwap: item?.vwap?.filter((dataObj: any) =>
        keysSet.has(Object.keys(dataObj)[0])
      ),
      maxPainValue: item?.maxPainValue?.filter((dataObj: any) =>
        keysSet.has(Object.keys(dataObj)[0])
      ),
    }));
    const validKeysInArr2 = new Set(
      filteredArr2.flatMap((item: any) =>
        item?.sumLtp?.map((dataObj: any) => Object.keys(dataObj)[0])
      )
    );

    const sumsData = arr3.map((item: any) => ({
      strikePrice: item?.strikePrice,
      ltp: item?.ltp?.filter((dataObj: any) =>
        keysSet.has(Object.keys(dataObj)[0])
      ),
    }));

    const pcrData = transFormedPcrData.map((item: any) => ({
      pcr: item?.pcrValue?.filter((dataObj: any) =>
        keysSet.has(Object.keys(dataObj)[0])
      ),
    }));
    const maxPainData = filteredArr2.map((item: any) => ({
      maxPain: item?.maxPainValue?.filter((dataObj: any) =>
        validKeysInArr2.has(Object.keys(dataObj)[0])
      ),
    }));
    return {
      filteredArr1: arr1?.filter((obj: any) =>
        validKeysInArr2.has(Object.keys(obj)[0])
      ),
      filteredArr2,
      sumsData,
      pcrData,
      maxPainData,
    };
  }

  const { filteredArr1, filteredArr2, sumsData, pcrData, maxPainData } =
    filterMatchingKeys(
      transformedSpots,
      transformedStrikes,
      sumFalseData1,
      transFormedPcrData
    );

  // spot price for min and max value set for options
  const spotPriceValues = Array.isArray(filteredArr1)
    ? filteredArr1.map((obj: any) => Number(Object.values(obj)[0]))
    : [];

  // Extract Max Pain values
  const maxPainValues = Array.isArray(maxPainData)
    ? maxPainData
        .flatMap((i: any) => i?.maxPain)
        .map((obj: any) => Number(Object.values(obj)[0]))
    : [];

  // Combine both arrays
  const ltpvalue = [...spotPriceValues, ...maxPainValues];

  // Optional: sort if you want ascending order
  const ltp2 = ltpvalue.sort((a, b) => a - b);
  // series for vwap and ltp
  const permanentSeries2 = [
    {
      name: "Spot Price",
      data: Array.isArray(filteredArr1)
        ? filteredArr1?.map((obj: any) => Object.values(obj)[0])
        : [],
      color: "#000000",
      type: "line",
    },
    {
      name: "VWAP",
      data: Array.isArray(filteredArr2)
        ? filteredArr2
            ?.map((i) =>
              i?.vwap?.map((obj: any) =>
                (Number(Object.values(obj)[0]) || 0).toFixed(2)
              )
            )
            .flat()
        : [],
      color: "#FFFD37",
    },
    {
      name: "PCR",
      data: Array.isArray(pcrData)
        ? pcrData
            ?.map((i) =>
              i?.pcr?.map((obj: any) =>
                (Number(Object.values(obj)[0]) || 0).toFixed(2)
              )
            )
            .flat()
        : [],
      color: "#FFA500",
    },
    {
      name: "Max Pain",
      data: Array.isArray(maxPainData)
        ? maxPainData
            ?.map((i) =>
              i?.maxPain?.map((obj: any) =>
                (Number(Object.values(obj)[0]) || 0).toFixed(2)
              )
            )
            .flat()
        : [],
      color: "#008000", // Green
    },
  ];

  // sum ltp
  const series1 = [
    {
      name: "Sum LTP",
      data: Array.isArray(filteredArr2)
        ? filteredArr2
            ?.map((i) =>
              i?.sumLtp?.map((obj: any) =>
                (Number(Object.values(obj)[0]) || 0).toFixed(2)
              )
            )
            .flat()
        : [],
      color: "#000080",
    },
  ];

  // xaxix value get from spotprice filterd array
  const xAxisValues1 = Array.isArray(filteredArr1)
    ? filteredArr1.flatMap(
        (item: any) => formatDateToCustomString(Object.keys(item)[0]) || []
      )
    : [];

  // if combine value set false,show each strike price plot
  const uniqueSeries = sumsData?.map((item: any, index: any) => ({
    name: convertStrikePriceOption(item?.strikePrice) || `Series ${index + 1}`,
    data: Array.isArray(item?.ltp)
      ? item?.ltp.map((obj: any) => Object.values(obj)[0])
      : Array(10).fill(50),
    color: generateColorFromStrikePrice(item?.strikePrice),
  }));

  //  if combine value set true, showing series
  const combinedSeries1 = [permanentSeries2, ...series1];

  //  if combine value set false,showing series
  const uniqueCombinedSeries = uniqueSeries.length > 0 && [
    permanentSeries2,
    ...uniqueSeries,
  ];
  return {
    series: combinedSeries1?.flat(),
    xAxisValues: xAxisValues1,
    ltp: ltp2,
    uniqueCombinedSeries,
    uniqueSeries,
    filteredArr2,
    pcrData,
    maxPainData,
  };
};

export default StraddleStrangleData;
