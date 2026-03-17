import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import ImageBox from "../sharedContent/ImageBox";
import FundsHeaders from "./FundsHeaders";
import FundsTable from "./FundsTable";

interface FundsDetailPageProps {
  brokerCode: number | null;

  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const FundsDetailPage: React.FC<FundsDetailPageProps> = ({
  brokerCode,

  leftWidth,
  setLeftWidth,
}) => {
  const [fundsData, setfundsData] = useState<any>({});
  const FundsDataRedux = useSelector(
    (state: RootState) => state.strategy.fundsData,
  );

  useEffect(() => {
    setfundsData(FundsDataRedux);
  }, [FundsDataRedux]);

  return (
    <>
      <FundsHeaders
        fundsData={fundsData}
        brokerCode={brokerCode}
        leftWidth={leftWidth}
        setLeftWidth={setLeftWidth}
      />
      {fundsData && Object.keys(fundsData).length > 0 ? (
        <FundsTable fundsData={fundsData} />
      ) : (
        <ImageBox
          imagePath="/svg/fundsdata.svg"
          display="No Funds Available"
          width={200}
          height={200}
          autoWidth="w-[12rem] h-[12rem]"
        />
      )}
    </>
  );
};

export default FundsDetailPage;
