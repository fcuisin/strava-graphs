"use client";

import { useMemo, useState } from "react";
import * as d3 from "d3";
import { Tooltip } from "@/components/tooltip";
import { Metric } from "@/components/dashboard";

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
  data: { date: Date; value: number }[];
  cellSize?: number;
  startDate?: Date;
  endDate?: Date;
  metric?: Metric;
};

export type InteractionData = {
  xPos: number;
  yPos: number;
  date: Date;
  value: number;
};

export const Heatmap = ({
  data = [],
  cellSize = 24,
  startDate,
  endDate,
  metric,
}: HeatmapProps) => {
  const [tooltipData, setTooltipData] = useState<InteractionData | null>(null);

  const groupedByWeekData = useMemo(() => {
    const sortedData = [...data].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const firstDate = startDate ?? sortedData[0]?.date;
    const lastDate = endDate ?? sortedData[sortedData.length - 1]?.date;

    if (!firstDate || !lastDate) return new Map();

    const allDates = [];
    const currentDate = new Date(firstDate);
    while (currentDate <= lastDate) {
      allDates.push({
        date: new Date(currentDate),
        value: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const completeData = allDates.map((emptyDate) => {
      const existingData = sortedData.find(
        (d) => d.date.toDateString() === emptyDate.date.toDateString()
      );
      return existingData || emptyDate;
    });

    const firstWeek = d3.timeWeek.count(d3.timeYear(firstDate), firstDate);
    const lastWeek = d3.timeWeek.count(d3.timeYear(firstDate), lastDate);

    // Grouper les données complètes par semaine
    const groupedByWeek = d3.group(completeData, (d) =>
      d3.timeWeek.count(d3.timeYear(firstDate), d.date)
    );

    for (let week = firstWeek; week <= lastWeek; week++) {
      if (!groupedByWeek.has(week)) {
        groupedByWeek.set(week, []);
      }
    }

    return groupedByWeek;
  }, [data, endDate, startDate]);

  const allWeeks = useMemo(
    () => [...groupedByWeekData.keys()].sort((a, b) => a - b),
    [groupedByWeekData]
  );

  const width = cellSize * 1.4 * allWeeks.length;
  const height = cellSize * 1.4 * DAYS_OF_WEEK.length;
  const boundsWidth = width + MARGIN.left + MARGIN.right;
  const boundsHeight = height + MARGIN.top + MARGIN.bottom;

  const xScale = useMemo(
    () =>
      d3
        .scaleBand()
        .range([0, width])
        .domain(allWeeks.map(String))
        .padding(0.25),
    [width, allWeeks]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .range([0, height])
        .domain(DAYS_OF_WEEK.map((_, i) => i.toString()))
        .padding(0.25),
    [height]
  );

  const [min, max] = d3.extent(data.map((d) => d.value)) as [number, number];
  const colorScale = d3
    .scaleLinear<string>()
    .domain([min, max])
    .range(["#ffe69e", "#f9a03f"]);

  const cells = allWeeks.flatMap((week) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const weekData = groupedByWeekData.get(week) || [];
      const dayData = weekData.find(
        (d: { date: Date }) => d.date.getDay() === dayIndex
      );

      if (!dayData) return null;

      return (
        <rect
          key={`${week}-${dayIndex}`}
          x={xScale(week.toString())}
          y={yScale(dayIndex.toString())}
          width={cellSize}
          height={cellSize}
          fill={
            dayData.value !== 0
              ? colorScale(dayData.value)
              : "rgba(255, 255, 255, 0.1)"
          }
          stroke="rgba(255, 255, 255, 0.04)"
          rx={3}
          className="transition-all duration-200 hover:opacity-80"
          onMouseEnter={() => {
            if (dayData.value === 0) return;
            setTooltipData({
              xPos:
                xScale(week.toString()) ?? 0 + xScale.bandwidth() + MARGIN.left,
              yPos:
                yScale(dayIndex.toString()) ??
                0 + xScale.bandwidth() / 2 + MARGIN.top,
              date: dayData.date,
              value: dayData.value,
            });
          }}
          onMouseLeave={() => setTooltipData(null)}
        />
      );
    });
  });

  const xLabels = allWeeks.map((week, i) => {
    const weekData = groupedByWeekData.get(week);
    const firstDayOfWeek = weekData?.[0]?.date;

    const showMonth =
      firstDayOfWeek &&
      (i === 0 ||
        weekData?.[0]?.date.getMonth() !==
          groupedByWeekData.get(allWeeks[i - 1])?.[0]?.date.getMonth());

    return showMonth ? (
      <text
        key={week}
        x={(xScale(week.toString()) ?? 0) + xScale.bandwidth() / 2}
        y={height + 30}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
        className="fill-white text-sm font-medium"
      >
        {MONTHS[firstDayOfWeek.getMonth()]}
      </text>
    ) : null;
  });

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

  const renderTooltipText = (value: number) => {
    if (metric === "distance") {
      return `${Number((value / 1000).toFixed(2))}km`;
    }

    if (metric === "moving_time") {
      const hours = Math.floor(value / 3600);
      const minutes = value % 60;
      const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}h${paddedMinutes}m`;
    }

    if (metric === "elevation_gain") {
      return `${value} m`;
    }

    return null;
  };

  return (
    <section className="max-w-max max-w-full">
      <div className="relative max-w-full overflow-x-auto overflow-y-hidden">
        <svg
          width={boundsWidth}
          height={boundsHeight}
          viewBox={`0 0 ${boundsWidth} ${boundsHeight}`}
          preserveAspectRatio="xMinYMin meet"
          className="block"
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {cells}
            {xLabels}
            {yLabels}
          </g>
        </svg>
        <Tooltip interactionData={tooltipData}>
          {tooltipData ? (
            <p>
              {tooltipData.date.toLocaleDateString("en-US")} -{" "}
              {renderTooltipText(tooltipData.value)}
            </p>
          ) : null}
        </Tooltip>
      </div>
    </section>
  );
};
