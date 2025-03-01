import React from "react";
import styles from "./style.module.scss";
import { Flag } from "@/assets/svg";

export type ItemProps = {
  title: string;
  percent: number;
  total: string;
  color: string;
};

const ItemChart = (prop: ItemProps) => {
  const { title, percent, total, color } = prop;
  const Highest = percent > 40;
  const Lowest = percent <= 5;
  return (
    <div className={styles["item"]}>
      <div className={styles["bg"]} style={{ width: `${percent}%` }}></div>
      <div className={styles["content"]}>
        <div className={styles["left"]}>
          <p
            className={styles["dot"]}
            style={{ backgroundColor: color || "red" }}
          ></p>
          <h2>{title}</h2>
        </div>
        <div className={styles["right"]}>
          {Lowest ? <Flag /> : ""}
          <p
            className={styles["right-1"]}
            style={{
              backgroundColor: Highest ? "#F07384" : Lowest ? "#10B981" : "",
            }}
          >
            {Highest ? "Highest" : Lowest ? "Lowest" : ""}
          </p>
          <p className={styles["right-2"]}>{percent}%</p>
          <p className={styles["right-3"]}>{total} CO2e</p>
        </div>
      </div>
    </div>
  );
};

export default ItemChart;
