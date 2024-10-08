import Loader from "@components/common/Loader";
import { predefinedRanges } from "@data/UtilData";
import { CircularProgress } from "@mui/material";
import { useList } from "@refinedev/core";
import { ApexOptions } from "apexcharts";
import { subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { DateRangePicker, Stack } from "rsuite";
interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3c50e0", "#f9597c", "#6c757d"],
  labels: ["Complete", "Error", "Null"],
  legend: {
    show: true,
    position: "bottom",
    formatter: function (seriesName, opts) {
      const total = opts.w.globals.series.reduce((a: any, b: any) => a + b, 0);
      const value = opts.w.globals.series[opts.seriesIndex];
      const percentage = ((value / total) * 100).toFixed(0); // Calculate the percentage
      return `${seriesName}: ${percentage}%`; // Return the label with the percentage
    },
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};
interface ChatOneProps {
  categories: string;
  dateRange: [Date, Date];
  setCategories: React.Dispatch<React.SetStateAction<string>>;
  setDateRange: React.Dispatch<React.SetStateAction<[Date, Date]>>;
}

const ChartThree: React.FC<ChatOneProps> = ({
  categories,
  dateRange,
  setCategories,
  setDateRange,
}) => {
  const [series, setSeries] = useState<number[]>([]);
  const handleDateRangeChange = (value: any) => {
    setDateRange(value);
  };

  const { data, isLoading, refetch, isSuccess } = useList({
    resource: `transactions/metrics/chart?start_date=${dateRange[0].toISOString().split("T")[0]}&end_date=${dateRange[1].toISOString().split("T")[0]}`,
    hasPagination: false,
  });

  useEffect(() => {
    const tempData = data?.data as any;
    if (tempData?.data) {
      setSeries([
        tempData?.data[0]?.count || 0,
        tempData?.data[1]?.count || 0,
        tempData?.data[2]?.count || 0,
      ]);
    }
  }, [data, isLoading]);

  useEffect(() => {
    refetch();
  }, [dateRange]);

  return (
    <div className="flex flex-col col-span-12 rounded-sm bg-white px-5 pb-5 pt-7.5 sm:px-7.5 xl:col-span-4">
      <div className="mb-2 flex-1 flex items-center justify-center">
        <div id="chartThree" className="mx-auto flex justify-center mt-8">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <ReactApexChart options={options} series={series} type="donut" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
