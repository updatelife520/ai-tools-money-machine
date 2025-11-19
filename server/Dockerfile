FROM node:18-alpine

# 安装必要的系统依赖
RUN apk add --no-cache curl

# 创建应用目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建必要的目录
RUN mkdir -p data backups logs

# 设置权限
RUN chown -R node:node /app
USER node

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 启动应用
CMD ["npm", "start"]