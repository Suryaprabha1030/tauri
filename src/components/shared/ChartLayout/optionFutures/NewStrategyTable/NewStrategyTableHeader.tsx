import React from "react";

interface NewStrategyTableHeaderProps {
  isAllCheckedRows: any;
  setAllChecked: React.Dispatch<React.SetStateAction<any>>;
  allChecked: any;
  setCheckedRows: React.Dispatch<React.SetStateAction<any>>;
  copiedData: any;
  setIsAllCheckedRows: React.Dispatch<React.SetStateAction<any>>;
}

const NewStrategyTableHeader: React.FC<NewStrategyTableHeaderProps> = ({
  isAllCheckedRows,
  setAllChecked,
  allChecked,
  setCheckedRows,
  copiedData,
  setIsAllCheckedRows,
}) => {
  // header check box event
  const handleHeaderCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setAllChecked(!allChecked);
    setCheckedRows(
      Object.keys(copiedData).reduce((acc: any, key) => {
        acc[key] = isChecked;
        return acc;
      }, {})
    );
    setIsAllCheckedRows(isChecked);
  };
  return (
    <thead className="sticky -top-1 z-[11] bg-gray-50 text-[0.68rem] uppercase max-sm:text-[0.58rem]">
      <tr className="h-7 border-b text-[0.68rem] text-z-gray-300 max-sm:text-[0.58rem]">
        <th>
          <input
            type="checkbox"
            checked={isAllCheckedRows}
            onChange={handleHeaderCheckboxChange}
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
            className="form-checkbox cursor-pointer rounded border-gray-50 font-tableHead text-blue-600 max-md:h-[0.7rem] max-md:w-2.5 md:h-3 md:w-3"
          />
        </th>
        <th
          scope="col"
          className="py-[0.1rem] font-tableHead max-md:px-0.5 md:px-1"
        >
          Expiry
        </th>
        <th
          scope="col"
          className="py-[0.1rem] font-tableHead max-sm:hidden md:px-1"
        >
          IV
        </th>
        <th scope="col" className="py-[0.1rem] font-tableHead md:px-1">
          Strike Price
        </th>

        <th
          scope="col"
          className="py-[0.1rem] font-tableHead max-md:px-0.5 md:px-1"
        >
          Lots
        </th>
        <th
          scope="col"
          className="py-[0.1rem] font-tableHead max-md:px-0.5 md:px-1"
        >
          LTP
        </th>
        <th
          scope="col"
          className="py-[0.1rem] font-tableHead max-md:px-0.5 md:px-1"
        >
          B/S
        </th>
        <th></th>
      </tr>
    </thead>
  );
};

export default NewStrategyTableHeader;
