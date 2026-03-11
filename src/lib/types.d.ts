import { Strategy, StrategyList } from "./api/base";

export interface ReactChildren {
  children: React.ReactNode;
}

export interface UserStrategy {
  data: Strategy;
  id: number;
  is_active: boolean;
  name: string;
  owner_id: number;
  tags: string;
  updated_at: string;
  created_at: string;
}

export interface SelectedStrategyInfo {
  strategyType?: keyof StrategyList | undefined;
  strategyName: string | null;
  strategyId: number | null;
}

export interface SelectedStrategyData {
  strategyData: StrategyPayOffData;
  strategyBluePrint?: StrategyBlueprintResult | undefined;
}

export type strategiesValues = {
  strategies: UserStrategy[];
  strategyList: StrategyList;
  loading: boolean;
};

// interface and type for StrategyBuilder
interface positionData {
  value: number;
  label: string;
}

type StrategyBuilderData = {
  lots: number;
  position: positionData;
  optionType: string;
  buy: boolean;
};

export type BackTestingInput = {
  indexName: string;
  startDate: string;
  endDate: string;
  entryTime: string;
  exitTime: string;
  target: number;
  stopLoss: number;
  trailingStopLoss: number;
  selectedDays: number | undefined;
};

export type StrategyBuilderInput = {
  indexName: string;
  date: string;
  time: string;
  expiry: string;
};

export type SimulationInput = {
  indexName: string;
  date: string;
  time: string;
  expiry: string;
  timeTravel: string;
};

// interface and type for Chart
interface chartDataObject {
  result: any;
  [key as string]: number;
}
export type chartData = chartDataObject[];

export interface OHLCData {
  open: number;
  high: number;
  low: number;
  close: number;
  time: datetime;
}

export type StopLossInput = {
  type: "stopLoss" | "trailingStopLoss";
  value: number;
};
