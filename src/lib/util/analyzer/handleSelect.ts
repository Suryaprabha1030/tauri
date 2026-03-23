import { setSymbolIdentifier } from "@/lib/redux/slices/ChartsSlice";
import { setShowTVpopup } from "@/lib/redux/slices/CommonSlice";
import {
  getCalcData,
} from "@/lib/redux/slices/OptionChainSlice";
import { setOiChartCall } from "@/lib/redux/slices/PayoffChartSlice";
import { getStraddleChartData } from "@/lib/redux/slices/StrategyChartSlice";
import { ChartToggleButtonType } from "../oi/oiUtil";
import config from "@/lib/config";

export const handleSelect =
  (
    hashkey: string,
    element: any,
    transactionType: string,
    buttonType: string,
    dispatch: any,
    optionDatas: any,
    showStrategyTable: any,
    showPositionTable: any,
    showPnlTable: any,
    getOptionData: any,
    toast: any,
    setSelectedStrategy: any,
    showDraftPositions: any,
    futureDatas: any,
    positionDatas: any,

    selectedStrategy: any,
    setActive: any,
    active: any
  ) =>
  () => {
    if (
      Object.entries(optionDatas).length == 0 &&
      Object.entries(futureDatas).length == 0 &&
      Object.entries(positionDatas).length == 0 &&
      selectedStrategy == null
    ) {
      dispatch(getCalcData([]));
      dispatch(getStraddleChartData({}));
    }
    dispatch(showStrategyTable(true));
    dispatch(showPositionTable(false));
    dispatch(showPnlTable(false));

    // dispatch(setSelectedStrategy({ setselectedStrategy: null }));
    if (active == ChartToggleButtonType.PayoffTable) {
      setActive(ChartToggleButtonType.Chart);
    }
    if (Object.keys(optionDatas)?.length == 0) {
      dispatch(setOiChartCall(true));
    }

    if (Object.keys(optionDatas)?.length >= 10) {
      if (
        optionDatas[hashkey] &&
        optionDatas[hashkey].transaction_type === transactionType
      ) {
        const BuySellData: any = { ...optionDatas };
        delete BuySellData[hashkey];
        dispatch(getOptionData({ optionData: { ...BuySellData } }));
      } else if (
        optionDatas[hashkey] &&
        element.transaction_type !== transactionType
      ) {
        const BuySellData: any = { ...optionDatas };
        const addData = { ...element };
        addData.transaction_type = transactionType;
        addData.button_type = buttonType;
        addData.target_ltp = element.ltp;

        if (
          (element.is_selected &&
            element.transaction_type !== transactionType) ||
          !element.is_selected
        ) {
          addData.lots = 1;
          addData.ivValue = config.defaultIvValue;
        }

        // Remove the entry if a different type was selected previously
        delete BuySellData[hashkey];

        BuySellData[hashkey] = addData;

        dispatch(getOptionData({ optionData: { ...BuySellData } }));
      } else {
        toast.dismiss(); // Clear any existing toasts
        toast("Maximum limit reached!.you have checked 10 strike prices");
      }

      return;
    }

    const BuySellData: any = { ...optionDatas };
    const addData = { ...element };
    addData.transaction_type = transactionType;
    addData.button_type = buttonType;
    addData.target_ltp = element.ltp;

    dispatch(showDraftPositions(false));
    dispatch(showStrategyTable(true));
    dispatch(showPositionTable(false));
    dispatch(showPnlTable(false));

    setTimeout(() => {
      dispatch(setSelectedStrategy({ setselectedStrategy: null }));
    }, 200);

    if (
      (element.is_selected && element.transaction_type !== transactionType) ||
      !element.is_selected
    ) {
      addData.lots = 1;
      addData.ivValue = config.defaultIvValue;
    }

    if (optionDatas[hashkey]) {
      if (optionDatas[hashkey].transaction_type === transactionType) {
        delete BuySellData[hashkey];

        dispatch(getOptionData({ optionData: { ...BuySellData } }));
      } else {
        // Handle the case where the transaction type is different
        if (element.transaction_type !== transactionType) {
          delete BuySellData[hashkey];
        }

        BuySellData[hashkey] = addData;

        dispatch(getOptionData({ optionData: { ...BuySellData } }));
      }
    } else {
      BuySellData[hashkey] = addData;

      dispatch(getOptionData({ optionData: { ...BuySellData } }));
    }
  };

export const handlePopUp = (element: any, dispatch: any) => {
  const identifier = element?.identifier;
  dispatch(setSymbolIdentifier(identifier));
  dispatch(setShowTVpopup(true));
};
