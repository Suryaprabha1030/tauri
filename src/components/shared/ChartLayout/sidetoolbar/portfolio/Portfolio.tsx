import { useState } from "react";
import PortfolioHeader from "./PortfolioHeader";
import Positions from "../positions/positions";
import Holdings from "../holdings/holdings";

const Portfolio = ({ brokerCode, leftWidth, setLeftWidth }:any) => {
  const [activePortFolio, setActivePortFolio] = useState("holdings");
  return (
    <div className=" h-full w-full bg-white">
      <PortfolioHeader
        activePortFolio={activePortFolio}
        setActivePortFolio={setActivePortFolio}
      />
      {activePortFolio == "positions" ? (
        <div className=" h-[90%] w-full bg-white">
          <Positions
            brokerCode={brokerCode}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
          />
        </div>
      ) : (
        <Holdings
          brokerCode={brokerCode}
          leftWidth={leftWidth}
          setLeftWidth={setLeftWidth}
        />
      )}
    </div>
  );
};

export default Portfolio;
