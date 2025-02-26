import React from 'react';
import { Card, Typography, Progress, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DelegationEmission } from '@/lib/types';

const { Text, Title } = Typography;

interface EmissionsTableProps {
  data: DelegationEmission[];
}

const EmissionsTable: React.FC<EmissionsTableProps> = ({ data }) => {
  // Generate a color based on the percentage value
  const getProgressColor = (percentage: number) => {
    if (percentage > 30) return '#e74c3c';
    if (percentage > 20) return '#f39c12';
    return '#27ae60';
  };

  const columns: ColumnsType<DelegationEmission> = [
    {
      title: 'Délégation',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage, record) => (
        <div>
          <Progress 
            percent={percentage} 
            showInfo={false} 
            strokeColor={getProgressColor(percentage)}
            style={{ marginBottom: 5 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>{percentage}%</Text>
            <Text>{record.co2Value.toFixed(1)} t CO2e</Text>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card bordered={false} className="card-background" style={{ height: '100%' }}>
      <Title level={5}>Émission par délégation</Title>
      <Table 
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        showHeader={false}
        size="small"
      />
      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <a href="#">Voir plus</a>
      </div>
    </Card>
  );
};

export default EmissionsTable;