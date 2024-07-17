import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { useOutletContext } from "react-router-dom";
import ApexChart from "react-apexcharts";
import { DarkTheme } from "../theme";

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
    chart: { width: 500, height: 500 },
  });

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      theme: { mode: isDark ? "dark" : "light" },
    }));
  }, [isDark]);

  return (
    <div>
      <ApexChart
        type="line"
        series={[
          {
            name: "price",
            data: [1, 2, 3, 4, 5, 6],
          },
        ]}
        options={opstions}
      />
    </div>
  );
}

export default Chart;
