import React from "react";
import {
  LineChart as RechartLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { StyleSheet } from "react-native";

const LineChart = ({ title, data, config }) => {
  return (
    <ThemedView style={styles.graphContainer}>
      <ThemedText style={styles.graphTitle}>{title}</ThemedText>
      <ResponsiveContainer width="100%" height={200}>
        <RechartLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={config.xAxisDataKey}
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#999" }}
            tickLine={{ stroke: "#999" }}
          />
          <YAxis
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={{ stroke: "#999" }}
            tickLine={{ stroke: "#999" }}
            tickFormatter={config.yAxisTickFormatter}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 5,
              borderColor: "#ddd",
            }}
            labelStyle={{ fontWeight: "bold", color: "#333" }}
          />
          <Line
            type="monotone"
            dataKey={config.lineDataKey}
            stroke={config.lineColor}
            strokeWidth={3}
            dot={{ r: 6, fill: config.lineColor, strokeWidth: 2 }}
            activeDot={{ r: 8, fill: config.lineColor, stroke: "#fff" }}
          />
        </RechartLineChart>
      </ResponsiveContainer>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
});

export default LineChart;
