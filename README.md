# AI工具导航站项目

## 📋 项目概述
AI工具导航站是一个精选优质AI工具的平台，帮助用户快速找到最适合的AI解决方案，提升工作效率。

## 🗂️ 项目结构
```
ai-tools-money-machine/
├── README.md                     # 项目说明文档
├── public/                       # 静态文件
│   ├── index.html               # 主页 - AI工具导航站
│   ├── admin.html               # 管理后台
│   └── assets/                  # 静态资源（图片、CSS等）
├── src/                          # 源代码
│   ├── components/              # 可复用组件
│   ├── pages/                   # 页面文件
│   ├── styles/                  # 样式文件
│   └── utils/                   # 工具函数
├── docs/                         # 项目文档
│   ├── api.md                   # API文档
│   ├── deployment.md            # 部署说明
│   └── development.md           # 开发指南
├── scripts/                      # 脚本文件
│   ├── deploy.sh                # 部署脚本
│   └── build.sh                 # 构建脚本
└── package.json                  # 项目依赖配置
```

## 🚀 功能特性

### 用户端功能
- 🤖 **AI工具推荐**: 智能推荐最适合的AI工具
- 🔍 **分类浏览**: 按应用场景分类浏览工具
- 📊 **使用统计**: 工具使用效果统计
- 🎯 **问题解决**: 针对具体问题推荐解决方案

### 管理端功能
- 💰 **收益统计**: 详细的收益数据分析
- 📈 **数据统计**: 用户行为和工具使用统计
- ⚙️ **系统管理**: 工具管理和系统配置
- 🔧 **自动化配置**: 自动化系统设置

## 🎯 业务模式
- **联盟营销**: 通过AI工具联盟链接获得佣金
- **自动化运营**: 24/7自动化工具推荐和收益追踪
- **数据驱动**: 基于用户行为优化推荐算法

## 📱 访问地址
- **主页**: `/public/index.html`
- **管理后台**: `/public/admin.html`

## 🛠️ 技术栈
- **前端**: HTML5, CSS3, JavaScript
- **样式**: Tailwind CSS, 自定义CSS
- **后端**: Node.js (API服务)
- **部署**: GitHub Pages + Vercel

## 📖 使用说明

### 开发环境设置
1. 克隆项目到本地
2. 安装依赖: `npm install`
3. 启动开发服务器: `npm run dev`

### 部署流程
1. 构建项目: `npm run build`
2. 部署到GitHub Pages: `npm run deploy`
3. 配置Vercel后端服务

## 🔧 配置说明

### 环境变量
- `API_BASE_URL`: API服务地址
- `AFFILIATE_ID`: 联盟营销ID
- `ANALYTICS_ID`: 统计分析ID

### 系统配置
- 自动更新时间: 每日凌晨2点
- 工具分类: 6大主要类别
- 佣金率: 最低10%

## 📞 联系方式
- 项目维护者: AI Assistant
- 技术支持: 通过管理后台联系
- 更新日志: 查看 `docs/changelog.md`

---

**注意**: 本项目遵循AI开发规范约束，确保代码质量和项目可维护性。