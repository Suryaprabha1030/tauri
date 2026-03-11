import { getFutureData, getOptionData } from "@/lib/redux/slices/AnalyzerSlice";
import { RootState } from "@/lib/redux/Store";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface DeleteButtonProps {
  setCopiedData: React.Dispatch<React.SetStateAction<any>>;
  keyData: any;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  setCopiedData,
  keyData,
}) => {
  const dispatch = useDispatch();
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList,
  );
  const futureDatas: any = useSelector(
    (state: RootState) => state.analyzer.futureDataList,
  );
  const handleDelete = (key: string) => {
    setCopiedData((prev: any) => {
      const updatedData: { [key: string]: any } = { ...prev };
      delete updatedData[key];
      return updatedData;
    });
    const removeKeyFromData = (
      prevData: { [key: string]: any },
      key: string,
    ) => {
      const updatedData: { [key: string]: any } = { ...prevData };
      delete updatedData[key];
      return updatedData;
    };
    dispatch(
      getOptionData({
        optionData: { ...removeKeyFromData(optionDatas, key) },
      }),
    );
    dispatch(
      getFutureData({
        futureData: { ...removeKeyFromData(futureDatas, key) },
      }),
    );
  };

  return (
    <img
      src={"/svg/removeSymbol.svg"}
      height={10}
      width={10}
      alt={""}
      onClick={() => handleDelete(keyData)}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
      className="max-md:h-[0.9rem] max-md:w-[0.9rem] md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem] xl:max-2xl:h-[1rem] xl:max-2xl:w-[1rem]"
    />
  );
};

export default DeleteButton;
