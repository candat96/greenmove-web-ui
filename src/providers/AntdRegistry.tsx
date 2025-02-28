import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import theme from './AntdConfig';
import viVN from 'antd/locale/vi_VN';

const AntdProvider = ({ children }: React.PropsWithChildren) => {

  return (
    <AntdRegistry>
      <ConfigProvider theme={theme} locale={viVN}>
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
};

export default AntdProvider;