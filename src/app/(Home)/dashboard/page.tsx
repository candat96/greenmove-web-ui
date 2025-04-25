/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import { Avatar as AntAvatar, Col, DatePicker, Row, Select, Table } from "antd";
import { Chart } from "./component/chart/Chart";
import ChartBottom from "./component/chartBottom/ChartBottom";
import locale from "antd/es/date-picker/locale/en_US";
import Chart2 from "./component/chart2/ChartBottom";
import DashboardTopLeft from "./component/DashboardTopLeft/DashboardTopLeft";
import { Up } from "@/assets/svg";
import axiosInstance from "@/services/axios";
import { APIResponse } from "@/services/types";

interface UserRanking {
  id: string;
  displayName: string;
  avatar: string | null;
  totalPoints: number;
  rank: number;
}

const Dashboard = () => {
  const [rankingData, setRankingData] = useState<UserRanking[]>([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(false);

  const fetchRankings = async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<object, APIResponse<UserRanking[]>>(
        '/user/public-rankings',
        {
          params: {
            period: selectedPeriod,
            limit: 10
          }
        }
      );
      
      if (response.statusCode === 200 && response.data) {
        setRankingData(response.data);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(period);
  }, [period]);

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 50,
      render: (rank) => {
        return <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <p>{rank}</p>
          <Up />
        </div>
      }
    },
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (name, record) => {
        return <div style={{
          display: "flex",
          alignItems: "center",
          gap: 20
        }}>
          <AntAvatar src={record.avatar} />
          {name || 'Unknown User'}
        </div>
      }
    },
    {
      title: 'Distance',
      dataIndex: 'totalTrips',
      key: 'totalTrips',
    },
    {
      title: 'Temps',
      dataIndex: 'totalTravelHours',
      key: 'totalTravelHours',
    },
    {
      title: 'CO2 consumption',
      dataIndex: 'totalCo2',
      key: 'totalCo2',
    },
    {
      title: 'Score',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      render: (score) => {
        return <div style={{
          color: "#10B981"
        }}>
          {score}
        </div>
      }
    },
  ];

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
        <ChartBottom />
      </div>
      <div className={styles["dashboard-bottom"]}>
        <div className={styles["group-header"]}>
          <h3>Eco Score</h3>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Select
              value={period}
              onChange={(value) => setPeriod(value)}
              style={{ width: 190 }}
              options={[
                {
                  label: "Month",
                  value: "month"
                },
                {
                  label: "Week",
                  value: "week"
                }
              ]}
            />
          </div>
        </div>
        <div>
          <Table 
            dataSource={rankingData.map(item => ({...item, key: item.id}))} 
            columns={columns} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
