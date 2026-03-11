declare module "jstat" {
  export const jStat: {
    normal: {
      cdf: (x: number, mean: number, std: number) => number;
    };
  };
}
