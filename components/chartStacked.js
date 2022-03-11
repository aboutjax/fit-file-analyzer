import React from "react";
import { motion } from "framer-motion";
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

import { Tokens } from "../styles/tokens";
import * as _ from "lodash";
import { LTTB } from "downsample";
import { toHHMMSS, useWindowSize } from "../utils";
import react from "react";

const CustomTooltip = ({ active, payload, label }) => {
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
  const size = useWindowSize();
  const [resolution, setResolution] = React.useState(200);
  const [scale, setScale] = React.useState(1);
  const [brush, setBrush] = React.useState({ startIndex: 0, endIndex: 1000 });

  let records = data.records;

  React.useEffect(() => {
    if (size.width > 500) {
      setResolution(500);
    } else if (size.width > 1000) {
      setResolution(1000);
    } else if (size.width > 2000) {
      setResolution(2000);
    } else {
      setResolution(200);
    }
    // if(size.width > )
  }, [size]);

  // this is a workaround until I figure out how to use the advanced API from https://github.com/janjakubnanista/downsample#advanced-api
  let dataPrepForLTTB = records.map((record) => {
    // In addition to the x and y keys (so LTTB func doesn't fail,
    // also let it smooth out additional data points for this FIT file.
    return { x: record.elapsed_time, y: 0, ...record };
  });

  let simplified = LTTB(dataPrepForLTTB, resolution);

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
            width={80}
            stroke={"#ccc"}
            tickCount={4}
            axisLine={false}
            tickSize={0}
            mirror={true}
            tick={{ fontSize: 14, dy: -12, dx: -2 }}
            tickFormatter={(val, i) => {
              if (val > 0 && i == 3) {
                return `${val} ${unit}`;
              } else if (val > 0) {
                return `${val}`;
              }

              return "";
            }}
          />
          <YAxis
            yAxisId="altitude"
            dataKey={"altitude"}
            domain={["auto", "dataMax"]}
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

          <defs>
            <linearGradient
              id={`${color}_gradient`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="20%" stopColor={color} stopOpacity={1} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            isAnimationActive={false}
            name={name}
            type="monotone"
            dataKey={datakey}
            stroke={color}
            fill={`url(#${color}_gradient)`}
            unit={unit}
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />

          <XAxis
            // type={"number"}
            dataKey="elapsed_time"
            interval={"preserveStartEnd"}
            // orientation={"bottom"}
            padding={{ left: 40 }}
            minTickGap={200}
            tickCount={3}
            // axisLine={false}
            domain={[1000, "auto"]}
            tick={{
              fontSize: 14,
              fill: "#CCC",
              color: "#FFF",
            }}
            tickFormatter={(val) => {
              return toHHMMSS(val);
            }}
          />
          <Area
            // type="monotone"
            yAxisId="altitude"
            name="Altitude"
            isAnimationActive={false}
            dataKey="altitude"
            stroke={"rgba(255, 255, 255, .1)"}
            fill={"rgba(255, 255, 255, .1)"}
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
