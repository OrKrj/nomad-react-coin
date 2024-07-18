import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { useOutletContext } from "react-router-dom";
import ApexChart from "react-apexcharts";

interface ICoinId {
  coinId: string;
}

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface IChartProps {
  isDark: boolean;
}

function Chart({ isDark }: IChartProps) {
  const { coinId } = useOutletContext<ICoinId>();
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  const [opstions, setOptions] = useState<ApexCharts.ApexOptions>({
    theme: { mode: "light" },
    chart: {
      width: 500,
      height: 500,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.7 } },
    stroke: {
      curve: "straight",
      width: 4,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
      type: "datetime",
      categories: data?.map((price) =>
        new Date(price.time_close * 1000).toISOString()
      ),
    },
    fill: {
      type: "gradient",
      gradient: { gradientToColors: ["#0be881"], stops: [0, 50] },
    },
  });

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      theme: { mode: isDark ? "dark" : "light" },
      grid: {
        row: isDark
          ? { colors: ["#2C3A47", "transparent"], opacity: 0.5 }
          : { colors: ["#f3f3f3", "transparent"], opacity: 0.7 },
      },
    }));
  }, [isDark]);

  return (
    <div>
      <ApexChart
        type="line"
        series={[
          {
            name: "$",
            data: data?.map((price) => Number(price.close)) as number[],
          },
        ]}
        options={opstions}
      />
    </div>
  );
}

export default Chart;
