type HeatmapData = { date: Date; value: number }[];

const getRamdomDate = (startDate: Date, endDate: Date): Date => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
};

export const generateRandomData = (
  startDate: Date,
  endDate: Date,
  nbEvents: number
): HeatmapData => {
  const data = [];
  for (let x = 1; x <= nbEvents; x++) {
    const date = getRamdomDate(startDate, endDate);
    data.push({
      date,
      value: Math.round(Math.random() * 50000),
    });
  }
  return data;
};
