import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ThemedText } from "@/components/common/ThemedText";

const LineChartGraph = ({ data, config }) => {
  const screenWidth = Dimensions.get("window").width;

  if (!data || data.length === 0) {
    return <ThemedText>No data available for this period.</ThemedText>;
  }

  const {
    xAxisDataKey = "name",
    yAxisDataKey = "value",
    lineColor = "#ffc658",
    yAxisFormatter = (value) => `${value}`,
  } = config || {};

  // Calculate the optimal number of labels based on screen width
  const calculateOptimalLabelCount = () => {
    const minSpaceBetweenLabels = 50; // Minimum space between labels in pixels
    return Math.floor((screenWidth - 40) / minSpaceBetweenLabels);
  };

  const optimalLabelCount = calculateOptimalLabelCount();

  // Function to reduce the number of labels
  const reduceLabels = (data, labelCount) => {
    if (data.length <= labelCount) return data;
    const step = Math.ceil(data.length / labelCount);
    return data.filter((_, index) => index % step === 0);
  };

  // Reduce the number of data points for labels
  const reducedData = reduceLabels(data, optimalLabelCount);

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: lineColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // Solid background lines
    },
    // propsForLabels: {
    //   fontSize: 8,
    //   rotation: 45,
    // },
  };

  const chartData = {
    labels: reducedData.map((item) => item[xAxisDataKey] || ""),
    datasets: [
      {
        data: data.map((item) => item[yAxisDataKey] || 0),
        color: (opacity = 1) => lineColor,
        strokeWidth: 2,
      },
    ],
    legend: config.legend,
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        formatYLabel={(value) => yAxisFormatter(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default LineChartGraph;
