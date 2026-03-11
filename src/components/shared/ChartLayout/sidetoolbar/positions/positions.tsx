import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PositionHistoryDisplay from "../../PositionSharing/PositionHistoryDisplay";
import PositionsHeader from "./PositionsHeader";
import HistoryPositionsCard from "./HistoryPositionsCard";
import PositionsTableHeader from "./PositionsTableHeader";
import PositionTable from "./PositionTable";
import PositionExitAll from "./PositionExitAll";
import ImageBox from "../sharedContent/ImageBox";
import { fetchDataForCalenderView } from "@/lib/util/sideToolBar/positions/fetchPositionHistory";
import {
  initializePositionsData,
  updatePositionsWithPnL,
} from "@/lib/util/sideToolBar/positions/managePositionsData";

import { useRouter } from "next/navigation";
import ShareableImageCard from "./TwitterSharableImage";

interface PositionsProps {
  brokerCode: number | null;
  apiKey: string | null;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}
interface Position {
  checked: boolean;
  product: string;
  ltp: number;
  symbol: string;
  display_symbol_name: string;
  quantity: number;
  net_price: any;
  pnl: any;
  lots: any;
  transaction_type: string;
  exchange: string;
  identifier: string;
  // add other properties as needed
}

const Positions: React.FC<PositionsProps> = ({
  brokerCode,
  apiKey,
  leftWidth,
  setLeftWidth,
}) => {
  const [positionsData, setPositionsData] = useState<Position[]>([]);
  // Assuming the API returns an array of holdings
  const [anyChecked, setAnyChecked] = useState(false);
  const [checkedData, setcheckedData] = useState<Position[]>([]);
  const [buttonId, setButtonId] = useState("");
  const [smartApi, setSmartApi] = useState(false);
  const [HistoryClicked, setHistoryClicked] = useState<boolean>(false);
  const [calenderData, setCalenderData] = useState<any>();
  const [hasFetchedCalenderData, setHasFetchedCalenderData] = useState(false);
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const currentBrokerName = useSelector(
    (state: RootState) => state.Position.BrokerName,
  );
  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const [showAvgprice, setshowAvgprice] = useState(false);
  const [symbolsPerPage, setSymbolsPerpage] = useState(2);
  const [symbols, setsymbols] = useState<any[]>([]);
  const [totalPnL, setTotalPnL] = useState(0); // Local state for total PnL
  const [totalPnLPercentage, setTotalPnLPercentage] = useState(0); // Local state for total PnL percentage
  const [showModal, setShowModal] = useState(false);

  const positionPnl = useSelector(
    (state: RootState) => state.strategy.positionPnl,
  );
  const positionpnlpercent = useSelector(
    (state: RootState) => state.strategy.positionpnlpercent,
  );
  const userDetails = useSelector(
    (state: RootState) => state.strategy.settingsData,
  );
  const ImageTotalPositionsPnl = useSelector(
    (state: RootState) => state.Position.TotalPositionsPnl,
  );
  const router = useRouter();

  // Trigger API call when the history button is clicked
  const handleHistoryClick = () => {
    setHistoryClicked(true); // Show the history display
    if (!hasFetchedCalenderData) {
      fetchDataForCalenderView(
        brokerCode,
        setCalenderData,
        setHasFetchedCalenderData,
        router,
      );
    }
  };

  useEffect(() => {
    if (leftWidth >= 80) {
      setSymbolsPerpage(4);
    } else setSymbolsPerpage(2);
  }, [leftWidth]);

  useEffect(() => {
    if (positionsdata && positionsdata.length > 0) {
      const { initialData, symbolsArray, hasNetPrice } =
        initializePositionsData(positionsdata);
      setPositionsData(initialData);
      setcheckedData(initialData);
      setAnyChecked(false);
      setSelectAll(false);
      const uniqueSymbolsArray = Array.from(new Set(symbolsArray)); //remove duplicates
      setsymbols(uniqueSymbolsArray);
      //for passing symbol,identifier keypair value to multisymbols
      setshowAvgprice(hasNetPrice);
    }
  }, [positionsdata]);

  useEffect(() => {
    if (smartApi == true) {
      setSmartApi(false);
    }
  }, [smartApi]);

  const handleBack = () => {
    setTimeout(() => {
      setHistoryClicked(false);
    }, 300);
  };

  useEffect(() => {
    // Initialize total PnL and percentage from Redux on mount
    setTotalPnL(positionPnl);
    setTotalPnLPercentage(positionpnlpercent);
  }, [positionPnl, positionpnlpercent]);

  useEffect(() => {
    if (!positionsdata || !webSocketDataRead) return;
    const allPositionsExited = positionsdata.every(
      (position: any) =>
        position.quantity === 0 && position.transaction_type === "EXITED",
    );

    if (allPositionsExited) return;
    const { updatedPositions, updatedTotalPnl } = updatePositionsWithPnL(
      positionsdata,
      webSocketDataRead,
      currentBrokerName,
    );
    setPositionsData(updatedPositions);
    setTotalPnL(updatedTotalPnl);
  }, [webSocketDataRead, positionsdata]);

  return (
    <div className="wrapper h-full w-full bg-white">
      <PositionsHeader
        HistoryClicked={HistoryClicked}
        handleBack={handleBack}
        handleHistoryClick={handleHistoryClick}
        brokerCode={brokerCode}
        leftWidth={leftWidth}
        setLeftWidth={setLeftWidth}
        setShowModal={setShowModal}
        setHasFetchedCalenderData={setHasFetchedCalenderData}
      />
      {showModal == true &&
        userDetails &&
        Object.entries(userDetails)?.length != 0 &&
        userDetails?.user_full_name != undefined && (
          <ShareableImageCard
            totalPnl={ImageTotalPositionsPnl}
            userName={userDetails?.user_full_name}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      {!HistoryClicked && positionsdata && positionsdata.length > 0 ? (
        <>
          <HistoryPositionsCard positionPnl={totalPnL} />

          <div className=" max-h-[70%] w-full overflow-x-hidden max-xl:scrollbar-none max-sm:max-h-[68%] max-sm:overflow-y-auto md:max-xl:max-h-[66%] xl:overflow-y-auto xl:scrollbar-thin">
            <table className="mx-1 w-full table-fixed divide-y divide-gray-200">
              <PositionsTableHeader
                positionsData={positionsData}
                selectAll={selectAll}
                showAvgprice={showAvgprice}
                leftWidth={leftWidth}
                setPositionsData={setPositionsData}
                setcheckedData={setcheckedData}
                setAnyChecked={setAnyChecked}
                setSelectAll={setSelectAll}
              />

              <PositionTable
                positionsData={positionsData}
                leftWidth={leftWidth}
                showAvgprice={showAvgprice}
                setPositionsData={setPositionsData}
                setcheckedData={setcheckedData}
                setAnyChecked={setAnyChecked}
                setSelectAll={setSelectAll}
              />
            </table>
          </div>
          <div className=" h-7 max-md:my-[0.4rem] xl:max-2xl:my-[0.9rem] ">
            {anyChecked && (
              <PositionExitAll
                setSmartApi={setSmartApi}
                setButtonId={setButtonId}
                checkedData={checkedData}
              />
            )}
          </div>
        </>
      ) : HistoryClicked ? (
        <div className=" h-[80%] w-full  ">
          <PositionHistoryDisplay
            leftWidth={leftWidth}
            calenderData={calenderData}
          />
        </div>
      ) : (
        ((positionsdata && positionsdata.length === 0) ||
          positionsdata === null) &&
        !HistoryClicked && (
          <imgBox
            imagePath="/svg/positions.svg"
            display="No Positions Available"
            width={200}
            height={200}
            autoWidth="w-[12rem] h-[12rem]"
          />
        )
      )}
    </div>
  );
};

export default Positions;
