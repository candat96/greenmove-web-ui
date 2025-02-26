'use client';

import React from 'react';
import { Layout, Row, Col, Typography, DatePicker, Select } from 'antd';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AppHeader from '@/components/AppHeader';
import DashboardCards from '@/components/DashboardCards';
import DashboardCharts from '@/components/DashboardCharts';
import EmissionsTable from '@/components/EmissionsTable';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

// Mock data for demonstration
const dashboardData = {
  totalEmission: 2294344,
  averageByDivision: 2399,
  targetProgress: 15,
  yearlyComparison: -5,
  monthlyData: [
    { month: 'Jan', emissions: [250, 150] },
    { month: 'Feb', emissions: [280, 170] },
    { month: 'Mar', emissions: [300, 190] },
    { month: 'Apr', emissions: [200, 120] },
    { month: 'May', emissions: [180, 100] },
    { month: 'Jun', emissions: [170, 90] },
    { month: 'Jul', emissions: [150, 80] },
    { month: 'Aug', emissions: [140, 75] },
    { month: 'Sep', emissions: [130, 70] },
    { month: 'Oct', emissions: [140, 75] },
    { month: 'Nov', emissions: [150, 80] },
    { month: 'Dec', emissions: [160, 90] },
  ],
  delegations: [
    { id: 1, name: 'Single Environment', percentage: 43, co2Value: 1031.57 },
    { id: 2, name: 'Délégation Démantèlement et Équipements de la Route', percentage: 20, co2Value: 479.8 },
    { id: 3, name: 'Délégation Travaux Autoroutiers', percentage: 18, co2Value: 431.82 },
    { id: 4, name: 'Délégation Terrassement Travaux maritimes', percentage: 11, co2Value: 263.89 },
    { id: 5, name: 'Réseaux France', percentage: 8, co2Value: 191.92 },
  ]
};

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/');
  }

  // Handle loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 220 }}>
        <AppHeader />
        <Content style={{ margin: '24px 16px', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#f5f5f5', minHeight: 360 }}>
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col>
                <Title level={4}>Emission de CO2 par délégation</Title>
              </Col>
              <Col>
                <Row gutter={16}>
                  <Col>
                    <Select defaultValue="division" style={{ width: 120 }}>
                      <Option value="division">Division</Option>
                      <Option value="all">All</Option>
                    </Select>
                  </Col>
                  <Col>
                    <Select defaultValue="eco-conception" style={{ width: 150 }}>
                      <Option value="eco-conception">Eco-Conception</Option>
                      <Option value="all">All</Option>
                    </Select>
                  </Col>
                  <Col>
                    <DatePicker picker="month" />
                  </Col>
                </Row>
              </Col>
            </Row>
            
            <DashboardCards data={dashboardData} />
            
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={16}>
                <DashboardCharts data={dashboardData} />
              </Col>
              <Col span={8}>
                <EmissionsTable data={dashboardData.delegations} />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}