import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import theme from './AntdConfig';
import frFR from 'antd/locale/fr_FR';

const AntdProvider = ({ children }: React.PropsWithChildren) => {

  return (
    <AntdRegistry>
      <ConfigProvider theme={theme} locale={frFR}>
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
};

export default AntdProvider;