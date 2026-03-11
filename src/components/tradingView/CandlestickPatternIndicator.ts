const plotStyleMap = {
  bullish: {
    color: "green",
    textColor: "white",
    plottype: "shape_label_up",
    location: "BelowBar",
  },
  bearish: {
    color: "red",
    textColor: "white",
    plottype: "shape_label_down",
    location: "AboveBar",
  },
  neutral: {
    color: "gray",
    textColor: "white",
    plottype: "shape_label_down",
    location: "AboveBar",
  },
};
const patternTypes = [
  "neutral", // plot_0: Doji
  "bullish", // plot_1: Hammer
  "bearish", // plot_2: HangingMan
  "bullish", // plot_3: InvHammer
  "bearish", // plot_4: ShootingStar
  "neutral", // plot_5: SpinningTop
  "bullish", // plot_6: BullishEngulfing
  "bearish", // plot_7: BearishEngulfing
  "bearish", // plot_8: TweezerTops
  "bullish", // plot_9: TweezerBottoms
  "bullish", // plot_10: BullishHarami
  "bearish", // plot_11: BearishHarami
  "bullish", // plot_12: MorningStar
  "bearish", // plot_13: EveningStar
  "bullish", // plot_14: ThreeWhiteSoldiers
  "bearish", // plot_15: ThreeBlackCrows
  "bullish", // plot_16: RisingThreeMethods
  "bearish", // plot_17: FallingThreeMethods
  "bullish", // plot_18: PiercingLine
  "bullish", // plot_19: BullishAbandonedBaby
  "bullish", // plot_20: ThreeInsideUp
  "bullish", // plot_21: MatHoldBullish
  "bullish", // plot_22: CounterattackLineBullish
  "bullish", // plot_23: BeltHoldBullish
  "bullish", // plot_24: SeparatingLinesBullish
  "bullish", // plot_25: ThrustingPattern
  "bullish", // plot_26: HammerCross
  "bullish", // plot_27: InvertedHammerCross
  "bearish", // plot_28: DarkCloudCover
  "bearish", // plot_29: BearishAbandonedBaby
  "bearish", // plot_30: ThreeInsideDown
  "bearish", // plot_31: MatHoldBearish
  "bearish", //plot_32:Counterattack Line Bearish
  "bearish", //plot_33:Belt Hold Bearish
  "bearish", //plot_34:Separating Lines Bearish
  "bearish", //plot_35:Bearish Kicker
  "bearish", //plot_36:Abandoned Baby Cross (Bearish)
  "bearish", //plot_37:Three Stars In The North
  "neutral", //plot_38:Doji Star
  "neutral", //plot_39:Long-Legged Doji
  "neutral", //plot_40:Marubozu
  "neutral", //plot_41:High Wave Candle
  "neutral", //plot_42:Unique Three River Bottom
  "neutral", //plot_43:Deliberation Pattern
  "bullish", //plot_44:Dragonfly Doji bullish
  "bullish", //plot_45:Three outside Up
  "bullish", //plot_46:Concealing Baby Swallow Pattern
  "bullish", //plot_47:Three-Line Strike Pattern
  "bullish", //plot_48:Ladder Bottom Pattern
  "bullish", //plot_49:Bullish Meeting Lines
  "bearish", //plot_50:Bearish Meeting Lines
  "bearish", //plot_51:Bearish Three-Line Strike Pattern
  "bearish", //plot_52:Upside Gap Two Crows Pattern Bearish
  "bearish", //plot_53:Bearish Doji Star
  "bearish", //plot_54:Bearish Three Outside Down Pattern
  "bearish", //plot_55:Bullish kicker
];
const defaultStyles = {};
for (let i = 0; i < 56; i++) {
  defaultStyles[`plot_${i}`] = {
    ...plotStyleMap[patternTypes[i]],
    visible: i <= 4, // Hide everything except first 4 initially
  };
}

export const custom_indicators_getter = function (PineJS) {
  return Promise.resolve([
    {
      name: "Candlestick Patterns",
      metainfo: {
        _metainfoVersion: 52,
        name: "Candlestick Patterns",
        id: "CandlePatternDetector@tv-basicstudies-1",
        description: "Candlestick Patterns",
        shortDescription: "Candlestick Patterns",
        is_hidden_study: false,
        is_price_study: true,
        isCustomIndicator: true,
        format: { type: "price", precision: 2 },
        defaults: {
          precision: 2,
          styles: defaultStyles,
        },
        inputs: {},
        plots: Array.from({ length: 56 }, (_, i) => ({
          id: `plot_${i}`,
          type: "shapes",
        })),
        styles: (() => {
          const patterns = [
            "Doji",
            "Hammer",
            "Bearish Hanging Man",
            "Inverse Hammer",
            "Shooting Star",
            "Spinning Top",
            "Bullish Engulfing",
            "Bearish Engulfing",
            "Tweezer Tops",
            "Tweezer Bottoms",
            "Bullish Harami",
            "Bearish Harami",
            "Morning Star",
            "Evening Star",
            "Three White Soldiers",
            "Three Black Crows",
            "Rising Three Methods",
            "Falling Three Methods",
            "Piercing Line",
            "Bullish Abandoned Baby",
            "Three Inside Up",
            "Mat Hold Bullish",
            "Counter attackLine Bullish",
            "Belt Hold Bullish",
            "Separating Lines Bullish",
            "Thrusting Pattern",
            "Hammer Cross",
            "Inverted Hammer Cross",
            "Dark Cloud Cover",
            "Bearish Abandoned Baby",
            "Three Inside Down",
            "Mat Hold Bearish",
            "Counterattack LineBearish",
            "Belt Hold Bearish",
            "Separating Lines Bearish",
            "Bearish Kicker",
            "Abandoned Baby Cross",
            "Three Stars In The North",
            "Doji Star",
            "Long-Legged Doji",
            "Marubozu",
            "High Wave Candle",
            "Unique Three River Bottom",
            "Deliberation Pattern",
            "Dragonfly Doji bullish",
            "Three outside Up",
            "Concealing Baby Swallow Pattern",
            "Bullish Three-Line Strike Pattern ",
            "Ladder Bottom Pattern Bullish",
            "Bullish Meeting Lines",
            "Bearish Meeting Lines",
            "Bearish Three-Line Strike Pattern",
            "Upside Gap Two Crows Pattern",
            "Bearish Doji Star Pattern",
            "Bearish Three Outside Down Pattern",
            "Bullish Kicker",
          ];
          return patterns.reduce((acc, text, i) => {
            acc[`plot_${i}`] = {
              visible: i <= 4,
              location: [
                2, 4, 7, 8, 11, 13, 15, 17, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                37, 38, 39, 40, 41, 42, 50, 51, 52, 53, 54, 55,
              ].includes(i)
                ? "AboveBar"
                : "BelowBar",
              text: text,
              title: text,
              size: "Normal",
            };
            return acc;
          }, {});
        })(),
      },

      constructor: function () {
        (this as any).main = function (context, inputCallback) {
          const open = PineJS.Std.open(context);
          const high = PineJS.Std.high(context);
          const low = PineJS.Std.low(context);
          const close = PineJS.Std.close(context);

          const prevOpen = PineJS.Std.open(context, 1);
          const prevHigh = PineJS.Std.high(context, 1);
          const prevLow = PineJS.Std.low(context, 1);
          const prevClose = PineJS.Std.close(context, 1);

          const prev2Open = PineJS.Std.open(context, 2);
          const prev2Close = PineJS.Std.close(context, 2);
          const prev2High = PineJS.Std.high(context, 2);
          const prev2Low = PineJS.Std.low(context, 2);

          const prev3Open = PineJS.Std.open(context, 3);
          const prev3High = PineJS.Std.high(context, 3);
          const prev3Close = PineJS.Std.close(context, 3);

          const prev4Open = PineJS.Std.open(context, 4);
          const prev4Close = PineJS.Std.close(context, 4);

          const body = Math.abs(close - open);
          const prevBody = Math.abs(prevClose - prevOpen);
          const prev2Body = Math.abs(prev2Close - prev2Open);

          const candleRange = high - low;
          const lowerShadow = Math.min(open, close) - low;
          const upperShadow = high - Math.max(open, close);

          let values = Array(56).fill(NaN);

          if (candleRange <= 0.0001) return values;

          // Doji
          if (body <= candleRange * 0.1) {
            values[0] = high + candleRange * 0.12;
          }

          // Hammer
          if (
            body <= candleRange * 0.3 &&
            lowerShadow >= body * 2 &&
            upperShadow <= body * 0.5
          ) {
            values[1] = low - candleRange * 0.12;
          }

          // Hanging Man
          if (
            body <= candleRange * 0.3 &&
            lowerShadow >= body * 2 &&
            upperShadow <= body * 0.5
          ) {
            values[2] = high + candleRange * 0.12;
          }

          // Inverted Hammer
          if (
            body <= candleRange * 0.3 &&
            upperShadow >= body * 2 &&
            lowerShadow <= body * 0.5
          ) {
            values[3] = low - candleRange * 0.12;
          }

          // Shooting Star
          if (
            body <= candleRange * 0.3 &&
            upperShadow >= body * 2 &&
            lowerShadow <= body * 0.5
          ) {
            values[4] = high + candleRange * 0.12;
          }

          // Spinning Top
          if (
            body <= candleRange * 0.25 &&
            Math.abs(upperShadow - lowerShadow) <= candleRange * 0.1
          ) {
            values[5] = low - candleRange * 0.12;
          }

          // Bullish Engulfing
          if (
            prevClose < prevOpen &&
            close > open &&
            open < prevClose &&
            close > prevOpen
          ) {
            values[6] = low - candleRange * 0.12;
          }

          // Bearish Engulfing
          if (
            prevClose > prevOpen &&
            close < open &&
            open > prevClose &&
            close < prevOpen
          ) {
            values[7] = high + candleRange * 0.12;
          }

          // Tweezer Tops
          if (high === prevHigh && close < open && prevClose < prevOpen) {
            values[8] = high + candleRange * 0.12;
          }

          // Tweezer Bottoms
          if (low === prevLow && close > open && prevClose > prevOpen) {
            values[9] = low - candleRange * 0.12;
          }

          // Bullish Harami
          if (
            prevClose < prevOpen &&
            close > open &&
            open > prevClose &&
            close < prevOpen
          ) {
            values[10] = low - candleRange * 0.12;
          }

          // Bearish Harami
          if (
            prevClose > prevOpen &&
            close < open &&
            open < prevClose &&
            close > prevOpen
          ) {
            values[11] = high + candleRange * 0.12;
          }

          // Morning Star
          if (
            prevClose < prevOpen &&
            Math.abs(prevOpen - prevClose) > candleRange * 0.4 &&
            body < candleRange * 0.3 &&
            close > (prevOpen + prevClose) / 2
          ) {
            values[12] = low - candleRange * 0.12;
          }

          // Evening Star
          if (
            prevClose > prevOpen &&
            Math.abs(prevOpen - prevClose) > candleRange * 0.4 &&
            body < candleRange * 0.3 &&
            close < (prevOpen + prevClose) / 2
          ) {
            values[13] = high + candleRange * 0.12;
          }

          // Three White Soldiers
          if (
            prevClose > prevOpen &&
            close > open &&
            prevClose > prevOpen &&
            open > prevClose
          ) {
            values[14] = low - candleRange * 0.12;
          }

          // Three Black Crows
          if (
            prevClose < prevOpen &&
            close < open &&
            prevClose < prevOpen &&
            open < prevClose
          ) {
            values[15] = high + candleRange * 0.12;
          }

          // Rising Three Methods
          if (prevClose < prevOpen && open < close && close > prevOpen) {
            values[16] = low - candleRange * 0.12;
          }

          // Falling Three Methods
          if (prevClose > prevOpen && open > close && close < prevOpen) {
            values[17] = high + candleRange * 0.12;
          }
          //PiercingLine
          if (
            prevClose < prevOpen &&
            open < prevLow &&
            close > (prevOpen + prevClose) / 2
          ) {
            values[18] = low - candleRange * 0.12;
          }
          //20.Bullish Abandoned Baby
          if (
            prevClose < prevOpen &&
            open < prevLow &&
            close > prevHigh &&
            body < candleRange * 0.3
          ) {
            values[19] = low - candleRange * 0.12;
          }
          //21.Three Inside Up
          if (
            prevClose < prevOpen &&
            prevOpen - prevClose > candleRange * 0.4 &&
            close > open &&
            close > prevOpen
          ) {
            values[20] = low - candleRange * 0.12;
          }
          //22.Mat Hold Bullish
          if (prevClose < prevOpen && open < prevLow && close > prevHigh) {
            values[21] = low - candleRange * 0.12;
          }
          //23.Counterattack Line Bullish
          if (prevClose < prevOpen && open < prevLow && close === prevOpen) {
            values[22] = low - candleRange * 0.12;
          }
          //24.Belt Hold Bullish
          if (
            body >= candleRange * 0.6 &&
            close > open &&
            lowerShadow <= body * 0.1
          ) {
            values[23] = low - candleRange * 0.12;
          }
          //25. Separating Lines Bullish
          if (prevClose < prevOpen && close > open && open === prevOpen) {
            values[24] = low - candleRange * 0.12;
          }
          // 26.Thrusting Pattern
          if (
            prevClose < prevOpen &&
            close > open &&
            close < (prevOpen + prevClose) / 2
          ) {
            values[25] = low - candleRange * 0.12;
          }
          //27.Hammer Cross (DojiHammer)
          if (body <= candleRange * 0.1 && lowerShadow >= body * 2) {
            values[26] = low - candleRange * 0.12;
          }
          // 28.Inverted Hammer Cross (DojiStar)
          if (body <= candleRange * 0.1 && upperShadow >= body * 2) {
            values[27] = low - candleRange * 0.12;
          }
          //29. Dark Cloud Cover
          if (
            prevClose > prevOpen &&
            open > prevHigh &&
            close < (prevOpen + prevClose) / 2
          ) {
            values[28] = high + candleRange * 0.12;
          }
          //30 Bearish Abandoned Baby
          if (
            prevClose > prevOpen &&
            open > prevHigh &&
            close < prevLow &&
            body < candleRange * 0.3
          ) {
            values[29] = high + candleRange * 0.12;
          }
          //31 Three Inside Down
          if (
            prevClose > prevOpen &&
            prevClose - prevOpen > candleRange * 0.4 &&
            close < open &&
            close < prevOpen
          ) {
            values[30] = high + candleRange * 0.12;
          }
          //32.Mat Hold Bearish
          if (prevClose > prevOpen && open > prevHigh && close < prevLow) {
            values[31] = high + candleRange * 0.12;
          }
          //33.Counterattack Line Bearish
          if (prevClose > prevOpen && open > prevHigh && close === prevOpen) {
            values[32] = high + candleRange * 0.12;
          }
          //34.Belt Hold Bearish
          if (
            body >= candleRange * 0.6 &&
            close < open &&
            upperShadow <= body * 0.1
          ) {
            values[33] = high + candleRange * 0.12;
          }
          //35.Separating Lines Bearish
          if (prevClose > prevOpen && close < open && open === prevOpen) {
            values[34] = high + candleRange * 0.12;
          }
          // 36.Bearish Kicker
          if (prevClose > prevOpen && open > prevHigh && close < open) {
            values[35] = high + candleRange * 0.12;
          }
          //37.Abandoned Baby Cross (Bearish)
          if (
            prevClose > prevOpen &&
            body <= candleRange * 0.1 &&
            close < prevOpen
          ) {
            values[36] = high + candleRange * 0.12;
          }
          //38.Three Stars In The North
          if (
            body <= candleRange * 0.25 &&
            close < open &&
            prevClose > prevOpen
          ) {
            values[37] = high + candleRange * 0.12;
          }
          //39.Doji Star
          if (body <= candleRange * 0.1) {
            values[38] = high + candleRange * 0.12;
          }
          //40.Long-Legged Doji
          if (
            body <= candleRange * 0.1 &&
            upperShadow >= candleRange * 0.4 &&
            lowerShadow >= candleRange * 0.4
          ) {
            values[39] = high + candleRange * 0.12;
          }
          //41.Marubozu
          if (
            upperShadow <= candleRange * 0.05 &&
            lowerShadow <= candleRange * 0.05
          ) {
            values[40] =
              close > open
                ? low - candleRange * 0.12
                : high + candleRange * 0.12;
          }
          //42.High Wave Candle
          if (
            body <= candleRange * 0.25 &&
            upperShadow >= candleRange * 0.3 &&
            lowerShadow >= candleRange * 0.3
          ) {
            values[41] = high + candleRange * 0.12;
          }
          //43.Unique Three River Bottom
          if (
            body <= candleRange * 0.25 &&
            prevClose < prevOpen &&
            close > open
          ) {
            values[42] = low - candleRange * 0.12;
          }
          //44.Deliberation Pattern
          if (
            body <= candleRange * 0.3 &&
            upperShadow >= body * 2 &&
            lowerShadow >= body * 2
          ) {
            values[43] = high + candleRange * 0.12;
          }
          // 45.Dragonfly Doji (Bullish)
          if (
            body <= candleRange * 0.1 &&
            upperShadow <= candleRange * 0.1 &&
            lowerShadow >= candleRange * 0.6
          ) {
            values[44] = low - candleRange * 0.12;
          }
          // 46.Three Outside Up (Bullish Reversal)
          if (
            prev2Close < prev2Open &&
            prevClose > prevOpen &&
            prevClose > prev2Open &&
            prevOpen < prev2Close &&
            close > prevClose
          ) {
            values[45] = low - candleRange * 0.12;
          }
          //47.Concealing Baby Swallow Pattern bullish

          if (
            prev3Close < prev3Open &&
            prev3High === prev3Open &&
            prev2Close < prev2Open &&
            prev2High === prev2Open &&
            prevClose < prevOpen &&
            prevOpen < prev2Close &&
            close < open &&
            close < prevClose &&
            open > prevOpen
          ) {
            values[46] = low - candleRange * 0.12; // plot below bar (bullish)
          }
          //48.Three-Line Strike Pattern (Bullish)
          if (
            prev3Close > prev3Open && // bullish
            prev2Close > prev2Open && // bullish
            prevClose > prevOpen && // bullish
            close < open && // current is bearish
            close < prev3Open && // engulfs all three
            open > prevClose
          ) {
            values[47] = low - candleRange * 0.12; // plot below bar (bullish continuation)
          }
          //49.Ladder Bottom
          if (
            prev4Close < prev4Open &&
            prev3Close < prev3Open &&
            prev3Close < prev4Close &&
            prev2Close < prev2Open &&
            prev2Close < prev3Close &&
            prevClose < prevOpen &&
            close > open &&
            close > prevClose &&
            close > prev2Close
          ) {
            values[48] = low - candleRange * 0.12; // Plot below bar (bullish)
          }
          //50.Bullish Meeting Lines
          if (
            prevClose < prevOpen && // First candle bearish
            close > open && // Current candle bullish
            Math.abs(close - prevClose) <= candleRange * 0.1 // closes nearly equal
          ) {
            values[49] = low - candleRange * 0.12; // Plot below bar (bullish)
          }
          //51.Bearish Meeting Lines
          if (
            prevClose > prevOpen && // First candle bullish
            close < open && // Current candle bearish
            Math.abs(close - prevClose) <= candleRange * 0.1 // closes nearly equal
          ) {
            values[50] = high + candleRange * 0.12; // Plot above bar (bearish)
          }
          //52.Bearish Three-Line Strike Pattern

          if (
            prev3Close < prev3Open &&
            prev2Close < prev2Open &&
            prevClose < prevOpen &&
            close > open &&
            close > Math.max(prev3Open, prev2Open, prevOpen) &&
            open < Math.min(prev3Close, prev2Close, prevClose)
          ) {
            values[51] = high + candleRange * 0.12; // Plot above bar (bearish continuation)
          }
          // 53.Upside Gap Two Crows Pattern
          if (
            prev2Close > prev2Open &&
            prevClose < prevOpen &&
            prevOpen > prev2Close &&
            close < open &&
            open > prevOpen &&
            close < prevClose &&
            close > prev2Close
          ) {
            values[52] = high + candleRange * 0.12;
          }
          //54.Bearish Doji Star Pattern
          if (
            prev2Close > prev2Open &&
            prev2Body > (prev2High - prev2Low) * 0.5 &&
            prevBody <= (prevHigh - prevLow) * 0.1 &&
            prevOpen > prev2Close &&
            close < open &&
            close < prev2Close
          ) {
            values[53] = high + candleRange * 0.12;
          }
          //55.Bearish Three Outside Down
          if (
            prev2Close > prev2Open &&
            prevClose < prevOpen &&
            prevOpen > prev2Close &&
            prevClose < prev2Open &&
            close < open &&
            close < prevClose
          ) {
            values[54] = high + candleRange * 0.12;
          }
          //56.Bearish Kicker
          if (
            prevClose < prevOpen &&
            close > open &&
            open >= Math.max(prevOpen, prevClose)
          ) {
            values[55] = low - candleRange * 0.12;
          }
          return values;
        };
      },
    },
  ]);
};
