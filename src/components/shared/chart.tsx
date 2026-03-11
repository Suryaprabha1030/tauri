"use client";
import { chartData } from "@/lib/types";
import { get } from "http";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const Chart = (props: { data: chartData; spotPrice: number }) => {
  // const {data}=props
  
  const gradientOffset = () => {
    const dataMax = Math.max(...props.data.map((i) => i.result));
    // console.log(dataMax)
    
    const dataMin = Math.min(...props.data.map((i) => i.result));

    if (dataMax <= 0) {
      return 1;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <ResponsiveContainer width="100%" height="100%" className="max-sm:text-[0.8rem] md:text-[0.8rem] lg:text-[0.8rem]">
      <AreaChart
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 50,
        }}
      >
        <XAxis
          dataKey="strikePrice"
          label={{ value: "Strike Price", position: "bottom" }}
          scale={"linear"}
          // allowDuplicatedCategory={false}
        />
        <YAxis
          label={
            <text
              x={-100} // Adjust x position to center the label
              y={20} // Adjust y position to align with axis
              dy={1} // Adjust dy to add padding between label and axis
              textAnchor="middle" // Center the text horizontally
              transform="rotate(-90)" // Rotate the label to align vertically
             
              className="font-light text-[0.69rem] "
            >
              Profit / Loss
            </text>
          }
        />
        <Tooltip />
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor="#4CA858" stopOpacity={1} />
            <stop offset={off} stopColor="#a82324" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="result"
          stroke="#000"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          isAnimationActive={true}
          fill="url(#splitColor)"
        />

        <ReferenceLine
          x={Math.round(props.spotPrice)}
          label={{
            value: props.spotPrice,
            position: "insideTopRight",
          }}
          stroke="red"
          ifOverflow="extendDomain"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;

