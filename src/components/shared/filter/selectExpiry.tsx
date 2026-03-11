"use client";
import zApi from "@/lib/api/zApi";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContextProvider";
import { OptionsSimulatorHistoricalApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import config from "@/lib/config";
const SelectExpiry = (props: {
  index: string;
  date: string;
  time: string;
  expiry: string;
  disabled?: boolean;
  updateExpiry: (input: string) => void;
  toggleButton: (value: boolean) => void;
}) => {
  const { index, date, time } = props;
  const [expiryList, setExpirtyList] = useState<string[]>([props.expiry]);
  const myApiClient = new zApi(useRouter(), useContext(AuthContext));
  const expiryApi = new OptionsSimulatorHistoricalApi(baseConfig());

  useEffect(() => {
    // do not populate expiry list if index is not selected
    if (!index || !date || !time) return;

    props.toggleButton(true);
    myApiClient.request(
      () =>
        expiryApi.getExpiriesListV1SimulatorExpiriesListGet(
          `${date}T${time}`,
          index
        ),
      (res) => {
        setExpirtyList(res.data);
        // set default expiry
        props.updateExpiry(res.data[0]);
        props.toggleButton(false);
      },
      () => {}
    );
  }, [index, date]);

  const updateExpiry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.updateExpiry(event.target.value);
  };

  return (
    expiryList && (
      <div>
        <div className="text-green flex justify-end">
          <select
            className="focus:border-tertiary rounded-lg border border-gray-300 lg:p-2 py-2 outline-none h-10 max-sm:h-8 max-sm:w-[3.6rem] max-sm:mr-[0.1rem] sm:w-[6.5rem] lg:w-[6rem] xl:w-[7.2rem]"
            onChange={updateExpiry}
            disabled={props.disabled || false}
          >
            {expiryList.map((c, idx) => (
              <option className="lg:p-3 lg:py-0 py-3 text-cyan-400" key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  );
};

export default SelectExpiry;
