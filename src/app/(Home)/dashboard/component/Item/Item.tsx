import React from "react";
import styles from "./style.module.scss";
import { AroundDown, AroundUp } from "@/assets/svg";

export type ItemType = {
  header: string;
  total: string;
  percent: number;
  increase: boolean;
  unit: string;
};
const Item = (prop: ItemType) => {
  const { header, total, percent, increase, unit } = prop;
  return (
    <div className={styles["item"]}>
      <h2>{header}</h2>
      <div className={styles["item-left"]}>
        <h3>
          {total} <span>{unit}</span>
        </h3>

        {/* {increase ? (
          <h5>
            <AroundUp /> {percent} %
          </h5>
        ) : (
          <h4>
            <AroundDown /> {percent} %
          </h4>
        )} */}
      </div>
    </div>
  );
};

export default Item;
