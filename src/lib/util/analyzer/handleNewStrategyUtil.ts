import { FutPayloadTransformData } from "@/components/shared/ChartLayout/optionFutures/optionFuturesUtil/legUtil";

const handleCombineData = ({
  optionDatas,
  futureDatas,
  checkedRows,
  multiplier,
  setCheckedRows,
  setInitialLotSizes,
  prevCopiedDataRef,
  prevMultiplierRef,
}:any) => {
  const combinedData = {
    ...optionDatas,
    ...FutPayloadTransformData(futureDatas),
  };

  const duplicateData = JSON.parse(JSON.stringify(combinedData));

  prevCopiedDataRef.current = duplicateData;
  const updatedCheckedRows = Object.keys(checkedRows).reduce(
    (acc, key) => {
      if (key in optionDatas || key in futureDatas) {
        acc[key] = checkedRows[key]; // Keep keys that exist in optionDatas
      }
      return acc;
    },
    {} as Record<string, boolean>
  );
  Object.keys(combinedData).forEach((key) => {
    if (!(key in checkedRows)) {
      updatedCheckedRows[key] = true;
    }
  });

  setCheckedRows(updatedCheckedRows);

  const initialSizes: { [key: string]: number } = {};
  Object.keys(duplicateData).forEach((key) => {
    initialSizes[key] = duplicateData[key].lots;
  });
  setInitialLotSizes(initialSizes);

  prevMultiplierRef.current = multiplier;
};

const removeTokenField = (payload: any) => {
  if (!payload) return payload;

  return Object.fromEntries(
    Object.entries(payload as any).map(([key, value]) => [
      key,
      Object.fromEntries(
        Object.entries(value as any).map(([subKey, subArray]) => [
          subKey,
          Array.isArray(subArray)
            ? subArray.map(({ token, ...rest }) => ({ token: "", ...rest })) //replace token with empty string
            : subArray,
        ])
      ),
    ])
  );
};
export { handleCombineData, removeTokenField };
