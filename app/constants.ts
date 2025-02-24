type HeatmapData = { date: Date; value: number }[];

const getRamdomDate = (startDate: Date, endDate: Date): Date => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
};

export const generateRandomData = (startDate: Date, endDate: Date) => {
  const data: HeatmapData = [];
  for (let x = 0; x <= 365; x++) {
    const date = getRamdomDate(startDate, endDate);
    data.push({
      date,
      value: Math.random() * 40,
    });
  }
  return data;
};
