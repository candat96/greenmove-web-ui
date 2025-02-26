import React from 'react';
import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import { Providers } from './providers';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CO2 Emissions Dashboard',
  description: 'Track and manage CO2 emissions across your organization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#004b93',
                colorSuccess: '#27ae60',
                colorWarning: '#f39c12',
                colorError: '#e40046',
                borderRadius: 4,
              },
              components: {
                Layout: {
                  headerBg: '#fff',
                  siderBg: '#001529',
                },
              },
            }}
          >
            {children}
          </ConfigProvider>
        </Providers>
      </body>
    </html>
  );
}