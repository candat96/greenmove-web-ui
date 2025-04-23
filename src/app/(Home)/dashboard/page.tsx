/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import styles from "./style.module.scss";
import { Col, DatePicker, Row, Select } from "antd";
import { Chart } from "./component/chart/Chart";
import ChartBottom from "./component/chartBottom/ChartBottom";
import locale from "antd/es/date-picker/locale/en_US";
import Chart2 from "./component/chart2/ChartBottom";
import DashboardTopLeft from "./component/DashboardTopLeft/DashboardTopLeft";

const { RangePicker } = DatePicker;
const Dashboard = () => {
  return (
    <div className={styles["wrap-dashboard"]}>
      <div className={styles["dashboard-top"]}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <DashboardTopLeft />
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
        <div className={styles["group-header"]}>
          <h3>Répartition de votre mobilité</h3>
          <div style={{display: 'flex', gap: 10}}>
          <RangePicker
            suffixIcon={false}
            picker="month"
            format="MMM"
            style={{ width: 190 }}
            locale={locale}
          />
           <Select
            options={[]}
            style={{ minWidth: 190 }}
          />
          </div>
         
        </div>
        <div>
          <Chart2 />
        </div>
      </div>
      <div className={styles["dashboard-bottom"]}>
        <div className={styles["group-header"]}>
          <h3>Émission de carbone par type de transport</h3>
          <RangePicker
            suffixIcon={false}
            picker="month"
            format="MMM"
            style={{ width: 190 }}
            locale={locale}
          />
        </div>
        <div>
          <ChartBottom />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
