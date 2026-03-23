import {
  customRound,
  daysUntilExpiry,
  getCurrentFormattedDate,
} from "./calculateCommon";
import { calculateCallPrice, calculatePutPrice } from "./CalculatePrice";
import { dataFrameData, dataFrameData2 } from "./dataFrame";
import * as dfd from "danfojs";

const interestRate = 0.1;
const impliedVolatility = 0.11;

function long_CE(
  legsLongCall: any[],
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  spotPrice: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
): {
  target_pnl_table: any[];
  target_pay_off_data: any[];
  pay_off_data: any[];
} {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;
    const targetLtp = target_ltp ?? premium;
    // const target_days_to_expire = if  daysToexpiryDate else daysUntilExpiry(expiry_date);
    const target_days_to_expire = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);

    const targetPremiumRound: any = calculateCallPrice(
      target_spot_price_round_off,
      strikePrice,
      target_days_to_expire,
      ivValue / 100,
      interestRate
    );
    let recent_days_to_expire: any = null;
    let calculateExpiry: any = null;
    const day_to_expiryDate: any = daysUntilExpiry(expiry_date);
    if (
      recentExpiryDate.trim().toUpperCase() != expiry_date.trim().toUpperCase()
    ) {
      recent_days_to_expire = daysUntilExpiry(recentExpiryDate);
      calculateExpiry = day_to_expiryDate - recent_days_to_expire;
    } else {
      calculateExpiry = -1;
    }

    const data: any = dataFrameData(
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment,
      strikePrice,
      premium,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: Array(data.spot_price.length).fill(data.premium),
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    const spotPrices = df.column("spot_price").values;
    const strike: any = df.column("strike_price").values;
    const premiumRange = spotPrices.map((val: any, i: any) =>
      Math.max(val - strike[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const rows = df.values;
    if (calculateExpiry > 0) {
      const targetPremiumSeries2 = rows.map((row: any) => {
        const spot_price = row[0];
        const strike_price = row[2];
        return calculateCallPrice(
          spot_price,
          strike_price,
          calculateExpiry,
          ivValue / 100,
          interestRate
        );
      });
      df.addColumn("target_premium", targetPremiumSeries2, { inplace: true });
    }

    const values = df.values;
    const columns = df.columns;
    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });
      const {
        premium,
        target_premium,
        lot_size,
        quantity,
        premium_value_range,
      } = rowObj;

      if (calculateExpiry > 0) {
        return customRound((target_premium - premium) * lot_size * quantity, 7);
      } else {
        return customRound(
          (premium_value_range - premium) * lot_size * quantity,
          7
        );
      }
    });

    df.addColumn("result", result, { inplace: true });
    pay_off_data.push([dfd.toJSON(df)]);

    const targetPnl: any = (targetPremiumRound - targetLtp) * lotSize * lots;
    const target_pnl_result = {
      identifier,
      target_pnl: parseFloat(targetPnl),
      transaction_type: "LONG",
      option_type: "CE",
      target_premium: parseFloat(targetPremiumRound),
      ltp: premium,
      target_entry_price: targetLtp,
      lots,
      lot_size: lotSize,
      expiry: expiry_date,
      strike_price: strikePrice,
    };

    target_pnl_table.push(target_pnl_result);
  }
  return { target_pnl_table, target_pay_off_data, pay_off_data };
}

const longPE = (
  legsLongCall: any,
  target_spot_price_round_off: any,
  recentExpiryDate: any,
  daysToexpiryDate: any,
  target_pnl_table: any,
  target_pay_off_data: any,
  pay_off_data: any,
  spotPrice: any,
  incrementer: any,
  spotPriceRoundoff: any,
  plot_increment: any
) => {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;

    const targetLtp = target_ltp ?? premium;
    const target_days_to_expire = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);
    const targetPremiumRound: any = calculatePutPrice(
      target_spot_price_round_off,
      strikePrice,
      target_days_to_expire,
      interestRate,
      ivValue / 100
    );
    let recent_days_to_expire: any = null;
    let calculateExpiry: any = null;
    const day_to_expiryDate: any = daysUntilExpiry(expiry_date);
    if (
      recentExpiryDate.trim().toUpperCase() != expiry_date.trim().toUpperCase()
    ) {
      recent_days_to_expire = daysUntilExpiry(recentExpiryDate);
      calculateExpiry = day_to_expiryDate - recent_days_to_expire;
    } else {
      calculateExpiry = -1;
    }

    const data: any = dataFrameData(
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment,
      strikePrice,
      premium,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: Array(data.spot_price.length).fill(data.premium),
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    // console.table(dfd.toJSON(df));

    const spotPrices: any = df.column("spot_price").values;
    const strike = df.column("strike_price").values;

    const premiumRange = strike.map((val: any, i: any) =>
      Math.max(val - spotPrices[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const rows = df.values;
    if (calculateExpiry > 0) {
      const targetPremiumSeries = rows.map((row:any) => {
        const spot_price = row[0];
        const strike_price = row[2];
        return calculatePutPrice(
          spot_price,
          strike_price,
          calculateExpiry,
          interestRate,
          ivValue / 100
        );
      });

      df.addColumn("target_premium", targetPremiumSeries, { inplace: true });
    }

    const values = df.values;
    const columns = df.columns;

    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });

      const {
        premium,
        target_premium,
        lot_size,
        quantity,
        premium_value_range,
      } = rowObj;

      if (calculateExpiry > 0) {
        return customRound((target_premium - premium) * lot_size * quantity, 7);
      } else {
        return customRound(
          (premium_value_range - premium) * lot_size * quantity,
          7
        );
      }
    });

    df.addColumn("result", result, { inplace: true });

    pay_off_data.push([dfd.toJSON(df)]);

    const targetPnl: any = (targetPremiumRound - targetLtp) * lotSize * lots;

    const target_pnl_result = {
      identifier,
      target_pnl: parseFloat(targetPnl),
      transaction_type: "LONG",
      option_type: "PE",
      target_premium: parseFloat(targetPremiumRound),
      ltp: premium,
      target_entry_price: targetLtp,
      lots,
      lot_size: lotSize,
      expiry: expiry_date,
      strike_price: strikePrice,
    };

    target_pnl_table.push(target_pnl_result);
  }

  return { target_pnl_table, target_pay_off_data, pay_off_data };
};

const shortCE = (
  legsLongCall: any[],
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  spotPrice: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
) => {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;

    const targetLtp = target_ltp ?? premium;

    const target_days_to_expire = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);
    const targetPremiumRound: any = calculateCallPrice(
      target_spot_price_round_off,
      strikePrice,
      target_days_to_expire,
      ivValue / 100,
      interestRate
    );
    let recent_days_to_expire: any = null;
    let calculateExpiry: any = null;
    const day_to_expiryDate: any = daysUntilExpiry(expiry_date);
    if (
      recentExpiryDate.trim().toUpperCase() != expiry_date.trim().toUpperCase()
    ) {
      //
      recent_days_to_expire = daysUntilExpiry(recentExpiryDate);
      calculateExpiry = day_to_expiryDate - recent_days_to_expire;
    } else {
      calculateExpiry = -1;
    }

    const data: any = dataFrameData(
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment,
      strikePrice,
      premium,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: Array(data.spot_price.length).fill(data.premium),
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    const spotPrices: any = df.column("spot_price").values;
    const strike = df.column("strike_price").values;

    const premiumRange = strike.map((val: any, i: any) =>
      Math.min(val - spotPrices[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });
    const rows :any= df.values;
    if (calculateExpiry > 0) {
      const targetPremiumSeries = rows.map((row:any) => {
        const spot_price = row[0];
        const strike_price = row[2];
        return calculateCallPrice(
          spot_price,
          strike_price,
          calculateExpiry,
          ivValue / 100,
          interestRate
        );
      });
      df.addColumn("target_premium", targetPremiumSeries, { inplace: true });
    }
    const values = df.values;
    const columns = df.columns;

    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });

      const {
        premium,
        target_premium,
        lot_size,
        quantity,
        premium_value_range,
      } = rowObj;

      if (calculateExpiry > 0) {
        return customRound((premium - target_premium) * lot_size * quantity, 7);
      } else {
        return customRound(
          (premium_value_range + premium) * lot_size * quantity,
          7
        );
      }
    });

    df.addColumn("result", result, { inplace: true });

    pay_off_data.push([dfd.toJSON(df)]);

    const targetPnl: any = (targetPremiumRound - targetLtp) * lotSize * lots;

    const target_pnl_result = {
      identifier,
      target_pnl: parseFloat(targetPnl),
      transaction_type: "SHORT",
      option_type: "CE",
      target_premium: parseFloat(targetPremiumRound),
      ltp: premium,
      target_entry_price: targetLtp,
      lots,
      lot_size: lotSize,
      expiry: expiry_date,
      strike_price: strikePrice,
    };

    target_pnl_table.push(target_pnl_result);
  }
  return { target_pnl_table, target_pay_off_data, pay_off_data };
};

const shortPE = (
  legsLongCall: any[],
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  spotPrice: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
) => {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;

    const targetLtp = target_ltp ?? premium;

    const target_days_to_expire = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);
    const targetPremiumRound: any = calculatePutPrice(
      target_spot_price_round_off,
      strikePrice,
      target_days_to_expire,
      interestRate,
      ivValue / 100
    );
    let recent_days_to_expire: any = null;
    let calculateExpiry: any = null;
    const day_to_expiryDate: any = daysUntilExpiry(expiry_date);
    if (
      recentExpiryDate.trim().toUpperCase() != expiry_date.trim().toUpperCase()
    ) {
      recent_days_to_expire = daysUntilExpiry(recentExpiryDate);
      calculateExpiry = day_to_expiryDate - recent_days_to_expire;
    } else {
      calculateExpiry = -1;
    }

    const data: any = dataFrameData(
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment,
      strikePrice,
      premium,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: Array(data.spot_price.length).fill(data.premium),
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });
    const spotPrices = df.column("spot_price").values;
    const strike: any = df.column("strike_price").values;

    const premiumRange = spotPrices.map((val: any, i: any) =>
      Math.min(val - strike[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const rows = df.values;
    if (calculateExpiry > 0) {
      const targetPremiumSeries = rows.map((row: any) => {
        const spot_price = row[0];
        const strike_price = row[2];
        return calculatePutPrice(
          spot_price,
          strike_price,
          calculateExpiry,
          interestRate,
          ivValue / 100
        );
      });

      df.addColumn("target_premium", targetPremiumSeries, { inplace: true });
    }
    const values = df.values;
    const columns = df.columns;

    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });

      const {
        premium,
        target_premium,
        lot_size,
        quantity,
        premium_value_range,
      } = rowObj;

      if (calculateExpiry > 0) {
        return customRound((premium - target_premium) * lot_size * quantity, 7);
      } else {
        return customRound(
          (premium_value_range + premium) * lot_size * quantity,
          7
        );
      }
    });

    df.addColumn("result", result, { inplace: true });

    pay_off_data.push([dfd.toJSON(df)]);

    const targetPnl: any = (targetPremiumRound - targetLtp) * lotSize * lots;

    const target_pnl_result = {
      identifier,
      target_pnl: parseFloat(targetPnl),
      transaction_type: "SHORT",
      option_type: "PE",
      target_premium: parseFloat(targetPremiumRound),
      ltp: premium,
      target_entry_price: targetLtp,
      lots,
      lot_size: lotSize,
      expiry: expiry_date,
      strike_price: strikePrice,
    };

    target_pnl_table.push(target_pnl_result);
  }
  return { target_pnl_table, target_pay_off_data, pay_off_data };
};

const shortFut = (
  legsLongCall: any[],
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  spotPrice: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
) => {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;

    const target_days_to_expire = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);
    const targetPremiumRound: any = calculatePutPrice(
      target_spot_price_round_off,
      strikePrice,
      target_days_to_expire,
      interestRate,
      ivValue / 100
    );

    const data: any = dataFrameData2(
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment,
      strikePrice,
      premium,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      // strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: data.premium,
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    const spotPrices: any = df.column("spot_price").values;

    const premiums = df.column("premium").values;
    const premiumRange = premiums.map((val: any, i: any) =>
      Math.min(val - spotPrices[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const values = df.values;
    const columns = df.columns;

    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });

      const {
        premium,

        lot_size,
        quantity,
      } = rowObj;

      if (premium == null || lot_size == null || quantity == null) {
        return null;
      } else {
        return customRound(-1 * premium * lot_size * quantity, 7);
      }
    });

    df.addColumn("result", result, { inplace: true });

    pay_off_data.push([dfd.toJSON(df)]);
    target_pay_off_data.push([dfd.toJSON(df)]);
  }
  return { pay_off_data, target_pay_off_data };
};

const longFut = (
  legsLongCall: any[],
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  spotPrice: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
) => {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
    } = leg;

    const data: any = dataFrameData2(
      spotPrice,
      incrementer,
      spotPriceRoundoff,
      plot_increment,
      strikePrice,
      premium,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      premium: data.premium,
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    const spotPrices = df.column("spot_price").values;

    const premiums: any = df.column("premium").values;
    const premiumRange = spotPrices.map((val: any, i: any) =>
      Math.min(val - premiums[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const values = df.values;
    const columns = df.columns;

    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });

      const {
        premium,

        lot_size,
        quantity,
      } = rowObj;

      if (premium == null || lot_size == null || quantity == null) {
        return null;
      } else {
        return customRound(premium * lot_size * quantity, 7);
      }
    });

    df.addColumn("result", result, { inplace: true });

    pay_off_data.push([dfd.toJSON(df)]);
    target_pay_off_data.push([dfd.toJSON(df)]);
  }
  return { pay_off_data, target_pay_off_data };
};

function target_long_CE(
  long_ce_data: any[],
  target_spot_price: number,
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  spotPrice: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
) {
  for (const leg of long_ce_data) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;

    const targetLtp = target_ltp ?? premium;

    const day_to_expiryDate: any = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);

    const data: any = dataFrameData(
      target_spot_price,
      incrementer,
      target_spot_price_round_off,
      plot_increment,
      strikePrice,
      targetLtp,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: Array(data.spot_price.length).fill(data.premium),
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    const spotPrices = df.column("spot_price").values;
    const strike: any = df.column("strike_price").values;
    const premiumRange = spotPrices.map((val: any, i: any) =>
      Math.max(val - strike[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const rows = df.values;

    const targetPremiumSeries2 = rows.map((row:any) => {
      const spot_price = row[0];
      const strike_price = row[2];
      return calculateCallPrice(
        spot_price,
        strike_price,
        day_to_expiryDate,
        ivValue / 100,
        interestRate
      );
    });
    df.addColumn("target_premium", targetPremiumSeries2, { inplace: true });

    const values = df.values;
    const columns = df.columns;
    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });
      const {
        premium,
        target_premium,
        lot_size,
        quantity,
        premium_value_range,
      } = rowObj;

      return customRound((target_premium - premium) * lot_size * quantity, 7);
    });

    df.addColumn("result", result, { inplace: true });

    target_pay_off_data.push([dfd.toJSON(df)]);
  }
  return { target_pay_off_data };
}

function target_long_PE(
  legsLongCall: any[],
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  target_spot_price: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
) {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;

    const targetLtp = target_ltp ?? premium;
    const day_to_expiryDate: any = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);

    const data: any = dataFrameData(
      target_spot_price,
      incrementer,
      target_spot_price_round_off,
      plot_increment,
      strikePrice,
      targetLtp,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: Array(data.spot_price.length).fill(data.premium),
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    const spotPrices = df.column("spot_price").values;
    const strike: any = df.column("strike_price").values;
    const premiumRange = spotPrices.map((val: any, i: any) =>
      Math.max(val - strike[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const rows = df.values;

    const targetPremiumSeries2 = rows.map((row:any) => {
      const spot_price = row[0];
      const strike_price = row[2];
      return calculatePutPrice(
        spot_price,
        strike_price,
        day_to_expiryDate,
        interestRate,
        ivValue / 100
      );
    });
    df.addColumn("target_premium", targetPremiumSeries2, { inplace: true });

    const values = df.values;
    const columns = df.columns;
    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });
      const {
        premium,
        target_premium,
        lot_size,
        quantity,
        premium_value_range,
      } = rowObj;

      return customRound((target_premium - premium) * lot_size * quantity, 7);
    });

    df.addColumn("result", result, { inplace: true });

    target_pay_off_data.push([dfd.toJSON(df)]);
  }
  return { target_pay_off_data };
}
function target_short_PE(
  legsLongCall: any[],
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  target_spot_price: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
) {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;
    const targetLtp = target_ltp ?? premium;
    const day_to_expiryDate: any = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);

    const data: any = dataFrameData(
      target_spot_price,
      incrementer,
      target_spot_price_round_off,
      plot_increment,
      strikePrice,
      targetLtp,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: Array(data.spot_price.length).fill(data.premium),
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    const spotPrices = df.column("spot_price").values;
    const strike: any = df.column("strike_price").values;
    const premiumRange = spotPrices.map((val: any, i: any) =>
      Math.max(val - strike[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const rows = df.values;

    const targetPremiumSeries2 = rows.map((row: any) => {
      const spot_price = row[0];
      const strike_price = row[2];
      return calculatePutPrice(
        spot_price,
        strike_price,
        day_to_expiryDate,
        interestRate,
        ivValue / 100
      );
    });
    df.addColumn("target_premium", targetPremiumSeries2, { inplace: true });

    const values = df.values;
    const columns = df.columns;
    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });
      const {
        premium,
        target_premium,
        lot_size,
        quantity,
        premium_value_range,
      } = rowObj;

      return customRound((premium - target_premium) * lot_size * quantity, 7);
    });

    df.addColumn("result", result, { inplace: true });

    target_pay_off_data.push([dfd.toJSON(df)]);
  }
  return { target_pay_off_data };
}

function target_short_CE(
  legsLongCall: any[],
  target_spot_price_round_off: number,
  recentExpiryDate: string,
  daysToexpiryDate: number,
  target_pnl_table: any[],
  target_pay_off_data: any[],
  pay_off_data: any[],
  target_spot_price: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number
) {
  for (const leg of legsLongCall) {
    const {
      identifier,
      strike_price: strikePrice,
      ltp: premium,
      lot_size: lotSize,
      lots,
      expiry: expiry_date,
      target_ltp,
      ivValue,
    } = leg;

    const targetLtp = target_ltp ?? premium;

    const day_to_expiryDate: any = daysToexpiryDate
      ? daysToexpiryDate
      : daysUntilExpiry(expiry_date);

    const data: any = dataFrameData(
      target_spot_price,
      incrementer,
      target_spot_price_round_off,
      plot_increment,
      strikePrice,
      targetLtp,
      lotSize,
      lots
    );

    const df = new dfd.DataFrame({
      spot_price: data.spot_price,
      strike_prices: data.strike_prices,
      strike_price: Array(data.spot_price.length).fill(data.strike_price),
      premium: Array(data.spot_price.length).fill(data.premium),
      lot_size: Array(data.spot_price.length).fill(data.lot_size),
      quantity: Array(data.spot_price.length).fill(data.quantity),
    });

    const spotPrices = df.column("spot_price").values;
    const strike: any = df.column("strike_price").values;
    const premiumRange = spotPrices.map((val: any, i: any) =>
      Math.max(val - strike[i], 0)
    );
    df.addColumn("premium_value_range", premiumRange, { inplace: true });

    const rows = df.values;

    const targetPremiumSeries2 = rows.map((row:any) => {
      const spot_price = row[0];
      const strike_price = row[2];
      return calculateCallPrice(
        spot_price,
        strike_price,
        day_to_expiryDate,
        ivValue / 100,
        interestRate
      );
    });
    df.addColumn("target_premium", targetPremiumSeries2, { inplace: true });

    const values = df.values;
    const columns = df.columns;
    const result: any = values.map((row: any) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col: string, i: number) => {
        rowObj[col] = row[i];
      });
      const {
        premium,
        target_premium,
        lot_size,
        quantity,
        premium_value_range,
      } = rowObj;

      return customRound((premium - target_premium) * lot_size * quantity, 7);
    });

    df.addColumn("result", result, { inplace: true });

    target_pay_off_data.push([dfd.toJSON(df)]);
  }
  return { target_pay_off_data };
}

// Similar structure for longPE, shortCE, shortPE, longFut, shortFut (omitted for brevity, but follow the same pattern)
export {
  long_CE,
  longPE,
  shortCE,
  shortPE,
  longFut,
  shortFut,
  target_long_CE,
  target_long_PE,
  target_short_PE,
  target_short_CE,
};
