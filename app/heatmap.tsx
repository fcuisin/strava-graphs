import { useMemo } from "react";
import * as d3 from "d3";

const MARGIN = { top: 10, right: 10, bottom: 50, left: 50 };
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type HeatmapProps = {
  width: number;
  height: number;
  data: { date: Date; value: number }[];
};

export const Heatmap = ({ width, height, data = [] }: HeatmapProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const dateRange = useMemo(() => {
    const startDate = d3.min(data, (d) => d.date);
    const endDate = d3.max(data, (d) => d.date);

    if (!startDate || !endDate) throw new Error();

    return d3.timeDay.range(startDate, d3.timeDay.offset(endDate, 1));
  }, [data]);

  const parsedData = useMemo(
    () =>
      dateRange.map((d) => {
        const date = data.find(
          (v) =>
            new Date(v.date.toISOString().split("T")[0]).getTime() ===
            new Date(d.toISOString().split("T")[0]).getTime()
        );

        return {
          date: d,
          value: date?.value ?? 0,
          week: d3.timeWeek.count(d3.timeYear(d), d),
          day: d.getDay(),
          month: d.getMonth(),
        };
      }),
    [data, dateRange]
  );

  const allWeeks = useMemo(
    () => [...new Set(parsedData.map((d) => d.week))].sort((a, b) => a - b),
    [parsedData]
  );

  const xScale = useMemo(
    () =>
      d3
        .scaleBand()
        .range([0, boundsWidth])
        .domain(allWeeks.map(String))
        .padding(0.15),
    [boundsWidth, allWeeks]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .range([0, boundsHeight])
        .domain(DAYS_OF_WEEK.map((_, i) => i.toString()))
        .padding(0.15),
    [boundsHeight]
  );

  const [min, max] = d3.extent(parsedData.map((d) => d.value)) as [
    number,
    number
  ];
  const colorScale = d3
    .scaleLinear<string>()
    .domain([min, max])
    .range(["#ffe69e", "#f9a03f"]);

  const cells = parsedData.map((d, i) => (
    <rect
      key={i}
      x={xScale(d.week.toString())}
      y={yScale(d.day.toString())}
      width={Math.max(xScale.bandwidth(), 18)}
      height={Math.max(yScale.bandwidth(), 18)}
      fill={d.value ? colorScale(d.value) : "rgba(255, 255, 255, 0.1)"}
      stroke="rgba(255, 255, 255, 0.04)"
      rx={5}
      className="transition-all duration-200 hover:opacity-80"
    />
  ));

  const xLabels = useMemo(() => {
    let currentMonth = -1;
    return parsedData
      .map((d, i) => {
        if (d.month !== currentMonth) {
          currentMonth = d.month;
          return (
            <text
              key={`month-${i}`}
              x={(xScale(d.week.toString()) ?? 0) + xScale.bandwidth() / 2}
              y={boundsHeight + 30}
              textAnchor="middle"
              fontSize={10}
              fontWeight="bold"
              className="fill-white text-sm font-medium"
            >
              {MONTHS[d.month]}
            </text>
          );
        }
        return null;
      })
      .filter(Boolean);
  }, [parsedData, xScale, boundsHeight]);

  const yLabels = DAYS_OF_WEEK.map((day, i) => (
    <text
      key={day}
      x={-10}
      y={(yScale(i.toString()) ?? 0) + yScale.bandwidth() / 2}
      textAnchor="end"
      dominantBaseline="middle"
      fontSize={10}
      className="fill-white text-sm font-medium"
    >
      {day}
    </text>
  ));

  return (
    <section className="max-w-max max-w-full">
      <div className="max-w-full overflow-x-auto p-2">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMinYMin meet"
          className="block"
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {cells}
            {xLabels}
            {yLabels}
          </g>
        </svg>
      </div>
    </section>
  );
};
