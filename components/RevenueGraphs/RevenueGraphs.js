import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import LineChartGraph from "@/components/common/LineChartGraph";
import { INDIAN_RUPPEE_SYMBOL } from "@/constants/common";
import { fetchCompletedOrders } from "@/firebase/queries/completedOrder";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import { Picker } from "@react-native-picker/picker";

const commonRevenueConfig = {
  xAxisDataKey: "name",
  yAxisDataKey: "revenue",
  lineColor: "#82ca9d",
  legend: ["Revenue"],
  yAxisFormatter: (value) => `${INDIAN_RUPPEE_SYMBOL} ${value}`,
};

const commonCountConfig = {
  xAxisDataKey: "name",
  yAxisDataKey: "count",
  lineColor: "#ffc658",
  legend: ["Order Count"],
  yAxisFormatter: (value) => `${value}`,
};

const graphConfigs = {
  hourly: {
    revenue: { ...commonRevenueConfig, title: "Hourly Revenue" },
    count: { ...commonCountConfig, title: "Hourly Order Count" },
  },
  daily: {
    revenue: { ...commonRevenueConfig, title: "Daily Revenue" },
    count: { ...commonCountConfig, title: "Daily Order Count" },
  },
  weekly: {
    revenue: { ...commonRevenueConfig, title: "Weekly Revenue" },
    count: { ...commonCountConfig, title: "Weekly Order Count" },
  },
  monthly: {
    revenue: { ...commonRevenueConfig, title: "Monthly Revenue" },
    count: { ...commonCountConfig, title: "Monthly Order Count" },
  },
};

const RevenueGraphs = ({ restaurantPath }) => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [hourlyRevenue, setHourlyRevenue] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("hourly");

  useEffect(() => {
    if (restaurantPath) {
      fetchCompletedOrders(restaurantPath, setCompletedOrders);
    }
  }, [restaurantPath]);

  useEffect(() => {
    if (completedOrders.length > 0) {
      setWeeklyRevenue(processWeeklyRevenue(completedOrders));
      setMonthlyRevenue(processMonthlyRevenue(completedOrders));
      setHourlyRevenue(processHourlyRevenue(completedOrders));
      setDailyRevenue(processDailyRevenue(completedOrders));
    }
  }, [completedOrders]);

  const processWeeklyRevenue = (orders) => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const weeklyData = Array(4)
      .fill()
      .map(() => ({ revenue: 0, count: 0 }));

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= oneMonthAgo) {
        const weekIndex = Math.floor(
          (now - orderDate) / (7 * 24 * 60 * 60 * 1000)
        );
        if (weekIndex < 4) {
          weeklyData[weekIndex].revenue += order.orderValue;
          weeklyData[weekIndex].count += order.totalOrders;
        }
      }
    });

    return weeklyData
      .map((value, index) => ({
        name: `Week ${4 - index}`,
        revenue: value.revenue,
        count: value.count,
      }))
      .reverse();
  };

  const processMonthlyRevenue = (orders) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyData = Array(6)
      .fill()
      .map(() => ({ revenue: 0, count: 0 }));

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= sixMonthsAgo) {
        const monthIndex = (now.getMonth() - orderDate.getMonth() + 12) % 12;
        if (monthIndex < 6) {
          monthlyData[monthIndex].revenue += order.orderValue;
          monthlyData[monthIndex].count += 1;
        }
      }
    });

    return monthlyData
      .map((value, index) => ({
        name: `Month ${6 - index}`,
        revenue: value.revenue,
        count: value.count,
      }))
      .reverse();
  };

  const processHourlyRevenue = (orders) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const hourlyData = Array(24)
      .fill()
      .map(() => ({ revenue: 0, count: 0 }));

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= twentyFourHoursAgo) {
        const hourIndex = 23 - Math.floor((now - orderDate) / (60 * 60 * 1000));
        if (hourIndex >= 0) {
          hourlyData[hourIndex].revenue += order.orderValue;
          hourlyData[hourIndex].count += 1;
        }
      }
    });

    return hourlyData.map((value, index) => ({
      name: `${23 - index}h ago`,
      revenue: value.revenue,
      count: value.count,
    }));
  };

  const processDailyRevenue = (orders) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailyData = Array(7)
      .fill()
      .map(() => ({ revenue: 0, count: 0 }));

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= sevenDaysAgo) {
        const dayIndex =
          6 - Math.floor((now - orderDate) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0) {
          dailyData[dayIndex].revenue += order.orderValue;
          dailyData[dayIndex].count += 1;
        }
      }
    });

    return dailyData.map((value, index) => ({
      name: `${6 - index}d ago`,
      revenue: value.revenue,
      count: value.count,
    }));
  };

  const renderPicker = () => (
    <Picker
      selectedValue={selectedPeriod}
      onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="1D" value="hourly" />
      <Picker.Item label="7D" value="daily" />
      <Picker.Item label="1M" value="weekly" />
      <Picker.Item label="6M" value="monthly" />
    </Picker>
  );

  const getRevenueData = () => {
    switch (selectedPeriod) {
      case "hourly":
        return hourlyRevenue;
      case "daily":
        return dailyRevenue;
      case "weekly":
        return weeklyRevenue;
      case "monthly":
        return monthlyRevenue;
      default:
        return hourlyRevenue;
    }
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        {getRevenueData().length > 0 ? (
          <>
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <ThemedText style={styles.title}>
                  {graphConfigs[selectedPeriod].revenue.title}
                </ThemedText>
              </View>
              {renderPicker()}
            </View>
            <LineChartGraph
              data={getRevenueData()}
              config={graphConfigs[selectedPeriod].revenue}
            />
            <View style={styles.spacer} />
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <ThemedText style={styles.title}>
                  {graphConfigs[selectedPeriod].count.title}
                </ThemedText>
              </View>
              {renderPicker()}
            </View>
            <LineChartGraph
              data={getRevenueData()}
              config={graphConfigs[selectedPeriod].count}
            />
          </>
        ) : (
          <ThemedText>No data available for this period.</ThemedText>
        )}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: 120,
  },
  spacer: {
    height: 24,
  },
});

export default RevenueGraphs;
