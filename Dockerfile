# Stage 1: Build stage
FROM node:20-alpine AS build

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json* ./

# Cài đặt dependencies
RUN npm i

# Sao chép source code
COPY . .

# Build ứng dụng
RUN npm run build -- --no-lint

# Stage 2: Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Tạo người dùng không phải root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Sao chép các file cần thiết
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

# Sao chép thư mục build
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Chuyển đổi sang người dùng không phải root
USER nextjs

# Mở cổng 3000
EXPOSE 3000

# Đặt biến môi trường
ENV PORT 3000
ENV NODE_ENV production

# Chạy ứng dụng
CMD ["node", "server.js"]