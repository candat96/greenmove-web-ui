"use client";

import React from "react";
import styles from "./styles.module.scss";
import locale from "antd/es/date-picker/locale/en_US";
import { DatePicker, Pagination, Table } from "antd";
import { Plus } from "@/assets/svg";
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "Index",
    dataIndex: "name",
    key: "name",
    render: (value,record,idx) => {
      console.log(`idx`, idx);
      return  <>{idx?.toString()}</>
    },
  },
  {
    title: "Company name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "CO2 consumption",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Target",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Exceed the limit",
    key: "tags",
    dataIndex: "tags",
  },
];
const data = [
  {
    key: "1",
    name: "Deepcare 1",
    age: "12,000,000 t",
    address: "6,000,000 t",
    tags: "6,000,000 t",
  },
  {
    key: "2",
    name: "Deepcare 2",
    age: "12,000,000 t",
    address: "6,000,000 t",
    tags: "6,000,000 t",
  },
  {
    key: "1",
    name: "Deepcare 2",
    age: "12,000,000 t",
    address: "6,000,000 t",
    tags: "6,000,000 t",
  },
  
];

const Companies = () => {
  return (
    <div className={styles["wrap-companies"]}>
      <div className={styles["wrap-header"]}>
        <h2>List of companies</h2>
        <div className={styles["header-left"]}>
          <RangePicker
            suffixIcon={false}
            picker="month"
            format="MMM"
            style={{ width: 190 }}
            locale={locale}
          />
          <p className={styles["header-add"]} style={{cursor:"pointer"}}>
            <Plus />
            Add new company
          </p>
        </div>
      </div>
      <div className={styles["wrap-body"]}>
        <Table className={styles["table"]} columns={columns} dataSource={data} pagination={false} />
        {/* <Pagination align="center" defaultCurrent={1} total={50} style={{marginTop: "20px"}} /> */}

      </div>
    </div>
  );
};

export default Companies;
