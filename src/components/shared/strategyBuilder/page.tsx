"use client";
import {
  OptionsStrategyBuilderApi,
  PlotResult,
  Strategy,
  StrategyDataInputBlueprint,
  StrategyDataUpdateInputBlueprint,
} from "@/lib/api/base";
import Builder from "./builder";
import {
  consolidateStrategyBuilderData,
  getCreateStrategyData,
} from "@/lib/util/createStrategyUtil";
import { StrategyBuilderData } from "@/lib/types";
import { use, useEffect, useState } from "react";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { set } from "react-hook-form";
import { getChartData } from "@/lib/util/chartUtil";
import Chart from "../chart";
import { useRouter } from "next/navigation";
import { debug } from "console";
import Link from "next/link";
import { idText } from "typescript";

const StrategyBuilder = (props: {
  strategy?: Strategy | undefined;
  name?: string | undefined;
  id: number | null;
}) => {
  const router = useRouter();
  const [name, setName] = useState<string>(props.name || "");
  const [data, setData] = useState<StrategyBuilderData[]>(
    getCreateStrategyData(props.strategy || ({} as Strategy)),
  );
  const [chartData, setChartData] = useState<PlotResult | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const result = consolidateStrategyBuilderData(data);
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());

    if (props.id) {
      const input: StrategyDataUpdateInputBlueprint = {
        name: name,
        data: result,
        id: props.id,
      };

      strategyApi
        .updateStrategyV1StrategiesPut(input)
        .then((res) => {
          // if url is same as res.data.id - refresh
          // else push to new url
          if (window.location.pathname === `/strategy-builder/${res.data.id}`) {
            window.location.reload();
            return;
          }
          router.push(`/strategy-builder/${res.data.id}`);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            window.location.href = "/logout";
          }
        });
    } else {
      const input: StrategyDataInputBlueprint = {
        name: name,
        data: result,
      };

      strategyApi
        .createStrategyV1StrategiesPost(input)
        .then((res) => {
          router.push(`/strategy-builder/${res.data.id}`);
          router.refresh();
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            window.location.href = "/logout";
          }
        });
    }
  };

  useEffect(() => {
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());
    strategyApi
      .prepareAndGetSimulatorDataV1StrategiesPayoffPost(
        "NIFTY",
        "2023-07-14T12:01",
        "20JUL23",
        "",
        consolidateStrategyBuilderData(data),
      )
      .then((res) => {
        setChartData(res.data.plot_results);
      });
  }, [data]);

  return (
    <div className="flex h-full max-sm:w-full max-sm:jutify-center  md:justify-center flex-col   xl:flex-row gap-[3.5rem]  lg:gap-2 md:gap-3 ">
      <div className="flex flex-col  w-full xl:flex-col xl:w-1/2 gap-5 ">
        <div className="flex flex-row gap-5    items-center md:gap-[15rem] xl:gap-[5rem]">
          <a href="/">
            {" "}
            <button
              type="button"
              className="flex h-10 w-10 max-sm:py-2 max-md:py-2 lg:py-0  items-center justify-center rounded-3xl bg-z-green-500 max-sm:text-[0.85rem] md:text-base font-medium leading-none text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#ffffff"
                fill="none"
              >
                <path
                  d="M4 12L20 12"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.99996 17C8.99996 17 4.00001 13.3176 4 12C3.99999 10.6824 9 7 9 7"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </a>

          <h1 className="max-sm:text-[0.8rem] text-center  md:text-[1rem] font-bold ">
            {!props.id ? "Create Strategy" : "Update Strategy"}
          </h1>
        </div>
        <input
          type="text"
          placeholder="Add Strategy Name"
          className="rounded-lg border-2 border-gray-300 p-2  max-sm:text-[0.8rem] md:mx-12 "
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex lg:w-full xl:w-full max-sm:h-[20rem] h-[24rem]  flex-col w-full ">
          {chartData && <Chart data={getChartData(chartData)} spotPrice={0} />}
        </div>
      </div>
      <div className="flex xl:w-1/2 w-full flex-col gap-2 lg:gap-5 xl:mt-12">
        <div className="flex flex-col gap-5">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[1.5rem] lg:gap-4"
          >
            {/* <input
              type="text"
              placeholder="Add Strategy Name"
              className="rounded-lg border-2 border-gray-300 p-2  max-sm:text-[0.8rem] "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            /> */}
            <Builder
              data={data}
              newStrategy={!props.id}
              updateData={(input) => setData(input)}
            />
            <button
              type="submit"
              className="flex lg:h-10 w-1/2 md:w-[10rem] md:h-10 max-sm:py-2 max-md:py-2 lg:py-0 lg:w-1/2 items-center justify-center rounded-3xl bg-z-green-500 max-sm:text-[0.85rem] md:text-base font-medium leading-none text-white"
            >
              {!props.id ? "Create Strategy" : "Update Strategy"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
