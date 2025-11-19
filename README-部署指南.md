# 🚀 AI工具导航站 - 完整部署指南

## 📋 部署概述

本项目采用**前后端分离架构**，支持多种部署方式，确保**完全脱离本地电脑**后仍能全自动运行。

### 🏗️ 架构组成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (React)   │    │   后端 (Node.js) │    │   数据存储      │
│   GitHub Pages   │◄──►│   Vercel API    │◄──►│   文件系统      │
│   静态托管       │    │   Serverless    │    │   自动备份      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN加速       │    │   自动爬虫      │    │   监控告警      │
│   全球分发       │    │   社交发布      │    │   健康检查      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 部署方案

### 方案一：推荐方案（零成本）

#### 前端部署：GitHub Pages
```bash
# 1. 推送代码到GitHub
git add .
git commit -m "部署AI工具导航站"
git push origin main

# 2. 启用GitHub Pages
# Settings → Pages → Source: Deploy from a branch → Branch: main
```

#### 后端部署：Vercel Serverless
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 部署API服务
cd server
vercel --prod

# 3. 配置环境变量
vercel env add PRODUCT_HUNT_TOKEN
vercel env add TWITTER_API_KEY
# ... 其他环境变量
```

### 方案二：Docker容器化部署

#### 构建镜像
```bash
# 构建前端镜像
docker build -t ai-tools-frontend -f deploy/Dockerfile .

# 构建后端镜像
docker build -t ai-tools-api -f server/Dockerfile ./server
```

#### 使用Docker Compose
```bash
# 启动完整系统
cd deploy
docker-compose up -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 方案三：云服务器部署

#### 服务器要求
- **CPU**: 1核心以上
- **内存**: 1GB以上
- **存储**: 20GB以上
- **系统**: Ubuntu 20.04+ / CentOS 8+

#### 部署脚本
```bash
#!/bin/bash
# deploy.sh - 一键部署脚本

# 更新系统
apt update && apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 安装PM2
npm install -g pm2

# 克隆项目
git clone https://github.com/yourusername/ai-tools-money-machine.git
cd ai-tools-money-machine

# 安装依赖
npm install
cd server && npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，填入API密钥

# 启动服务
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 🔧 配置说明

### 环境变量配置
```bash
# 复制环境变量模板
cp server/.env.example server/.env

# 必须配置的变量
NODE_ENV=production
PORT=3001

# API密钥（申请地址见下方）
PRODUCT_HUNT_TOKEN=your_token
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
```

### API密钥申请地址

| 服务 | 申请地址 | 用途 |
|------|----------|------|
| Product Hunt | https://api.producthunt.com/v2/docs | 爬取AI工具 |
| Twitter | https://developer.twitter.com | 自动发布 |
| LinkedIn | https://developer.linkedin.com | 职场发布 |
| Impact Radius | https://impact.com/ | 联盟链接 |
| ShareASale | https://www.shareasale.com/ | 联盟营销 |

## 🤖 自动化配置

### GitHub Actions自动部署
```yaml
# 文件位置：.github/workflows/deploy.yml
# 已配置，推送代码自动触发部署
```

### 定时任务配置
```javascript
// server/api/index.js 中的定时任务
cron.schedule('0 */6 * * *', crawlNewTools);     // 每6小时爬取
cron.schedule('0 */4 * * *', autoSocialPosting); // 每4小时发布
cron.schedule('0 2 * * *', backupData);          // 每天备份
```

## 📊 监控和维护

### 健康检查
```bash
# 检查API状态
curl https://your-api-url.vercel.app/health

# 检查前端状态
curl https://yourusername.github.io/ai-tools-money-machine
```

### 日志查看
```bash
# Vercel日志
vercel logs

# PM2日志（云服务器）
pm2 logs

# Docker日志
docker-compose logs -f api
```

### 数据备份
```bash
# 手动备份
curl -X POST https://your-api-url.vercel.app/api/backup

# 自动备份（每天凌晨2点）
# 已在代码中配置定时任务
```

## 🚀 验证部署

### 1. 访问测试
```bash
# 前端访问
https://yourusername.github.io/ai-tools-money-machine

# API测试
curl https://your-api-url.vercel.app/api/tools
```

### 2. 功能测试
- ✅ 工具列表加载
- ✅ 分类筛选
- ✅ 点击追踪
- ✅ 收益统计
- ✅ 自动爬虫
- ✅ 社交发布

### 3. 性能测试
```bash
# 使用Lighthouse测试性能
npx lighthouse https://your-website-url --output html

# API压力测试
npm install -g artillery
artillery run load-test.yml
```

## 🎯 部署后检查清单

### ✅ 基础检查
- [ ] 前端页面正常访问
- [ ] API接口响应正常
- [ ] 数据库连接成功
- [ ] 环境变量配置正确

### ✅ 功能检查
- [ ] 工具数据加载
- [ ] 用户点击追踪
- [ ] 联盟链接跳转
- [ ] 收益统计显示

### ✅ 自动化检查
- [ ] 定时爬虫运行
- [ ] 社交媒体发布
- [ ] 数据自动备份
- [ ] 健康检查正常

### ✅ 监控检查
- [ ] 错误日志监控
- [ ] 性能指标监控
- [ ] 收益数据监控
- [ ] 用户行为分析

## 🆘 故障排除

### 常见问题

#### 1. API部署失败
```bash
# 检查package.json配置
# 确认vercel.json配置正确
# 验证环境变量设置
```

#### 2. 前端访问404
```bash
# 检查GitHub Pages设置
# 确认build目录存在
# 验证homepage配置
```

#### 3. 爬虫不工作
```bash
# 检查API密钥有效性
# 确认网络连接正常
# 查看错误日志详情
```

### 紧急恢复
```bash
# 快速回滚到上一个版本
git revert HEAD
git push origin main

# 重新部署
vercel --prod
```

## 📞 技术支持

### 监控告警
- **Sentry**: 错误监控
- **UptimeRobot**: 可用性监控
- **Grafana**: 性能监控

### 联系方式
- **GitHub Issues**: 技术问题反馈
- **Email**: support@ai-tools-money-machine.com
- **Discord**: 社区技术支持

---

## 🎉 部署成功！

部署完成后，你的AI工具导航站将实现：

✅ **24/7全自动运行**
✅ **零维护成本**
✅ **实时收益追踪**
✅ **智能内容更新**
✅ **多渠道分发**

**访问地址**: https://yourusername.github.io/ai-tools-money-machine
**API地址**: https://your-api-url.vercel.app
**管理面板**: https://your-api-url.vercel.app/admin

🚀 **现在你可以完全脱离本地电脑，享受全自动被动收益！**