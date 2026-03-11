function getHighestOIStrikes(data: any) {
  const CE = data?.filter((i) => i.option_type === "CE");
  const PE = data?.filter((i) => i.option_type === "PE");

  const highestCE = CE?.reduce(
    (max, item) =>
      max === null || item?.latest_oi >= max?.latest_oi ? item : max,
    null
  );

  const highestPE = PE?.reduce(
    (max, item) =>
      max === null || item?.latest_oi >= max?.latest_oi ? item : max,
    null
  );
  return {
    ceStrike: highestCE?.strike_price || null,
    peStrike: highestPE?.strike_price || null,
  };
}

export { getHighestOIStrikes };
