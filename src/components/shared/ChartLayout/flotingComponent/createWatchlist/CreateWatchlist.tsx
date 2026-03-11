import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
interface CreateWatchlistProps {
  setShowCreateWatchlist: Dispatch<SetStateAction<boolean>>;
  setSelectedWatchlistId: Dispatch<SetStateAction<any>>;
}

const CreateWatchlist: React.FC<CreateWatchlistProps> = ({
  setShowCreateWatchlist,
  setSelectedWatchlistId,
}) => {
  const nameRef = useRef<any>(null);
  const router = useRouter();
  // hide this floating component
  const removeSymbol = () => {
    setShowCreateWatchlist(false);
  };

  const CreateWatchlist = async () => {
    if (nameRef.current) {
      try {
        const CreatewatchlistApi = new UserWatchlistRouterApi(baseConfig());
        const res =
          await CreatewatchlistApi.createWatchlistsV1UsersMeWatchlistsPost(
            nameRef.current.value,
          );
        setShowCreateWatchlist(false);
        setSelectedWatchlistId(res.data.id);
      } catch (err: any) {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    }
  };
  return (
    <div className="shadow-t-2xl relative h-[17rem] w-[35rem] overflow-y-auto rounded-lg bg-white shadow-2xl max-sm:w-[25rem] sm:max-md:w-[30rem] md:max-lg:h-[20rem] lg:max-xl:w-[44rem]">
      <div className="bg-shadow flex w-full flex-row items-center justify-between border-b-[0.05rem] border-z-br-gray p-2 px-4 max-md:py-[0.8rem] md:max-xl:py-[1rem]">
        <h1 className="text-[1.2rem] font-semibold">Create Watchlist </h1>
        <img
          src="/svg/removeSymbol.svg"
          className="relative h-[1.5rem] w-[1.5rem]"
          width="20"
          height="20"
          alt="plus"
          onClick={removeSymbol}
        />
      </div>
      <span className="bg-shadow flex h-[14rem] w-full flex-col items-center items-center justify-center gap-[2rem] p-2 px-4 max-md:h-[12rem] lg:max-xl:h-[12rem]">
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Add Watchlist Name"
          required
          maxLength={15}
          className="flex w-[28rem] items-center gap-3 rounded-md border border-neutral-200 px-5 py-2 max-sm:w-[20rem] sm:max-md:w-[24rem] lg:max-xl:w-[36rem]"
          ref={nameRef}
        />

        <button
          className="  leading w-[8rem] rounded-3xl border border-z-green-500  py-1 text-[1rem] font-medium text-z-green-500  hover:bg-z-green-500 hover:text-white "
          title="create"
          onClick={CreateWatchlist}
        >
          Create
        </button>
      </span>
    </div>
  );
};

export default CreateWatchlist;
