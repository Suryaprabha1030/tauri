export const extractAndSortOptions = (
  data: any,
  oiPercent: any,
  oiValue: any,
  toggleState: any,
  websocketDataRead: any,
  netPercentage: any
) => {
  const result: any = [];
  for (const strike in data) {
    const options = data[strike];
    options.forEach((option: any) => {
      const match = option.symbol.match(
        /^([A-Z]+)(\d{2}[A-Z]{3}\d{2})(\d+)(CE|PE)$/
      );
      const oiKey = `${strike}#${option.option_type}`;
      const oipercent = oiPercent[oiKey] || 0;
      const oi = oiValue[oiKey] || 0;
      const symbolPart = match ? `${match[3]} ${match[4]}` : option.symbol;
      result.push({
        x: symbolPart,
        symbol: option.symbol,
        ltp: websocketDataRead[option?.identifier] ?? 0,
        chgPercent: netPercentage[option?.identifier] ?? 0,
        identifier: option.identifier,
        expiry: option.expiry,
        option_type: option.option_type,
        strike_price: option.strike_price,
        index_name: option.index_name,
        lot_size: option.lot_size,
        position: option.position,
        token: option.token,
        oiPercent: oipercent,
        oi: toggleState == "OI" ? oi : null,
      });
    });
  }
  result.sort((a: any, b: any) => b.chgPercent - a.chgPercent);
  return result;
};
