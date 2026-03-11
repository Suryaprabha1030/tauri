import { getTempInputValues } from "@/lib/redux/slices/OptionChainSlice";
import { RootState } from "@/lib/redux/Store";
import { validateNumericInput } from "@/lib/util/formatUtil";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
interface ChangeTargetPriceProps {
  option: any;
  setEntryPriceData: React.Dispatch<React.SetStateAction<any>>;
  copiedData: { [key: string]: any };
}

const ChangeTargetPrice: React.FC<ChangeTargetPriceProps> = ({
  option,
  setEntryPriceData,
  copiedData,
}) => {
  const dispatch = useDispatch();
  const tempInputValues = useSelector(
    (state: RootState) => state.optionChain.tempInputValues
  );
  const handleLtpChange = (identifier: string, newLtp: number | null) => {
    setEntryPriceData((prevData: any) => {
      const originalLtp =
        Object.values(copiedData).find(
          (item: any) => item.identifier === identifier
        )?.ltp ?? null;
      const updatedEntryPrice =
        newLtp !== null && !isNaN(newLtp) ? newLtp : originalLtp;

      const updatedData = {
        ...prevData,
        [identifier]: {
          ...prevData[identifier],
          entryPrice: updatedEntryPrice,
        },
      };

      return updatedData;
    });
  };

  const handleInputChange = (identifier: string, value: string) => {
    dispatch(
      getTempInputValues({
        ...tempInputValues,
        [identifier]: value,
      })
    );
  };

  const handleInputBlur = (identifier: string, originalLtp: any) => {
    const inputValue = tempInputValues[identifier];
    const newLtp = inputValue === "" ? null : parseFloat(inputValue);
    handleLtpChange(identifier, newLtp);
    dispatch(
      getTempInputValues({
        ...tempInputValues,
        [identifier]: inputValue === "" ? originalLtp : inputValue,
      })
    );
  };

  return (
    <input
      type="text"
      defaultValue={option.ltp}
      value={
        tempInputValues[option.identifier] != undefined
          ? tempInputValues[option.identifier]
          : option.ltp
      }
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
      onChange={(e) => {
        const value = e.target.value;
        if (validateNumericInput(value)) {
          handleInputChange(option.identifier, value);
        }
      }}
      onBlur={() => {
        handleInputBlur(option.identifier, option.ltp);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur(); // Trigger the blur event programmatically
        }
      }}
      className="w-[3rem] rounded-lg text-center hover:border hover:border-gray-300 max-sm:w-[2.5rem]  max-sm:px-0.5  max-sm:py-[0.1rem] xl:px-1 xl:py-[0.2rem]"
    />
  );
};

export default ChangeTargetPrice;
