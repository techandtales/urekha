import React from "react";
import { View, Text, StyleSheet, Svg, Rect, Line } from "@react-pdf/renderer";

interface DetailedNorthIndianChartProps {
  data?: any;
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

const DetailedNorthIndianChart = ({ data }: DetailedNorthIndianChartProps) => {
  return (
    <View style={styles.container}>
      <Svg height="300" width="300" viewBox="0 0 300 300">
        <Rect
          x="0"
          y="0"
          width="300"
          height="300"
          fill="none"
          stroke="#000000"
          strokeWidth={2}
        />
        <Line
          x1="0"
          y1="0"
          x2="300"
          y2="300"
          stroke="#000000"
          strokeWidth={1}
        />
        <Line
          x1="300"
          y1="0"
          x2="0"
          y2="300"
          stroke="#000000"
          strokeWidth={1}
        />
        <Rect
          x="45"
          y="45"
          width="210"
          height="210"
          fill="none"
          stroke="#000000"
          strokeWidth={1}
          transform="rotate(45, 150, 150)"
        />

        {/* Planets */}
        <Text
          x="120"
          y="78"
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 11,
            fill: "#d22b2b",
          }}
        >
          As(29.1) Ke(16.1)
        </Text>
        <Text
          x="6"
          y="78"
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 11,
            fill: "#d22b2b",
          }}
        >
          Mo(21.7)
        </Text>
        <Text
          x="36"
          y="270"
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 11,
            fill: "#d22b2b",
          }}
        >
          Sa(24.9)
        </Text>
        <Text
          x="102"
          y="216"
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 11,
            fill: "#d22b2b",
          }}
        >
          Ra(16.1)
        </Text>
        <Text
          x="240"
          y="234"
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 11,
            fill: "#d22b2b",
          }}
        >
          Ma(4.0) Ju(17.6)
        </Text>
        <Text
          x="240"
          y="78"
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 11,
            fill: "#d22b2b",
          }}
        >
          Su(2.0) Me(28.5) Ve(13.9)
        </Text>

        {/* Signs */}
        <Text
          x="148"
          y="140"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          6
        </Text>
        <Text
          x="74"
          y="67"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          7
        </Text>
        <Text
          x="63"
          y="79"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          8
        </Text>
        <Text
          x="137"
          y="153.5"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          9
        </Text>
        <Text
          x="63"
          y="227"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          10
        </Text>
        <Text
          x="74"
          y="237"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          11
        </Text>
        <Text
          x="145"
          y="166"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          12
        </Text>
        <Text
          x="220.5"
          y="238"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          1
        </Text>
        <Text
          x="232"
          y="227"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          2
        </Text>
        <Text
          x="158"
          y="153"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          3
        </Text>
        <Text
          x="233"
          y="79"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          4
        </Text>
        <Text
          x="222"
          y="67"
          style={{ fontFamily: "Helvetica", fontSize: 10, fill: "#919191" }}
        >
          5
        </Text>
      </Svg>
    </View>
  );
};

export default DetailedNorthIndianChart;
