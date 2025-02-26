import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Determine selected keys based on pathname
  const selectedKeys = React.useMemo(() => {
    if (pathname === '/dashboard') return ['1'];
    if (pathname === '/companies') return ['2'];
    return ['1']; // Default to dashboard
  }, [pathname]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={220}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="logo p-4 flex justify-center">
        <Image
          src="/images/logo.png"
          alt="Vinci"
          width={collapsed ? 40 : 120}
          height={32}
          priority
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        selectedKeys={selectedKeys}
        className="sidebar-menu"
        items={[
          {
            key: '1',
            icon: <DashboardOutlined />,
            label: <Link href="/dashboard">Tableau de bord</Link>,
          },
          {
            key: '2',
            icon: <TeamOutlined />,
            label: <Link href="/companies">Companies</Link>,
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;