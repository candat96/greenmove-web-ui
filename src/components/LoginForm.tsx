import React from 'react';
import { Card, Button, Typography, Divider } from 'antd';
import { WindowsOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const handleMicrosoftLogin = () => {
    signIn('azure-ad', { callbackUrl: '/dashboard' });
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5' 
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Image 
            src="/images/logo.png" 
            alt="Vinci Logo" 
            width={180} 
            height={50} 
            priority
          />
        </div>
        
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          CO2 Emissions Dashboard
        </Title>
        
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Sign in to access your dashboard and track CO2 emissions
        </Text>
        
        <Button 
          type="primary" 
          icon={<WindowsOutlined />} 
          size="large" 
          block 
          onClick={handleMicrosoftLogin}
          style={{ height: '44px' }}
        >
          Sign in with Microsoft
        </Button>
        
        <Divider plain>
          <Text type="secondary">Secure login powered by Microsoft Entra ID</Text>
        </Divider>
        
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: '12px' }}>
          If you have any issues logging in, please contact your administrator
        </Text>
      </Card>
    </div>
  );
};

export default LoginForm;