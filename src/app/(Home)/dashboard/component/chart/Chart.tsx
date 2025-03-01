import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/en_US";
import { Column } from "@ant-design/plots";
import ItemChart, { ItemProps } from "./item/ItemChart";

const { RangePicker } = DatePicker;

export const Chart = () => {
  const [dataChart2, setDataChart2] = useState<ItemProps[]>([]);

  const config = {
    data : dataMock,
    xField: "month",
    yField: "value",
    seriesField:'type',
    isStack: true,
    color: ['#93F0DA','#10B981','#3B82F6','#C4B5FD'],
    maxColumnWidth:80,
    legend: { visible: false }
  };

  useEffect(() => {
    setDataChart2([
      {
        title: "Délégation Déconstruction et Equipements de la Route",
        percent: 48,
        total: "12.13t",
        color: "#3B82F6",
      },
      {
        title: "Délégation Travaux Ferroviaires",
        percent: 28,
        total: "12.13t",
        color: "#10B981",
      },
      {
        title: "Délégation Terrassement,Traveaux maritimes",
        percent: 20,
        total: "12.13t",
        color: "#7EF6DE",
      },
      {
        title: "Sogea Environnement",
        percent: 5,
        total: "12.13t",
        color: "#C4B5FD",
      },
    ]);
  }, []);

  return (
    <div className={styles["wrap-chart"]}>
      <div className={styles["chart-top"]}>
        <h2>Emission de CO2 par délégation</h2>
        <RangePicker
          suffixIcon={false}
          picker="month"
          format="MMM"
          style={{ width: 190 }}
          locale={locale}
        />
      </div>
      <div className={styles["group-chart"]}>
        <h2>Emission de CO2 (tones)</h2>
        <Column className={styles["chart"]} {...config} />
      </div>
      <div className={styles["group-chart-2"]}>
        {dataChart2?.map((obj, index) => (
          <div key={index} className={styles["Item"]}>
            <ItemChart {...obj} />
          </div>
        ))}
      </div>
    </div>
  );
};
const dataMock = [
  { month: "Jan", value: 10, type: "Mr.pip" },
  { month: "Jan", value: 20, type: "Mr.pap" },
  { month: "Jan", value: 30, type: "Mr.pup" },
  { month: "Jan", value: 10, type: "Mr.hup" },

  { month: "Feb", value: 12, type: "Mr.pip" },
  { month: "Feb", value: 2, type: "Mr.pap" },
  { month: "Feb", value: 3, type: "Mr.pup" },
  { month: "Feb", value: 40, type: "Mr.hup" },

  { month: "Mar", value: 11, type: "Mr.pip" },
  { month: "Mar", value: 22, type: "Mr.pap" },
  { month: "Mar", value: 33, type: "Mr.pup" },
  { month: "Mar", value: 4, type: "Mr.hup" },

  { month: "Apr", value: 20, type: "Mr.pip" },
  { month: "Apr", value: 21, type: "Mr.pap" },
  { month: "Apr", value: 22, type: "Mr.pup" },
  { month: "Apr", value: 23, type: "Mr.hup" },

  { month: "May", value: 10, type: "Mr.pip" },
  { month: "May", value: 11, type: "Mr.pap" },
  { month: "May", value: 29, type: "Mr.pup" },
  { month: "May", value: 5, type: "Mr.hup" },
];
