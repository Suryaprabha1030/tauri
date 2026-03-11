import { getFutureData, getOptionData } from "@/lib/redux/slices/AnalyzerSlice";
import React, { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";

interface ChangeCheckDataProps {
  checkedRows: { [key: string]: any };
  keyData: any;
  setChecked: Dispatch<SetStateAction<any>>;
  setCheckedRows: Dispatch<SetStateAction<any>>;
  checked: boolean;
}

const ChangeCheckData: React.FC<ChangeCheckDataProps> = ({
  checkedRows,
  keyData,
  setChecked,
  setCheckedRows,
  checked,
}) => {
  const dispatch = useDispatch();
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const isChecked = event.target.checked;
    setChecked(!checked);
    setCheckedRows((prev: any) => ({
      ...prev,
      [key]: isChecked,
    }));

    if (Object.keys(checkedRows).length === 0) {
      dispatch(getOptionData({ optionData: {} }));
      dispatch(getFutureData({ futureData: {} }));
    }
  };

  return (
    <input
      type="checkbox"
      checked={checkedRows[keyData] || false}
      onChange={(event) => handleChange(event, keyData)}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
      className="form-checkbox cursor-pointer rounded border-gray-50 text-blue-600 max-md:h-2.5 max-md:w-2.5 md:h-3 md:w-3"
    />
  );
};

export default ChangeCheckData;
