import React from 'react';
import { Row, Col, Card, Typography, Progress, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { DashboardSummary } from '@/lib/types';

const { Text, Title } = Typography;

interface DashboardCardsProps {
  data: DashboardSummary;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ data }) => {
  // Format the total emission value to display with commas and units
  const formatTotalEmission = (value: number) => {
    const millions = (value / 1000000).toFixed(2);
    return millions;
  };

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col span={8}>
        <Card bordered={false} className="card-background">
          <div style={{ textAlign: 'center' }}>
            <div className="progress-donut">
              <Progress
                type="circle"
                percent={100}
                width={180}
                strokeWidth={10}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={() => (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      {formatTotalEmission(data.totalEmission)}t
                    </div>
                    <Text type="secondary">Emission totale de CO2</Text>
                  </div>
                )}
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">15% restant à l'objectif prévisionnel</Text>
            </div>
          </div>
        </Card>
      </Col>
      
      <Col span={8}>
        <Card bordered={false} className="card-background">
          <Title level={5}>Moyenne par division</Title>
          <Statistic
            value={data.averageByDivision}
            suffix="tCO2e"
            valueStyle={{ color: '#3f8600', fontSize: '24px' }}
          />
          <Progress percent={65} showInfo={false} strokeColor="#3f8600" />
        </Card>
      </Col>
      
      <Col span={8}>
        <Card bordered={false} className="card-background">
          <Title level={5}>Emission équivalent à l'année précédente</Title>
          <Statistic
            value={data.averageByDivision}
            suffix="tCO2e"
            valueStyle={{ fontSize: '24px' }}
            prefix={data.yearlyComparison >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          />
          <Row>
            <Col span={12}>
              <Text type="secondary">Target</Text>
              <div>{data.targetProgress}%</div>
            </Col>
            <Col span={12}>
              <Text type="secondary">YoY</Text>
              <div style={{ color: data.yearlyComparison >= 0 ? '#e74c3c' : '#27ae60' }}>
                {data.yearlyComparison}%
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCards;