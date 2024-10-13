import React, { useState, useEffect } from "react";
import LineChart from "@/components/common/LineChart";
import { INDIAN_RUPPEE_SYMBOL } from "@/constants/common";
import { fetchCompletedOrders } from "@/firebase/queries/completedOrder";

const RevenueGraphs = ({ restaurantPath }) => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [hourlyRevenue, setHourlyRevenue] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);

  useEffect(() => {
    fetchCompletedOrders(restaurantPath, setCompletedOrders);
  }, []);

  useEffect(() => {
    if (completedOrders.length > 0) {
      setWeeklyRevenue(processWeeklyRevenue(completedOrders));
      setMonthlyRevenue(processMonthlyRevenue(completedOrders));
      setHourlyRevenue(processHourlyRevenue(completedOrders));
      setDailyRevenue(processDailyRevenue(completedOrders));
    }
  }, [completedOrders]);

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

  const hourlyConfig = {
    xAxisDataKey: "name",
    yAxisTickFormatter: (value) => `${INDIAN_RUPPEE_SYMBOL} ${value}`,
    lineDataKey: "revenue",
    lineColor: "#ffc658",
  };

  const dailyConfig = {
    xAxisDataKey: "name",
    yAxisTickFormatter: (value) => `${INDIAN_RUPPEE_SYMBOL} ${value}`,
    lineDataKey: "revenue",
    lineColor: "#ff7300",
  };

  const processWeeklyRevenue = (orders) => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const weeklyData = Array(4).fill(0);

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= oneMonthAgo) {
        const weekIndex = Math.floor(
          (now - orderDate) / (7 * 24 * 60 * 60 * 1000)
        );
        if (weekIndex < 4) {
          weeklyData[weekIndex] += order.orderValue;
        }
      }
    });

    return weeklyData
      .map((value, index) => ({
        name: `Week ${4 - index}`,
        revenue: value,
      }))
      .reverse();
  };

  const processMonthlyRevenue = (orders) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyData = Array(6).fill(0);

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= sixMonthsAgo) {
        const monthIndex = (now.getMonth() - orderDate.getMonth() + 12) % 12;
        if (monthIndex < 6) {
          monthlyData[monthIndex] += order.orderValue;
        }
      }
    });

    return monthlyData
      .map((value, index) => ({
        name: `Month ${6 - index}`,
        revenue: value,
      }))
      .reverse();
  };

  const processHourlyRevenue = (orders) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const hourlyData = Array(24).fill(0);

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= twentyFourHoursAgo) {
        const hourIndex = 23 - Math.floor((now - orderDate) / (60 * 60 * 1000));
        if (hourIndex >= 0) {
          hourlyData[hourIndex] += order.orderValue;
        }
      }
    });

    return hourlyData.map((revenue, index) => ({
      name: `${23 - index}h ago`,
      revenue: revenue,
    }));
  };

  const processDailyRevenue = (orders) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailyData = Array(7).fill(0);

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= sevenDaysAgo) {
        const dayIndex =
          6 - Math.floor((now - orderDate) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0) {
          dailyData[dayIndex] += order.orderValue;
        }
      }
    });

    return dailyData.map((revenue, index) => ({
      name: `${6 - index}d ago`,
      revenue: revenue,
    }));
  };

  return (
    <>
      <LineChart
        title="Hourly Revenue (Last 24 Hours)"
        data={hourlyRevenue}
        config={hourlyConfig}
      />
      <LineChart
        title="Daily Revenue (Last 7 Days)"
        data={dailyRevenue}
        config={dailyConfig}
      />
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
