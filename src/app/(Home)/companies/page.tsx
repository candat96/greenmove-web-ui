"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";
import locale from "antd/es/date-picker/locale/en_US";
import { DatePicker, Pagination, Table, Input } from "antd";
import { Plus } from "@/assets/svg";
import { useCompany } from "./useCompany";

const { RangePicker } = DatePicker;
const { Search } = Input;

const columns = [
  {
    title: "Index",
    key: "index",
    render: (_, __, index) => index + 1,
    width: 80,
  },
  {
    title: "Nom de l'entreprise",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Consommation de CO2",
    dataIndex: "totalCo2",
    key: "totalCo2",
    render: (value) => {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} t`;
      }
      return `${value} kg`;
    },
  },
  {
    title: "Distance Totale",
    dataIndex: "totalDistance",
    key: "totalDistance",
    render: (value) => `${value} km`,
  },
  {
    title: "Durée Totale",
    dataIndex: "totalDuration",
    key: "totalDuration",
    render: (value) => {
      if (value >= 60) {
        return `${(value / 60).toFixed(2)} heures`;
      }
      return `${value} minutes`;
    },
  },
  {
    title: "Nombre de Trajets",
    dataIndex: "totalTrips",
    key: "totalTrips",
  },
];

const Companies = () => {
  const { companies, pagination, search, setSearch, loading, fetchData, onChangePagination } = useCompany();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0].format('YYYY-MM'), dates[1].format('YYYY-MM')]);
    } else {
      setDateRange(null);
    }
  };

  return (
    <div className={styles["wrap-companies"]}>
      <div className={styles["wrap-header"]}>
        <h2>Liste des entreprises</h2>
        <div className={styles["header-left"]}>
          {/* <Search
            placeholder="Rechercher une entreprise"
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <RangePicker
            suffixIcon={false}
            picker="month"
            format="MMM YYYY"
            style={{ width: 190 }}
            locale={locale}
            onChange={handleDateChange}
          />
          <p className={styles["header-add"]} style={{cursor:"pointer"}}>
            <Plus />
            Ajouter une nouvelle entreprise
          </p> */}
        </div>
      </div>
      <div className={styles["wrap-body"]}>
        <Table 
          className={styles["table"]} 
          columns={columns} 
          dataSource={companies} 
          rowKey="id"
          loading={loading}
          pagination={false} 
        />
        {/* {pagination && (
          <Pagination 
            align="center" 
            current={pagination.page} 
            pageSize={pagination.limit}
            total={pagination.total} 
            onChange={onChangePagination}
            style={{marginTop: "20px"}} 
          />
        )} */}
      </div>
    </div>
  );
};

export default Companies;

