import TradingViewChart from "./TradingViewChart";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { setShowTVpopup } from "@/lib/redux/slices/CommonSlice";
import {
  setChartIconClicked,
  setTvAddSymbPopup,
} from "@/lib/redux/slices/ChartsSlice";
import { tvWidgetId } from "@/lib/util/toggleButtonName/toggleButtonNames";
const TradingViewPopup = ({
  brokerCode,
  userId,
}: {
  brokerCode: any;
  userId: any;
}) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.common.showTVpopup);

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex h-full items-center justify-center overflow-visible bg-black bg-opacity-50">
          <div className="relative h-[600px] w-[900px] rounded-lg bg-white p-1 pt-5 shadow-lg max-sm:m-5 sm:max-xl:m-5">
            {/* Close button */}
            <button
              onClick={() => {
                dispatch(setShowTVpopup(false));
                dispatch(setChartIconClicked(false));
                dispatch(setTvAddSymbPopup(false));
              }}
              className="absolute right-2 top-2 rounded  pb-2 "
            >
              <img src="/svg/removeSymbol.svg" width={15} height={15} alt="" />
            </button>

            {/* TradingViewChart inside modal */}
            <TradingViewChart
              brokerCode={brokerCode}
              userId={userId}
              chartId={tvWidgetId.POPUPCHART}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TradingViewPopup;
