import React from "react";
import LineChart from "@/components/common/LineChart";
import { INDIAN_RUPPEE_SYMBOL } from "@/constants/common";

const RevenueGraphs = ({ weeklyRevenue, monthlyRevenue }) => {
  const weeklyConfig = {
    xAxisDataKey: "name",
    yAxisTickFormatter: (value) => `${INDIAN_RUPPEE_SYMBOL} ${value}`,
    lineDataKey: "revenue",
    lineColor: "#8884d8",
  };

  const monthlyConfig = {
    xAxisDataKey: "name",
    yAxisTickFormatter: (value) => `${INDIAN_RUPPEE_SYMBOL} ${value}`,
    lineDataKey: "revenue",
    lineColor: "#82ca9d",
  };

  return (
    <>
      <LineChart
        title="Weekly Revenue (Last 4 Weeks)"
        data={weeklyRevenue}
        config={weeklyConfig}
      />
      <LineChart
        title="Monthly Revenue (Last 6 Months)"
        data={monthlyRevenue}
        config={monthlyConfig}
      />
    </>
  );
};

export default RevenueGraphs;
