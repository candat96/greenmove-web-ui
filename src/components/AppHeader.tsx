import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Determine current page title
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/companies') return 'Companies';
    return 'Dashboard';
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: 'Settings',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => signOut(),
    },
  ];

  return (
    <Header
      style={{
        background: 'white',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
      }}
    >
      <div>
        <Text strong style={{ fontSize: '18px' }}>{getPageTitle()}</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Space>
          <Text>{session?.user?.name}</Text>
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <Avatar 
              style={{ cursor: 'pointer', backgroundColor: '#004b93' }}
              icon={<UserOutlined />} 
              src={session?.user?.image}
            />
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;