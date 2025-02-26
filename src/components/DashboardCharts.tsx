import React from 'react';
import { Card, Typography } from 'antd';
import { Column } from '@ant-design/charts';
import { DashboardSummary } from '@/lib/types';

const { Text } = Typography;

interface DashboardChartsProps {
  data: DashboardSummary;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  // Transform monthly data for the chart
  const columnData = data.monthlyData.flatMap((item) => [
    {
      month: item.month,
      value: item.emissions[0],
      type: 'Current',
    },
    {
      month: item.month,
      value: item.emissions[1],
      type: 'Target',
    },
  ]);

  const config = {
    data: columnData,
    isStack: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
      ],
    },
    color: ['#1890ff', '#52c41a'],
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    interactions: [
      {
        type: 'element-highlight',
      },
      {
        type: 'active-region',
      },
    ],
  };

  return (
    <Card bordered={false} className="card-background" style={{ height: '100%' }}>
      <Typography.Title level={5}>Émission de CO2 par mois</Typography.Title>
      <div style={{ height: 350 }}>
        <Column {...config} />
      </div>
    </Card>
  );
};

export default DashboardCharts;