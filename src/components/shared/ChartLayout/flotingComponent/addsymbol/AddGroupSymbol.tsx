import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { getGrpSymbols } from "@/lib/redux/slices/GroupSlice";
import { RootState } from "@/lib/redux/Store";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddGroupSymbol = ({
  setGrpSymbols,
  selected,
  setSelected,
  setSearchSymbol,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const grpSymbols = useSelector((state: RootState) => state.Groups.grpSymbols);
  const [options, setOptions] = useState<any>(grpSymbols);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (Object.entries(grpSymbols).length == 0) {
          const CreateGroupsApi = new UserWatchlistRouterApi(baseConfig());
          const res = await CreateGroupsApi.fetchGroupsV1UsersMeGroupsGet();
          const resultData = res.data.reduce((acc: any, d: any) => {
            if (d?.name) {
              acc[d.name] = d.symbols || [];
            }
            return acc;
          }, {});

          const result = {
            "No Group": [],
            ...resultData,
          };
          dispatch(getGrpSymbols(result));
          setOptions(result);
        }
      } catch (error: any) {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="relative w-[12rem] max-sm:w-[9.2rem] ">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded rounded-lg border border-z-green-500 bg-white px-3 py-1 text-[0.75rem] text-black max-sm:text-[0.6rem]"
      >
        {selected}
        <img
          src="/svg/arrowFall.svg"
          width="25"
          height="25"
          alt="plus"
          //   onClick={showWatchlist}
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
          className="h-[1.35rem] w-[1.3rem] p-0"
        />
      </button>

      {open && (
        <ul className="absolute z-[20] mt-2 h-[7rem] w-full overflow-y-auto rounded-lg bg-white text-[0.75rem] text-black shadow-lg scrollbar-none max-sm:text-[0.6rem]">
          {Object.entries(options).map(([key, value]) => (
            <li
              key={key}
              onClick={() => {
                setGrpSymbols(value);
                setSelected(key);
                setOpen(false);
                if (key === "No Group") {
                  console.log("surya");
                  setSearchSymbol("Nifty");
                } else {
                  setSearchSymbol("");
                }
              }}
              className={`cursor-pointer ${key == selected ? "bg-blue-500 text-white" : "text-black hover:bg-gray-200"} px-4 py-2 max-sm:text-[0.6rem] `}
            >
              {key}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddGroupSymbol;
