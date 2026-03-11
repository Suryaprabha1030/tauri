// DateRangeInputs.tsx
import React from 'react';

interface DateRangeInputsProps {
  fromDate: string;
  toDate: string;
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
}

const DateRangeInputs: React.FC<DateRangeInputsProps> = ({ fromDate, toDate, setFromDate, setToDate }) => {
  return (
    <div className="flex space-x-4 text-[0.75rem]  w-full justify-center items-center gap-5">
      {/* From Date */}
      <div className="w-1/3">
        <label className="block mb-1 text-gray-600 font-semibold">From</label>
        <div className="flex items-center border rounded-md px-2 py-2">
          {/* <span className="mr-2 text-gray-500">📅</span> */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border-none outline-none text-gray-700"
          />
        </div>
       
      </div>

      {/* To Date */}
      <div className="w-1/3">
        <label className="block mb-1 text-gray-600 font-semibold">To</label>
        <div className="flex items-center border rounded-md px-2 py-2">
          {/* <span className="mr-2 text-gray-500">📅</span> */}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border-none outline-none text-gray-700"
          />
        </div>
        
      </div>
    </div>
  );
};

export default DateRangeInputs;
