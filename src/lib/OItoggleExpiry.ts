//For Trigeering Updated Expiry in tradingview OI button toggle
let tvChart: any = null;
let container: HTMLDivElement | null = null;
let reduxDispatch: any = null;
let ceBarColor: string = "rgba(124,216,129,0.6)";
let peBarColor: string = "rgba(231,111,112,0.6)";
let positionsdata: any[] = [];
let globalSymbolNewsData: Record<string, any> = {};
export function setPositionsData(data: any[]) {
  positionsdata = data;
}

export function getPositionsData(): any[] {
  return positionsdata;
}

export function setOIState(
  chart: any,
  div: HTMLDivElement | null,
  dispatch: any
) {
  tvChart = chart;
  container = div;
  reduxDispatch = dispatch;
}
export function setOIColors(ceColor: string, peColor: string) {
  ceBarColor = ceColor;
  peBarColor = peColor;
}
export function getOIColors() {
  return { ceBarColor, peBarColor };
}

export function getOIState() {
  return { tvChart, container, reduxDispatch };
}

export function setGlobalSymbolNewsData(data: Record<string, any>) {
  globalSymbolNewsData = data;
}
export function getGlobalSymbolNewsData() {
  return globalSymbolNewsData;
}
