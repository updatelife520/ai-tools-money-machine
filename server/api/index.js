const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 数据存储（生产环境建议使用数据库）
let dataStore = {
  tools: [],
  analytics: {
    clicks: [],
    conversions: [],
    revenue: 0,
    dailyStats: {}
  },
  config: {
    affiliateNetworks: {},
    autoCrawl: true,
    socialPosting: true
  }
};

// 初始化数据
async function initializeData() {
  try {
    const toolsData = await fs.readFile(path.join(__dirname, '../data/tools.json'), 'utf8');
    dataStore.tools = JSON.parse(toolsData);
    console.log('✅ 工具数据加载成功');
  } catch (error) {
    console.log('📝 初始化工具数据...');
    await initializeDefaultTools();
  }
}

// 默认工具数据
async function initializeDefaultTools() {
  const defaultTools = [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'OpenAI开发的强大AI对话助手',
      category: '对话AI',
      type: 'freemium',
      pricing: '免费/Plus $20/月',
      url: 'https://chat.openai.com',
      affiliateUrl: 'https://chat.openai.com?affiliate=yourcode',
      commission: 10,
      features: ['智能对话', '代码生成', '文本创作', '多语言支持'],
      tags: ['对话', '写作', '编程'],
      active: true
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      description: '顶级AI图像生成工具',
      category: '图像AI',
      type: 'paid',
      pricing: '$10-60/月',
      url: 'https://midjourney.com',
      affiliateUrl: 'https://midjourney.com?affiliate=yourcode',
      commission: 15,
      features: ['图像生成', '艺术创作', '照片修复', '风格转换'],
      tags: ['图像', '设计', '艺术'],
      active: true
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'Anthropic开发的安全AI助手',
      category: '对话AI',
      type: 'freemium',
      pricing: '免费/Pro $20/月',
      url: 'https://claude.ai',
      affiliateUrl: 'https://claude.ai?affiliate=yourcode',
      commission: 12,
      features: ['长文本处理', '代码分析', '学术写作', '安全对话'],
      tags: ['对话', '分析', '写作'],
      active: true
    }
  ];

  dataStore.tools = defaultTools;
  await saveToolsData();
}

// 保存工具数据
async function saveToolsData() {
  await fs.writeFile(
    path.join(__dirname, '../data/tools.json'),
    JSON.stringify(dataStore.tools, null, 2)
  );
}

// API路由

// 获取所有工具
app.get('/api/tools', async (req, res) => {
  try {
    const { category, type, search } = req.query;
    let filteredTools = dataStore.tools.filter(tool => tool.active);

    if (category) {
      filteredTools = filteredTools.filter(tool => tool.category === category);
    }
    if (type) {
      filteredTools = filteredTools.filter(tool => tool.type === type);
    }
    if (search) {
      filteredTools = filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredTools,
      total: filteredTools.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取工具详情
app.get('/api/tools/:id', async (req, res) => {
  try {
    const tool = dataStore.tools.find(t => t.id === req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, error: '工具未找到' });
    }
    res.json({ success: true, data: tool });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 追踪点击
app.post('/api/analytics/click', async (req, res) => {
  try {
    const { toolId, clickType, userAgent, referrer } = req.body;
    
    const clickData = {
      id: Date.now().toString(),
      toolId,
      clickType: clickType || 'direct',
      userAgent,
      referrer,
      timestamp: new Date().toISOString(),
      ip: req.ip
    };

    dataStore.analytics.clicks.push(clickData);
    
    // 更新日统计
    const today = new Date().toISOString().split('T')[0];
    if (!dataStore.analytics.dailyStats[today]) {
      dataStore.analytics.dailyStats[today] = { clicks: 0, conversions: 0, revenue: 0 };
    }
    dataStore.analytics.dailyStats[today].clicks++;

    res.json({ success: true, data: clickData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 追踪转化
app.post('/api/analytics/conversion', async (req, res) => {
  try {
    const { toolId, clickId, amount, commission } = req.body;
    
    const conversionData = {
      id: Date.now().toString(),
      toolId,
      clickId,
      amount: parseFloat(amount),
      commission: parseFloat(commission),
      timestamp: new Date().toISOString()
    };

    dataStore.analytics.conversions.push(conversionData);
    dataStore.analytics.revenue += conversionData.commission;

    // 更新日统计
    const today = new Date().toISOString().split('T')[0];
    if (!dataStore.analytics.dailyStats[today]) {
      dataStore.analytics.dailyStats[today] = { clicks: 0, conversions: 0, revenue: 0 };
    }
    dataStore.analytics.dailyStats[today].conversions++;
    dataStore.analytics.dailyStats[today].revenue += conversionData.commission;

    res.json({ success: true, data: conversionData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取分析数据
app.get('/api/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentClicks = dataStore.analytics.clicks.filter(
      click => new Date(click.timestamp) > cutoffDate
    );
    const recentConversions = dataStore.analytics.conversions.filter(
      conversion => new Date(conversion.timestamp) > cutoffDate
    );

    const analytics = {
      totalClicks: recentClicks.length,
      totalConversions: recentConversions.length,
      totalRevenue: recentConversions.reduce((sum, c) => sum + c.commission, 0),
      conversionRate: recentClicks.length > 0 ? 
        (recentConversions.length / recentClicks.length * 100).toFixed(2) : 0,
      dailyStats: dataStore.analytics.dailyStats,
      topTools: getTopTools(recentConversions)
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取热门工具
function getTopTools(conversions) {
  const toolRevenue = {};
  conversions.forEach(conv => {
    if (!toolRevenue[conv.toolId]) {
      toolRevenue[conv.toolId] = 0;
    }
    toolRevenue[conv.toolId] += conv.commission;
  });

  return Object.entries(toolRevenue)
    .map(([toolId, revenue]) => {
      const tool = dataStore.tools.find(t => t.id === toolId);
      return {
        toolId,
        name: tool?.name || toolId,
        revenue,
        conversions: conversions.filter(c => c.toolId === toolId).length
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

// 自动爬虫任务
async function crawlNewTools() {
  console.log('🕷️ 开始爬取新工具...');
  
  try {
    // Product Hunt API
    const productHuntResponse = await axios.get('https://api.producthunt.com/v2/api/graphql', {
      headers: {
        'Authorization': `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        query: `
          query {
            posts(first: 20, topic: "artificial-intelligence") {
              edges {
                node {
                  id
                  name
                  description
                  url
                  tagline
                }
              }
            }
          }
        `
      }
    });

    const newTools = productHuntResponse.data.data.posts.edges.map(edge => {
      const node = edge.node;
      return {
        id: `ph_${node.id}`,
        name: node.name,
        description: node.tagline || node.description,
        category: '新发现',
        type: 'freemium',
        pricing: '待确认',
        url: node.url,
        features: [],
        tags: ['AI', '新工具'],
        active: false, // 需要人工审核
        source: 'producthunt'
      };
    });

    // 合并新工具，避免重复
    const existingIds = dataStore.tools.map(t => t.id);
    const uniqueNewTools = newTools.filter(tool => !existingIds.includes(tool.id));
    
    dataStore.tools.push(...uniqueNewTools);
    await saveToolsData();
    
    console.log(`✅ 爬取完成，发现 ${uniqueNewTools.length} 个新工具`);
  } catch (error) {
    console.error('❌ 爬取失败:', error.message);
  }
}

// 社交媒体自动发布
async function autoSocialPosting() {
  console.log('📱 开始社交媒体自动发布...');
  
  try {
    // 获取热门工具
    const topTool = dataStore.tools
      .filter(tool => tool.active && Math.random() > 0.7)
      .sort(() => Math.random() - 0.5)[0];

    if (!topTool) return;

    const postContent = generateSocialPost(topTool);
    
    // Twitter API (需要Twitter Developer账户)
    if (process.env.TWITTER_API_KEY) {
      await postToTwitter(postContent);
    }
    
    // LinkedIn API
    if (process.env.LINKEDIN_API_KEY) {
      await postToLinkedIn(postContent);
    }
    
    console.log('✅ 社交媒体发布完成');
  } catch (error) {
    console.error('❌ 社交媒体发布失败:', error.message);
  }
}

// 生成社交媒体内容
function generateSocialPost(tool) {
  const templates = [
    `🚀 发现超赞AI工具：${tool.name}！\n\n${tool.description}\n\n💰 价格：${tool.pricing}\n\n👉 试试看：${tool.url}\n\n#AI工具 #人工智能 #科技`,
    `💡 AI工具推荐：${tool.name}\n\n${tool.description}\n\n✨ 特色功能：${tool.features.slice(0, 2).join('、')}\n\n🔗 链接：${tool.url}\n\n#AI #科技推荐`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

// 发布到Twitter
async function postToTwitter(content) {
  // 实际实现需要Twitter API v2
  console.log('🐦 Twitter发布:', content);
}

// 发布到LinkedIn
async function postToLinkedIn(content) {
  // 实际实现需要LinkedIn API
  console.log('💼 LinkedIn发布:', content);
}

// 定时任务
cron.schedule('0 */6 * * *', crawlNewTools); // 每6小时爬取一次
cron.schedule('0 */4 * * *', autoSocialPosting); // 每4小时发布一次

// 数据备份
async function backupData() {
  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      tools: dataStore.tools,
      analytics: dataStore.analytics
    };
    
    const backupPath = path.join(__dirname, '../backups', `backup-${Date.now()}.json`);
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
    
    // 清理旧备份（保留最近7天）
    const backupDir = path.join(__dirname, '../backups');
    const files = await fs.readdir(backupDir);
    const oldFiles = files.filter(file => {
      const fileTime = new Date(file.split('-')[1].replace('.json', ''));
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return fileTime < weekAgo;
    });
    
    for (const file of oldFiles) {
      await fs.unlink(path.join(backupDir, file));
    }
    
    console.log('✅ 数据备份完成');
  } catch (error) {
    console.error('❌ 数据备份失败:', error.message);
  }
}

cron.schedule('0 2 * * *', backupData); // 每天凌晨2点备份

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    toolsCount: dataStore.tools.length,
    totalRevenue: dataStore.analytics.revenue
  });
});

// 启动服务器
async function startServer() {
  try {
    // 确保必要的目录存在
    await fs.mkdir(path.join(__dirname, '../data'), { recursive: true });
    await fs.mkdir(path.join(__dirname, '../backups'), { recursive: true });
    
    // 初始化数据
    await initializeData();
    
    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器启动成功！`);
      console.log(`📡 端口: ${PORT}`);
      console.log(`⏰ 启动时间: ${new Date().toISOString()}`);
      console.log(`🛠️  工具数量: ${dataStore.tools.length}`);
      console.log(`💰 总收益: $${dataStore.analytics.revenue.toFixed(2)}`);
    });
    
    // 立即执行一次任务
    setTimeout(crawlNewTools, 5000);
    setTimeout(autoSocialPosting, 10000);
    
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，正在关闭服务器...');
  backupData();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，正在关闭服务器...');
  backupData();
  process.exit(0);
});

startServer();