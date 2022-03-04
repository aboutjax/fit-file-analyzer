import React from "react";
import { motion } from "framer-motion";
import {
  Line,
  Brush,
  Area,
  XAxis,
  AreaChart,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  CartesianAxis,
} from "recharts";

import { Tokens } from "../styles/tokens";
import * as _ from "lodash";
import { LTTB } from "downsample";

var toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

const CustomTooltip = ({ active, payload, label }) => {
  console.log(payload);
  let listItems = payload.map((item) => {
    if (item.name == "Altitude") {
      return (
        <li
          key={item.name}
          style={{ listStyle: "none", display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              marginRight: 8,
              display: "block",
              backgroundColor: item.color,
            }}
          />
          {item.name}:{" "}
          <strong>
            {Math.round(item.value * 1000)} {item.unit || ""}
          </strong>
        </li>
      );
    } else {
      return (
        <li
          key={item.name}
          style={{ listStyle: "none", display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              marginRight: 8,
              display: "block",
              backgroundColor: item.color,
            }}
          />
          {item.name}:{" "}
          <strong>
            {Math.round((item.value * 100) / 100)} {item.unit || ""}
          </strong>
        </li>
      );
    }
  });
  if (active && payload && payload.length) {
    let timerTime = payload[0].payload.elapsed_time;
    return (
      <div className="p-4 bg-gray-700 rounded-md shadow-md border border-gray-600">
        <span className="text-gray-200 text-xs mb-2 block">
          {toHHMMSS(timerTime)}
        </span>
        <hr className="mb-1 border-gray-500"></hr>
        {listItems}
      </div>
    );
  }

  return null;
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function ChartStacked({ data }) {
  const [resolution, setResolution] = React.useState(1000);
  const [scale, setScale] = React.useState(1);
  const [brush, setBrush] = React.useState({ startIndex: 0, endIndex: 1000 });
  let records = data.records;

  let uniqueKeys = Object.keys(
    records.reduce(function (result, obj) {
      return Object.assign(result, obj);
    }, {})
  );

  // let handleBrushChange = (e) => {
  //   console.log("asdf");
  //   setBrush({ startIndex: e.startIndex, endIndex: e.endIndex });
  // };

  let handleBrushChange = React.useCallback(
    (e) => {
      console.log("asdf");
      setBrush({ startIndex: e.startIndex, endIndex: e.endIndex });
    },
    [brush]
  );

  let removeTimestamp = records.map((record) => {
    delete record.timestamp;
    delete record.left_right_balance;
    return { x: record.elapsed_time, y: 0, ...record };
  });

  let simplified = LTTB(removeTimestamp, resolution);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <ChartCard
        data={simplified}
        datakey={"power"}
        name={"Power"}
        unit={"W"}
        color={Tokens.power}
        brushStartIndex={brush.startIndex}
        brushEndIndex={brush.endIndex}
      />
      <ChartCard
        data={simplified}
        datakey={"speed"}
        name={"Speed"}
        unit={"kph"}
        color={Tokens.speed}
        brushStartIndex={brush.startIndex}
        brushEndIndex={brush.endIndex}
      />
      <ChartCard
        data={simplified}
        datakey={"cadence"}
        name={"Cadence"}
        unit={"rpm"}
        color={Tokens.cadence}
        brushStartIndex={brush.startIndex}
        brushEndIndex={brush.endIndex}
      />
      <ChartCard
        data={simplified}
        datakey={"heart_rate"}
        name={"Heart rate"}
        unit={"bpm"}
        color={Tokens.heartrate}
        brushStartIndex={brush.startIndex}
        brushEndIndex={brush.endIndex}
      />
    </motion.div>
  );
}

const ChartCard = ({
  data,
  datakey,
  name,
  unit,
  color,
  brushStartIndex,
  brushEndIndex,
}) => {
  return (
    <motion.div
      variants={item}
      style={{ width: "100%", height: "300px" }}
      className="p-6 rounded-md mb-4 border border-gray-700 bg-gray-800"
    >
      <h1 className="text-xl font-semibold pb-4">{name}</h1>
      <ResponsiveContainer debounce={0.2} height={"100%"}>
        <ComposedChart
          syncId={"stacked"}
          data={data}
          margin={{ top: 24, bottom: 24 }}
        >
          <YAxis
            dataKey={datakey}
            domain={[0, "auto"]}
            stroke={"#ccc"}
            tickCount={3}
            axisLine={false}
            tickSize={0}
            unit={unit}
            mirror={true}
            verticalAnchor="end"
            tick={{ fontSize: 14, dy: -10, dx: -2 }}
          />
          <YAxis
            yAxisId="altitude"
            dataKey={"altitude"}
            domain={[0, 1]}
            tickCount={5}
            axisLine={false}
            tickSize={0}
            hide={true}
            tickFormatter={(value) => Math.round(value * 1000)}
            unit=" m"
            tick={{ fontSize: 14, dy: -10, dx: -2 }}
          />

          <Tooltip
            cursor={{ stroke: "white" }}
            content={<CustomTooltip />}
            isAnimationActive={false}
          />
          <CartesianGrid
            vertical={false}
            strokeDasharray="4"
            strokeOpacity={0.3}
          />
          <Line
            isAnimationActive={false}
            name={name}
            type="monotone"
            dataKey={datakey}
            stroke={color}
            unit={unit}
            dot={false}
            activeDot={{ r: 4 }}
          />

          <XAxis
            dataKey="elapsed_time"
            interval={"preserveEnd"}
            orientation={"bottom"}
            padding={{ left: 40 }}
            minTickGap={200}
            tickCount={4}
            stroke={"#ccc"}
            tick={{ fontSize: 14 }}
            tickFormatter={(val) => {
              return toHHMMSS(val);
            }}
          />

          <Area
            type="linear"
            yAxisId="altitude"
            name="Altitude"
            isAnimationActive={false}
            dataKey="altitude"
            stroke={"none"}
            fill={"rgba(255, 255, 255, .6)"}
            dot={false}
            unit={"m"}
            activeDot={{ r: 4 }}
            tickFormatter={(val) => val * 1000}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
