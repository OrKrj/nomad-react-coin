import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ReactApexChart from "react-apexcharts";

interface IPriceContext {
  coinId: string;
  isDark: boolean;
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

interface IData {
  x: string | Date;
  y: [number, number, number, number];
}

interface ISeries {
  name: string;
  data: IData[];
}

function Price() {
  const { coinId, isDark } = useOutletContext<IPriceContext>();
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlc", coinId], () =>
    fetchCoinHistory(coinId)
  );

  const [options, setoptions] = useState<ApexCharts.ApexOptions>({
    theme: { mode: "light" },
    chart: {
      type: "candlestick",
      background: "#f3f3f3",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: false,
      },
      show: false,
    },
  });

  useEffect(() => {
    setoptions((prevOptions) => ({
      ...prevOptions,
      chart: {
        background: isDark ? "#2f3640" : "#f3f3f3",
        toolbar: { show: false },
      },
      theme: { mode: isDark ? "dark" : "light" },
    }));
  }, [isDark]);

  const [series, setSeries] = useState<ISeries[]>([
    {
      name: "price",
      data: [],
    },
  ]);

  useEffect(() => {
    if (data) {
      setSeries([
        {
          name: "price",
          data: data?.map((price) => ({
            x: new Date(price.time_close * 1000).toISOString(),
            y: [
              parseFloat(price.open),
              parseFloat(price.high),
              parseFloat(price.low),
              parseFloat(price.close),
            ],
          })),
        },
      ]);
    }
  }, [data]);

  return (
    <div>
      {isLoading ? (
        <span>"Loading..."</span>
      ) : (
        <ReactApexChart
          series={series}
          options={options}
          type="candlestick"
          height={300}
        />
      )}
    </div>
  );
}

export default Price;
