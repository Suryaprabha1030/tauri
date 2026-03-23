import {
  calculateMarginData,
  marginpayloadAdded,
} from "./payOffChartUtils/marginCalculated";
import {
  getNearestMultiple,
  mergeDataArrays,
} from "./payOffChartUtils/calculateCommon";
import { validateDataFrameResults } from "./payOffChartUtils/dataFrame";
import {
  long_CE,
  shortCE,
  shortPE,
  longPE,
  shortFut,
  longFut,
  target_long_CE,
  target_long_PE,
  target_short_PE,
  target_short_CE,
} from "./payOffChartUtils/legCalculation";

import { analyseProfitAndLoss } from "./payOffChartUtils/profitLossCalculation";

export const MultiLegCalc = (
  spotPrice: any,
  spotPriceRoundoff: any,
  exchange: string,
  indexName: string,
  loadleg: any,
  target_spot_price: any,
  daysToexpiryDate: any,
  recentExpiryDate: any,
  dispatch: any,
  router: any,
  query: any,
  incrementer: any
) => {
  let target_pnl_table:any = [];
  let pay_off_data: any = [];
  let target_pay_off_data: any = [];
  let margin_payload: any = [];

  let legs: any = [];

  const long_ce_data: any = loadleg["LONG"]["CE"];
  const long_pe_data: any = loadleg["LONG"]["PE"];
  const short_ce_data: any = loadleg["SHORT"]["CE"];
  const short_pe_data: any = loadleg["SHORT"]["PE"];
  const short_fut_data: any = loadleg["SHORT"]["FUT"];
  const long_fut_data: any = loadleg["LONG"]["FUT"];
  // ###1

  const target_spot_price_round_off = getNearestMultiple(
    target_spot_price,
    query == "NIFTY" ? 50 : 100
  );

  const plot_increment = 10;

  // ###2

  if (long_ce_data && long_ce_data.length > 0) {
    marginpayloadAdded(long_ce_data, margin_payload);

    const data: any = long_CE(
      long_ce_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );

    const data2: any = target_long_CE(
      long_ce_data,
      target_spot_price,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );

    legs.push(data.long_ce_data);
  }

  if (long_pe_data && long_pe_data.length > 0) {
    marginpayloadAdded(long_pe_data, margin_payload);
    const data: any = longPE(
      long_pe_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );
    const data2: any = target_long_PE(
      long_pe_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      target_spot_price,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );

    legs.push(data.long_pe_data);
  }

  if (short_ce_data && short_ce_data.length > 0) {
    marginpayloadAdded(short_ce_data, margin_payload);
    const data: any = shortCE(
      short_ce_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );
    const data2: any = target_short_CE(
      short_ce_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      target_spot_price,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );

    legs.push(data.short_ce_data);
  }

  if (short_pe_data && short_pe_data.length > 0) {
    marginpayloadAdded(short_pe_data, margin_payload);
    const data: any = shortPE(
      short_pe_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );
    const data2: any = target_short_PE(
      short_pe_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      target_spot_price,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );

    legs.push(data.short_pe_data);
  }

  if (short_fut_data && short_fut_data.length > 0) {
    marginpayloadAdded(short_fut_data, margin_payload);
    const data: any = shortFut(
      short_fut_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );

    legs.push(short_fut_data);
  }

  if (long_fut_data && long_fut_data.length > 0) {
    marginpayloadAdded(long_fut_data, margin_payload);
    const data: any = longFut(
      long_fut_data,
      target_spot_price_round_off,
      recentExpiryDate,
      daysToexpiryDate,
      target_pnl_table,
      target_pay_off_data,
      pay_off_data,
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment
    );

    legs.push(long_fut_data);
  }
  const validatePayOffData = validateDataFrameResults(pay_off_data);
  const data2 = mergeDataArrays(
    validatePayOffData,
    validateDataFrameResults(target_pay_off_data),
    "strike_prices",
    "_df1",
    "_df2"
  );

  const renameMap:any = {
    result_df1: "expiry_pnl",
    result_df2: "target_pnl",
    spot_price_df1: "spot_price",
    spot_price_df2: "target_spot_price",
    strike_prices: "strike_price",
  };

  const renamedData = data2.map((row: any) => {
    const renamedRow:any= {};
    for (const key in row) {
      renamedRow[renameMap[key] || key] = row[key];
    }

    return renamedRow;
  });

  const roundedTargetSpotPrice = Number(target_spot_price?.toFixed(2));

  const projectedPnl = renamedData.find(
    (item: any) =>
      Number(item.target_spot_price?.toFixed(2)) === roundedTargetSpotPrice
  );

  return {
    renamedData,
    target_pnl_table,
    validatePayOffData,
    projectedPnl,
    margin_payload,
  };
};
