const buildTargetList = () => {
  const stopLossList: any = [];
  // push default value
  const defaultValue = {
    name: "Select",
    value: -1,
  };

  stopLossList.push(defaultValue);
  for (let i = 20; i <= 80; i += 10) {
    stopLossList.push({
      name: `${i}%`,
      value: i,
    });
  }

  return stopLossList;
};

export { buildTargetList };
