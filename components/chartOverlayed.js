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
  Legend,
} from "recharts";

import { Tokens } from "../styles/tokens";
import * as _ from "lodash";
import { LTTB, createLTTB } from "downsample";

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
  let listItems = payload.map((item) => {
    if (item.name == "Altitude") {
      return (
        <li key={item.name} style={{ listStyle: "none" }}>
          {item.name}:{" "}
          <strong>
            {Math.round(item.value * 1000)} {item.unit || ""}
          </strong>
        </li>
      );
    } else {
      return (
        <li key={item.name} style={{ listStyle: "none" }}>
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
      <div className="p-4 bg-white rounded-md shadow-md border">
        <span className="text-slate-600 text-xs mb-2 block">
          {toHHMMSS(timerTime)}
        </span>
        <hr className="mb-1"></hr>
        {listItems}
      </div>
    );
  }

  return null;
};

export default function ChartOverlayed({ data }) {
  const [resolution, setResolution] = React.useState(1000);
  let records = data.records;

  let uniqueKeys = Object.keys(
    records.reduce(function (result, obj) {
      return Object.assign(result, obj);
    }, {})
  );

  let handleBrushChange = (e) => {
    console.log(e);
    let delta = e.endIndex - e.startIndex;
  };

  console.log(uniqueKeys);

  // let streams = uniqueKeys.map((key) => {
  //   let stream = _.map(records, key);
  //   let replaceUndefinedWithZeroStream = stream.map((item) => {
  //     if (item === undefined) {
  //       return 0;
  //     } else {
  //       return item;
  //     }
  //   });
  //   let originalStream = replaceUndefinedWithZeroStream.map((item, index) => {
  //     return { x: records[index].elapsed_time, y: item };
  //   });

  //   let obj = {};
  //   obj.key = key;
  //   obj.stream = originalStream;

  //   return obj;
  // });

  // let lowresStreams = streams.map((stream) => {
  //   if (stream.key !== "timestamp") {
  //     return { key: stream.key, stream: LTTB(stream.stream, 100) };
  //   } else {
  //     return [];
  //   }
  // });

  // console.log("asdf", records);
  let removeTimestamp = records.map((record) => {
    delete record.timestamp;
    delete record.left_right_balance;
    return { x: record.elapsed_time, y: 0, ...record };
  });

  let simplified = LTTB(removeTimestamp, resolution);

  console.log("simplified", simplified);

  const container = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div
      style={{ width: "100%", height: "400px" }}
      className="bg-white p-6 pb-2 rounded-md border"
    >
      <ResponsiveContainer debounce={0.2} height={"100%"}>
        <ComposedChart data={simplified} margin={{ top: 0 }}>
          <XAxis
            dataKey="elapsed_time"
            interval={"preserveEnd"}
            orientation={"bottom"}
            padding={{ left: 40 }}
            minTickGap={200}
            tickCount={4}
            tick={{ fontSize: 14 }}
            tickFormatter={(val) => {
              return toHHMMSS(val);
            }}
          />
          <Legend verticalAlign="top" height={56} />
          <YAxis
            dataKey={"power"}
            domain={[0, "auto"]}
            tickCount={5}
            axisLine={false}
            tickSize={0}
            unit=" W"
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
          <YAxis
            yAxisId="speed"
            dataKey={"speed"}
            tick={{ fontSize: 14 }}
            domain={[0, 80]}
            tickCount={5}
            axisLine={false}
            tickSize={0}
            hide={true}
            tickFormatter={(value) => Math.round(value * 1000)}
            unit=" m"
          />
          <YAxis
            yAxisId="cadence"
            dataKey={"cadence"}
            tick={{ fontSize: 14 }}
            domain={[0, 160]}
            tickCount={5}
            axisLine={false}
            tickSize={0}
            hide={true}
            tickFormatter={(value) => Math.round(value * 1000)}
            unit=" m"
          />
          <YAxis
            yAxisId="heart_rate"
            dataKey={"heart_rate"}
            tick={{ fontSize: 14 }}
            domain={[0, 220]}
            tickCount={5}
            axisLine={false}
            tickSize={0}
            hide={true}
            unit="bpm"
          />

          <Tooltip
            cursor={{ stroke: "black" }}
            content={<CustomTooltip />}
            isAnimationActive={false}
            payload={[{ name: "power", unit: "W" }]}
          />
          <CartesianGrid vertical={false} strokeDasharray="4" />
          <Line
            isAnimationActive={false}
            name="Power"
            type="monotone"
            dataKey="power"
            stroke={Tokens.power}
            unit={"W"}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            isAnimationActive={false}
            name="Speed"
            yAxisId="speed"
            type="monotone"
            dataKey="speed"
            stroke={Tokens.speed}
            dot={false}
            unit={"kph"}
            activeDot={{ r: 4 }}
          />
          <Line
            isAnimationActive={false}
            type="monotone"
            name="Heart rate"
            dataKey="heart_rate"
            yAxisId="heart_rate"
            stroke={Tokens.heartrate}
            dot={false}
            unit={"bpm"}
            activeDot={{ r: 4 }}
          />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="cadence"
            name="Cadence"
            yAxisId="cadence"
            stroke={Tokens.cadence}
            dot={false}
            unit={"bpm"}
            activeDot={{ r: 4 }}
          />
          <Area
            type="linear"
            yAxisId="altitude"
            name="Altitude"
            isAnimationActive={false}
            dataKey="altitude"
            stroke={"none"}
            fill={"rgba(0,0,0,0.2)"}
            dot={false}
            unit={"m"}
            activeDot={{ r: 4 }}
            tickFormatter={(val) => val * 1000}
          />
          <Brush
            style={{ borderColor: "red" }}
            alwaysShowText={false}
            travellerWidth={8}
            height={48}
            markerWidth={10}
            clip={true}
            onChange={handleBrushChange}
            tickFormatter={(val) => toHHMMSS(simplified[val].elapsed_time)}
          >
            <AreaChart data={data.records}>
              <Area
                type="linear"
                yAxisId="altitude"
                isAnimationActive={false}
                dataKey="altitude"
                stroke={"none"}
                fill={"rgba(0,0,0,0.2)"}
                dot={false}
                unit={"m"}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </Brush>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
