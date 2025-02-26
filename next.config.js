/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@ant-design/icons', 'antd', 'rc-util', 'rc-pagination', 'rc-picker']
};

module.exports = nextConfig;