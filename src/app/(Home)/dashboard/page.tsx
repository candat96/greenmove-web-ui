"use client";
import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { Col, DatePicker, Row } from "antd";
import Image from "next/image";
import { BackGroundCo2 } from "@/assets/img";
import { AroundDown } from "@/assets/svg";
import Item, { ItemType } from "./component/Item/Item";
import { Chart } from "./component/chart/Chart";
import ChartBottom from "./component/chartBottom/ChartBottom";
import locale from "antd/es/date-picker/locale/en_US";

const { RangePicker } = DatePicker;
const Dashboard = () => {
  const [listItem, setList] = useState<ItemType[]>([]);
  useEffect(() => {
    setList([
      {
        header: "Moyenne  par délégation",
        total: "2,399t",
        percent: 10,
        increase: false,
      },
      {
        header: "Émission dépassant la limite fixée",
        total: "2,399t",
        percent: 10,
        increase: true,
      },
      {
        header: "Total cible",
        total: "2,399t",
        percent: 10,
        increase: false,
      },
    ]);
  }, []);

  return (
    <div className={styles["wrap-dashboard"]}>
      <div className={styles["dashboard-top"]}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <div className={styles["dashboard-top__left"]}>
              <div className={styles["left-top"]}>
                <h2>Tableau de bord</h2>
                <Image
                  className={styles.co2}
                  src={BackGroundCo2}
                  alt="Decor Red"
                  priority
                />

                <div className={styles["left-top-des"]}>
                  <p className={styles["des-1"]}>CO2e</p>
                  <h2 className={styles["des-2"]}>2,294,344t</h2>
                  <h3 className={styles["des-3"]}>Émission totale de CO2</h3>
                  <div className={styles["des-4"]}>
                    <AroundDown />
                    <p>12%</p>
                    <p>Inférieur à l'année précédente</p>
                  </div>
                </div>
              </div>
              <div className={styles["left-list"]}>
                {listItem?.map((obj, index) => (
                  <div key={index}>
                    <Item {...obj} />
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles["dashboard-top__right"]}>
              <div className={styles["right-top"]}>
                <Chart />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles["dashboard-bottom"]}>
        <div className={styles["group-header"]}><h3>Émission de carbone par type de transport</h3>  <RangePicker
          suffixIcon={false}
          picker="month"
          format="MMM"
          style={{ width: 190 }}
          locale={locale}
        /></div>
       <div>
       <ChartBottom />
       </div>
      </div>
    </div>
  );
};

export default Dashboard;
