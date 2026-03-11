import config from "@/lib/config";
import { setSymbolIdentifier } from "@/lib/redux/slices/ChartsSlice";
import { setShowTVpopup } from "@/lib/redux/slices/CommonSlice";
import {
  setActivePosHoldFilter,
  setInitiateTvChart,
} from "@/lib/redux/slices/PositionSlicer";
import { Dispatch } from "react";

const handleTVChart = (
  index: any,
  filter: any,
  path: any,
  router: any,
  dispatch: Dispatch<any>,
  brokerCode: any,
  identifier: any
) => {
  if (path != `${config.brokersListUrl}/${brokerCode}/psv`) {
    dispatch(setSymbolIdentifier(identifier));
    dispatch(setShowTVpopup(true));
  } else {
    dispatch(
      setInitiateTvChart({ row: index, filter: filter, identifier: identifier })
    );
    dispatch(setActivePosHoldFilter(false));
  }
};

const WidthAdjusterDoubleClick = (leftWidth: any, setLeftWidth: any) => {
  if (window.innerWidth >= 1200) {
    leftWidth === 40 ? setLeftWidth(80) : setLeftWidth(40);
  }
};

export { handleTVChart, WidthAdjusterDoubleClick };
