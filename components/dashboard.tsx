"use client";

import { Heatmap } from "@/components/heatmap";
import { IActivity } from "@/utils/types";
import { useMemo, useState } from "react";

export type Metric = "distance" | "moving_time" | "elevation_gain";

const metrics = [
  { id: "distance", label: "Distance", className: "rounded-l-lg" },
  {
    id: "moving_time",
    label: "Time",
    className: "border-x border-gray-200 dark:border-gray-700",
  },
  {
    id: "elevation_gain",
    label: "Elevation gain",
    className: "rounded-r-lg",
  },
] as const;

export const Dashboard = ({ data }: { data: IActivity[] }) => {
  const availableYears = useMemo(() => {
    return [
      ...new Set(
        data.map((activity) => activity.start_date.split("-")[0]).map(Number)
      ),
    ].sort((a, b) => a - b);
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(
    availableYears[availableYears.length - 1]
  );
  const [selectedMetric, setSelectedMetric] = useState<Metric>("distance");

  const renderMetricButton = (metric: (typeof metrics)[number]) => (
    <button
      key={metric.id}
      onClick={() => setSelectedMetric(metric.id)}
      className={`px-4 py-2 text-sm font-medium ${metric.className} ${
        selectedMetric === metric.id
          ? "bg-[#fc4c02] text-white dark:bg-[#fc4c02] dark:text-white"
          : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      }`}
    >
      {metric.label}
    </button>
  );

  const filteredData = useMemo(() => {
    const getMetric = (activity: IActivity) => {
      if (selectedMetric === "distance") {
        return activity.distance;
      }
      if (selectedMetric === "moving_time") {
        return activity.moving_time;
      }
      return activity.total_elevation_gain;
    };

    return data
      .filter((activity) =>
        activity.start_date.startsWith(selectedYear.toString())
      )
      .map((activity) => ({
        date: new Date(activity.start_date),
        value: getMetric(activity),
      }));
  }, [data, selectedYear, selectedMetric]);

  return (
    <div className="w-full max-w-7xl px-2 md:px-8 mx-auto">
      <div className="flex flex-col items-center text-center md:text-left md:flex-row md:justify-between gap-6">
        <h1 className="text-3xl font-bold">Your Activities</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <form className="max-w-sm">
            <label htmlFor="year-select" className="sr-only">
              Select year
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(+e.currentTarget.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </form>
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
            {metrics.map(renderMetricButton)}
          </div>
        </div>
      </div>

      <Heatmap
        data={filteredData}
        startDate={new Date(`${selectedYear}-01-01`)}
        endDate={new Date(`${selectedYear}-12-31`)}
        metric={selectedMetric}
      />
    </div>
  );
};
