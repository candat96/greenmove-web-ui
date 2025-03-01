import React from "react";
import { Line } from "@ant-design/plots";
import styles from "./style.module.scss";

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

const ChartBottom = () => {
  const data = [
    { month: "1991", value: getRandomNumber(), type: "Emission totales" },
    { month: "1992", value: getRandomNumber(), type: "Emission totales" },
    { month: "1993", value: getRandomNumber(), type: "Emission totales" },
    { month: "1994", value: getRandomNumber(), type: "Emission totales" },
    { month: "1995", value: getRandomNumber(), type: "Emission totales" },

    { month: "1991", value: getRandomNumber(), type: "Par avion" },
    { month: "1992", value: getRandomNumber(), type: "Par avion" },
    { month: "1993", value: getRandomNumber(), type: "Par avion" },
    { month: "1994", value: getRandomNumber(), type: "Par avion" },
    { month: "1995", value: getRandomNumber(), type: "Par avion" },

    {
      month: "1991",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },
    {
      month: "1992",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },
    {
      month: "1993",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },
    {
      month: "1994",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },
    {
      month: "1995",
      value: getRandomNumber(),
      type: "Par voiture individuelle",
    },

    {
      month: "1991",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },
    {
      month: "1992",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },
    {
      month: "1993",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },
    {
      month: "1994",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },
    {
      month: "1995",
      value: getRandomNumber(),
      type: "Par transport en commun",
    },

    { month: "1991", value: getRandomNumber(), type: "Par covoiturage" },
    { month: "1992", value: getRandomNumber(), type: "Par covoiturage" },
    { month: "1993", value: getRandomNumber(), type: "Par covoiturage" },
    { month: "1994", value: getRandomNumber(), type: "Par covoiturage" },
    { month: "1995", value: getRandomNumber(), type: "Par covoiturage" },
  ];

  const config = {
    data,
    xField: "month",
    yField: "value",
    seriesField: "type",
    legend: false, // Đã bỏ legend để sử dụng custom legend bên dưới
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