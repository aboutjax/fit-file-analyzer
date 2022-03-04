import React from "react";
import dynamic from "next/dynamic";
import "uplot/dist/uPlot.min.css";

const uPlot = dynamic(() => import("uplot"), {
  ssr: false,
});
const UplotReact = dynamic(() => import("uplot-react"), {
  ssr: false,
});

import { Tokens } from "../styles/tokens";
import * as _ from "lodash";

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

export default function ChartUplot({ data }) {
  console.log(data);
  let records = data.records;
  let uniqueKeys = Object.keys(
    records.reduce(function (result, obj) {
      return Object.assign(result, obj);
    }, {})
  );

  let streams = uniqueKeys.map((key) => {
    let stream = _.map(records, key);
    let replaceUndefinedWithZeroStream = stream.map((item) => {
      if (item === undefined) {
        return 0;
      } else {
        return item;
      }
    });
    let originalStream = replaceUndefinedWithZeroStream.map((item, index) => {
      return item;
    });

    let obj = {};
    obj.key = key;
    obj.stream = originalStream;

    return obj;
  });

  console.log(streams);

  const uplotData = [
    streams[0].stream,
    streams[14].stream,
    streams[15].stream,
    streams[9].stream,
    streams[6].stream,
    streams[7].stream,
  ];
  console.log(uplotData);
  const options = {
    title: "Activity Chart",
    width: 900,
    height: 200,
    series: [
      {
        label: "Time",
      },
      {
        label: "Heart rate",
        points: { show: false },
        stroke: "red",
      },
      {
        label: "Cadence",
        points: { show: false },
        stroke: "purple",
      },
      {
        label: "Power",
        points: { show: false },
        stroke: "orange",
      },
      {
        label: "Speed",
        points: { show: false },
        stroke: "blue",
      },
      {
        label: "Altitude",
        points: { show: false },
        stroke: "black",
      },
    ],
    scales: { x: { time: true } },
  };

  return (
    <UplotReact
      options={options}
      data={uplotData}
      //   target={target}
      onCreate={(chart) => {}}
      onDelete={(chart) => {}}
    />
  );
}
