import React from "react";
import { Line } from "@ant-design/plots";
import styles from "./style.module.scss";

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

const ChartBottom = () => {
  const data = [
    { month: "Jan", value: getRandomNumber(), type: "Emission totales" },
    { month: "Fed", value: getRandomNumber(), type: "Emission totales" },
    { month: "Mar", value: getRandomNumber(), type: "Emission totales" },
    { month: "Apr", value: getRandomNumber(), type: "Emission totales" },
    { month: "May", value: getRandomNumber(), type: "Emission totales" },

    { month: "Jan", value: getRandomNumber(), type: "Par avion" },
    { month: "Fed", value: getRandomNumber(), type: "Par avion" },
    { month: "Mar", value: getRandomNumber(), type: "Par avion" },
    { month: "Apr", value: getRandomNumber(), type: "Par avion" },
    { month: "May", value: getRandomNumber(), type: "Par avion" },

    {
      month: "Jan",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },
    {
      month: "Fed",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },
    {
      month: "Mar",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },
    {
      month: "Apr",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },
    {
      month: "May",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },

    {
      month: "Jan",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },
    {
      month: "Fed",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },
    {
      month: "Mar",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },
    {
      month: "Apr",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },
    {
      month: "May",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },

    { month: "Jan", value: getRandomNumber(), type: "Par covoiturage" },
    { month: "Fed", value: getRandomNumber(), type: "Par covoiturage" },
    { month: "Mar", value: getRandomNumber(), type: "Par covoiturage" },
    { month: "Apr", value: getRandomNumber(), type: "Par covoiturage" },
    { month: "May", value: getRandomNumber(), type: "Par covoiturage" },
  ];

  const config = {
    data,
    xField: "month",
    yField: "value",
    seriesField: "type",
    legend: { visible: false },
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    color: ["#010101", "#FF1C1C", "#FF992C", "#82EB99", "#0E5F12"], // Giữ nguyên các màu
  };

  return (
    <div className={styles["warp-chart"]}>
      <div className={styles["chart"]}>
        <h2 className={styles["chart-title-vertical"]}>Emission de CO2 (tones)</h2>
        <Line {...config} style={{height: 300}} />
      </div>
      <div className={styles["group-type"]}>
        <p className={styles["type"]}>
          <span className={styles["dot"]} style={{ backgroundColor: "#010101" }}></span>
          <span>Emission totales</span>
        </p>
        <p className={styles["type"]}>
          <span className={styles["dot"]} style={{ backgroundColor: "#FF1C1C" }}></span>
          <span>Par avion</span>
        </p>
        <p className={styles["type"]}>
          <span className={styles["dot"]} style={{ backgroundColor: "#FF992C" }}></span>
          <span>Par voiture individuelle</span>
        </p>
        <p className={styles["type"]}>
          <span className={styles["dot"]} style={{ backgroundColor: "#82EB99" }}></span>
          <span>Par transport en commun</span>
        </p>
        <p className={styles["type"]}>
          <span className={styles["dot"]} style={{ backgroundColor: "#0E5F12" }}></span>
          <span>Par covoiturage</span>
        </p>
      </div>
    </div>
  );
};

export default ChartBottom;