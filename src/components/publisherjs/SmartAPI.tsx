import { useEffect, SetStateAction, Dispatch, useState } from "react";

interface Stock {
  exchange: string;
  tradingsymbol: string;
  quantity: number;
  transactiontype: string;
  ordertype: string;
  producttype: string;
}

interface SmartApiProps {
  apikey: string | null;
  buttonId: string;
  stocks: Stock[];
  brokerCode: any;
  setBuy?: Dispatch<SetStateAction<any>>;
  setSell?: Dispatch<SetStateAction<any>>;
}

const SmartApi: React.FC<SmartApiProps> = ({
  buttonId,
  apikey,
  stocks,
  brokerCode,
  setBuy,
  setSell,
}) => {
  useEffect(() => {
    if (setBuy) setBuy(false);
    if (setSell) setSell(false);

    // Remove any existing scripts to avoid duplication
    const existingScript = document.getElementById("smartapi-script");
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    // Determine the script based on brokerCode
    const script = document.createElement("script");
    script.id = "smartapi-script";

    if (brokerCode && brokerCode == 1) {
      script.src = "https://smartapi.angelbroking.com/common/v1.js";
    } else if (brokerCode && brokerCode === 2) {
      script.src = "https://kite.trade/publisher.js?v=3";
    }

    const mapStockForZerodha = (stock: Stock) => {
      return {
        exchange: stock.exchange,
        tradingsymbol: stock.tradingsymbol,
        quantity: stock.quantity,
        transaction_type: stock.transactiontype,
        order_type: stock.ordertype,
        product: stock.producttype,
      };
    };
    // script.onload = () => {

    if (brokerCode && brokerCode === 1) {
      script.onload = () => {
        (window as any).SmartApiConnect.ready(() => {
          const smartApi = new (window as any).SmartApiConnect(apikey);

          if (Array.isArray(stocks)) {
            stocks.forEach((stock) => {
              smartApi.add(stock);
            });
          } else {
            smartApi.add(stocks);
          }
          smartApi.link(`#${buttonId}`);

          smartApi.finished((status: any, access_token: any) => {
            console.log("AngelOne Status:", status);
            console.log("AngelOne Tokens:", access_token);
          });
        });
      };
    } else if (brokerCode && brokerCode === 2) {
      script.onload = () => {
        // Zerodha specific code
        (window as any).KiteConnect.ready(() => {
          const kite = new (window as any).KiteConnect(apikey);

          if (Array.isArray(stocks)) {
            const mappedStocks = stocks.map(mapStockForZerodha);
            mappedStocks.forEach((stock) => {
              kite.add(stock);
            });
          } else {
            const mappedStock = mapStockForZerodha(stocks);
            kite.add(mappedStock);
          }

          kite.link(`#${buttonId}`);

          kite.finished((status: any, access_token: any) => {
            console.log("Zerodha Status:", status);
            console.log("Zerodha Tokens:", access_token);
          });
        });
      };
    }

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [stocks, buttonId, setBuy, setSell, brokerCode, apikey]);

  return null;
};

export default SmartApi;
