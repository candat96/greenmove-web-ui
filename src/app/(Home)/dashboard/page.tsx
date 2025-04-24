/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import styles from "./style.module.scss";
import { Avatar, Col, DatePicker, Row, Select, Table } from "antd";
import { Chart } from "./component/chart/Chart";
import ChartBottom from "./component/chartBottom/ChartBottom";
import locale from "antd/es/date-picker/locale/en_US";
import Chart2 from "./component/chart2/ChartBottom";
import DashboardTopLeft from "./component/DashboardTopLeft/DashboardTopLeft";
import { renderText } from "chart.js/helpers";
import { Up } from "@/assets/svg";

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Rank',
    dataIndex: 'name',
    key: 'name',
    width: 50,
    render:() => {
      return <div style={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
      }}>
        <p>1</p>
        <Up/>
      </div>
    }
  },
  {
    title: 'Name',
    dataIndex: 'age',
    key: 'age',
    render:() => {
      return <div style={{
        display:"flex",
        alignItems:"center",
        gap: 20
      }}>
        <p><Avatar/></p>
       Anh đạt họ cấn
      </div>
    }
  },
  {
    title: 'Distance',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Temps',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'CO2 consumption',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Score',
    dataIndex: 'address',
    render:(value) => {
      return <div style={{
      color:"#10B981"
      }}>
      {value}
      </div>
    }
  },
];

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
        <Chart2 />
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
      <div className={styles["dashboard-bottom"]}>
        <div className={styles["group-header"]}>
         
         <h3>Eco Score</h3>
         <div style={{ display:"flex", gap: 20}}>
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
            placeholder="Chọn công ty"
          />
         </div>
        </div>
        <div>
        <Table dataSource={dataSource} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
