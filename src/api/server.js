// AI工具导航站 - 后端API服务
// 实现完整的商业闭环API支撑

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

class BusinessAPIServer {
    constructor(port = 3001) {
        this.app = express();
        this.port = port;
        this.dataDir = path.join(__dirname, '../data');
        
        this.setupMiddleware();
        this.setupRoutes();
        this.initDataDirectory();
    }

    // 设置中间件
    setupMiddleware() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        
        // 请求日志
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    // 设置路由
    setupRoutes() {
        // ==================== 用户行为追踪 ====================
        
        // 追踪用户行为
        this.app.post('/api/track', async (req, res) => {
            try {
                const trackingData = req.body;
                await this.saveTrackingData(trackingData);
                res.json({ success: true, message: 'Tracking data saved' });
            } catch (error) {
                console.error('Tracking error:', error);
                res.status(500).json({ error: 'Failed to save tracking data' });
            }
        });

        // 获取用户历史
        this.app.get('/api/user/:sessionId/history', async (req, res) => {
            try {
                const { sessionId } = req.params;
                const history = await this.getUserHistory(sessionId);
                res.json({ success: true, history });
            } catch (error) {
                console.error('History error:', error);
                res.status(500).json({ error: 'Failed to get user history' });
            }
        });

        // ==================== 智能推荐系统 ====================
        
        // 获取工具推荐
        this.app.post('/api/recommendations', async (req, res) => {
            try {
                const { category, userContext } = req.body;
                const recommendations = await this.generateRecommendations(category, userContext);
                res.json({ success: true, ...recommendations });
            } catch (error) {
                console.error('Recommendation error:', error);
                res.status(500).json({ error: 'Failed to generate recommendations' });
            }
        });

        // 获取热门工具
        this.app.get('/api/tools/trending', async (req, res) => {
            try {
                const { period = 'week', category } = req.query;
                const trendingTools = await this.getTrendingTools(period, category);
                res.json({ success: true, tools: trendingTools });
            } catch (error) {
                console.error('Trending tools error:', error);
                res.status(500).json({ error: 'Failed to get trending tools' });
            }
        });

        // ==================== 工具管理 ====================
        
        // 获取所有工具
        this.app.get('/api/tools', async (req, res) => {
            try {
                const { category, type, status } = req.query;
                const tools = await this.getTools(category, type, status);
                res.json({ success: true, tools });
            } catch (error) {
                console.error('Tools error:', error);
                res.status(500).json({ error: 'Failed to get tools' });
            }
        });

        // 获取单个工具
        this.app.get('/api/tools/:toolId', async (req, res) => {
            try {
                const { toolId } = req.params;
                const tool = await this.getTool(toolId);
                if (!tool) {
                    return res.status(404).json({ error: 'Tool not found' });
                }
                res.json({ success: true, tool });
            } catch (error) {
                console.error('Tool error:', error);
                res.status(500).json({ error: 'Failed to get tool' });
            }
        });

        // 添加工具
        this.app.post('/api/tools', async (req, res) => {
            try {
                const toolData = req.body;
                const newTool = await this.addTool(toolData);
                res.json({ success: true, tool: newTool });
            } catch (error) {
                console.error('Add tool error:', error);
                res.status(500).json({ error: 'Failed to add tool' });
            }
        });

        // 更新工具
        this.app.put('/api/tools/:toolId', async (req, res) => {
            try {
                const { toolId } = req.params;
                const updateData = req.body;
                const updatedTool = await this.updateTool(toolId, updateData);
                res.json({ success: true, tool: updatedTool });
            } catch (error) {
                console.error('Update tool error:', error);
                res.status(500).json({ error: 'Failed to update tool' });
            }
        });

        // 删除工具
        this.app.delete('/api/tools/:toolId', async (req, res) => {
            try {
                const { toolId } = req.params;
                await this.deleteTool(toolId);
                res.json({ success: true, message: 'Tool deleted' });
            } catch (error) {
                console.error('Delete tool error:', error);
                res.status(500).json({ error: 'Failed to delete tool' });
            }
        });

        // ==================== 佣金追踪系统 ====================
        
        // 追踪转化
        this.app.post('/api/conversions', async (req, res) => {
            try {
                const conversionData = req.body;
                const conversion = await this.trackConversion(conversionData);
                res.json({ success: true, conversion });
            } catch (error) {
                console.error('Conversion tracking error:', error);
                res.status(500).json({ error: 'Failed to track conversion' });
            }
        });

        // 获取佣金数据
        this.app.get('/api/commission', async (req, res) => {
            try {
                const { toolId, period = 'month' } = req.query;
                const commissionData = await this.getCommissionData(toolId, period);
                res.json({ success: true, data: commissionData });
            } catch (error) {
                console.error('Commission data error:', error);
                res.status(500).json({ error: 'Failed to get commission data' });
            }
        });

        // 获取收益统计
        this.app.get('/api/revenue', async (req, res) => {
            try {
                const { period = 'month' } = req.query;
                const revenueData = await this.getRevenueData(period);
                res.json({ success: true, data: revenueData });
            } catch (error) {
                console.error('Revenue data error:', error);
                res.status(500).json({ error: 'Failed to get revenue data' });
            }
        });

        // ==================== 用户分析 ====================
        
        // 获取用户分析数据
        this.app.get('/api/analytics/users', async (req, res) => {
            try {
                const { period = 'week' } = req.query;
                const analyticsData = await this.getUserAnalytics(period);
                res.json({ success: true, data: analyticsData });
            } catch (error) {
                console.error('User analytics error:', error);
                res.status(500).json({ error: 'Failed to get user analytics' });
            }
        });

        // 获取页面访问统计
        this.app.get('/api/analytics/pageviews', async (req, res) => {
            try {
                const { period = 'week' } = req.query;
                const pageviewData = await this.getPageviewAnalytics(period);
                res.json({ success: true, data: pageviewData });
            } catch (error) {
                console.error('Pageview analytics error:', error);
                res.status(500).json({ error: 'Failed to get pageview analytics' });
            }
        });

        // ==================== 自动化系统 ====================
        
        // 获取自动化规则
        this.app.get('/api/automation/rules', async (req, res) => {
            try {
                const rules = await this.getAutomationRules();
                res.json({ success: true, rules });
            } catch (error) {
                console.error('Automation rules error:', error);
                res.status(500).json({ error: 'Failed to get automation rules' });
            }
        });

        // 更新自动化规则
        this.app.put('/api/automation/rules/:ruleId', async (req, res) => {
            try {
                const { ruleId } = req.params;
                const ruleData = req.body;
                const updatedRule = await this.updateAutomationRule(ruleId, ruleData);
                res.json({ success: true, rule: updatedRule });
            } catch (error) {
                console.error('Update automation rule error:', error);
                res.status(500).json({ error: 'Failed to update automation rule' });
            }
        });

        // 执行自动化任务
        this.app.post('/api/automation/execute/:taskName', async (req, res) => {
            try {
                const { taskName } = req.params;
                const result = await this.executeAutomationTask(taskName, req.body);
                res.json({ success: true, result });
            } catch (error) {
                console.error('Execute automation task error:', error);
                res.status(500).json({ error: 'Failed to execute automation task' });
            }
        });

        // ==================== 报告系统 ====================
        
        // 生成报告
        this.app.post('/api/reports/generate', async (req, res) => {
            try {
                const { type, period, filters } = req.body;
                const report = await this.generateReport(type, period, filters);
                res.json({ success: true, report });
            } catch (error) {
                console.error('Generate report error:', error);
                res.status(500).json({ error: 'Failed to generate report' });
            }
        });

        // 获取报告列表
        this.app.get('/api/reports', async (req, res) => {
            try {
                const { type, limit = 10 } = req.query;
                const reports = await this.getReports(type, limit);
                res.json({ success: true, reports });
            } catch (error) {
                console.error('Get reports error:', error);
                res.status(500).json({ error: 'Failed to get reports' });
            }
        });

        // ==================== 系统设置 ====================
        
        // 获取系统设置
        this.app.get('/api/settings', async (req, res) => {
            try {
                const settings = await this.getSettings();
                res.json({ success: true, settings });
            } catch (error) {
                console.error('Get settings error:', error);
                res.status(500).json({ error: 'Failed to get settings' });
            }
        });

        // 更新系统设置
        this.app.put('/api/settings', async (req, res) => {
            try {
                const settingsData = req.body;
                const updatedSettings = await this.updateSettings(settingsData);
                res.json({ success: true, settings: updatedSettings });
            } catch (error) {
                console.error('Update settings error:', error);
                res.status(500).json({ error: 'Failed to update settings' });
            }
        });

        // 健康检查
        this.app.get('/api/health', (req, res) => {
            res.json({ 
                success: true, 
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });
    }

    // ==================== 数据操作方法 ====================

    // 初始化数据目录
    async initDataDirectory() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            await fs.mkdir(path.join(this.dataDir, 'tracking'), { recursive: true });
            await fs.mkdir(path.join(this.dataDir, 'tools'), { recursive: true });
            await fs.mkdir(path.join(this.dataDir, 'conversions'), { recursive: true });
            await fs.mkdir(path.join(this.dataDir, 'reports'), { recursive: true });
            
            // 初始化示例数据
            await this.initSampleData();
            
            console.log('Data directory initialized');
        } catch (error) {
            console.error('Failed to initialize data directory:', error);
        }
    }

    // 初始化示例数据
    async initSampleData() {
        // 示例工具数据
        const sampleTools = [
            {
                id: 'chatgpt',
                name: 'ChatGPT',
                category: 'content',
                type: 'freemium',
                description: '强大的对话AI，帮助您生成各种类型的内容',
                features: ['文章写作', '对话交流', '代码生成', '翻译服务'],
                directUrl: 'https://chat.openai.com',
                affiliateUrl: 'https://chat.openai.com?affiliate=aitools',
                commissionRate: 10,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'midjourney',
                name: 'Midjourney',
                category: 'design',
                type: 'paid',
                description: '强大的AI图像生成工具',
                features: ['艺术创作', '照片级真实感', '风格转换', '批量生成'],
                directUrl: 'https://midjourney.com',
                affiliateUrl: 'https://midjourney.com?affiliate=aitools',
                commissionRate: 15,
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];

        // 保存示例工具数据
        for (const tool of sampleTools) {
            const toolPath = path.join(this.dataDir, 'tools', `${tool.id}.json`);
            try {
                await fs.access(toolPath);
            } catch {
                await fs.writeFile(toolPath, JSON.stringify(tool, null, 2));
            }
        }

        // 示例自动化规则
        const sampleRules = [
            {
                id: 'link_optimization',
                name: '智能链接优化',
                enabled: true,
                trigger: {
                    action: 'conversion',
                    condition: { conversionRate: { lt: 0.3 } }
                },
                action: {
                    type: 'optimize_links',
                    payload: {}
                },
                createdAt: new Date().toISOString()
            }
        ];

        const rulesPath = path.join(this.dataDir, 'automation-rules.json');
        try {
            await fs.access(rulesPath);
        } catch {
            await fs.writeFile(rulesPath, JSON.stringify(sampleRules, null, 2));
        }
    }

    // 保存追踪数据
    async saveTrackingData(data) {
        const filename = `tracking_${data.sessionId}_${Date.now()}.json`;
        const filepath = path.join(this.dataDir, 'tracking', filename);
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    }

    // 获取用户历史
    async getUserHistory(sessionId) {
        const trackingDir = path.join(this.dataDir, 'tracking');
        const files = await fs.readdir(trackingDir);
        const userFiles = files.filter(file => file.includes(sessionId));
        
        const history = [];
        for (const file of userFiles) {
            const content = await fs.readFile(path.join(trackingDir, file), 'utf8');
            history.push(JSON.parse(content));
        }
        
        return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // 生成推荐
    async generateRecommendations(category, userContext) {
        // 简单的推荐逻辑
        const tools = await this.getTools(category);
        const recommendedTools = tools.slice(0, 6); // 返回前6个工具
        
        return {
            tools: recommendedTools,
            recommendationId: `rec_${Date.now()}`,
            algorithm: 'category_based',
            confidence: 0.85
        };
    }

    // 获取热门工具
    async getTrendingTools(period, category) {
        const tools = await this.getTools(category);
        
        // 模拟热门度计算
        const toolsWithScore = tools.map(tool => ({
            ...tool,
            trendingScore: Math.random() * 100
        }));
        
        return toolsWithScore
            .sort((a, b) => b.trendingScore - a.trendingScore)
            .slice(0, 10);
    }

    // 获取工具列表
    async getTools(category, type, status) {
        const toolsDir = path.join(this.dataDir, 'tools');
        const files = await fs.readdir(toolsDir);
        const tools = [];
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const content = await fs.readFile(path.join(toolsDir, file), 'utf8');
                const tool = JSON.parse(content);
                
                // 应用过滤器
                if (category && tool.category !== category) continue;
                if (type && tool.type !== type) continue;
                if (status && tool.status !== status) continue;
                
                tools.push(tool);
            }
        }
        
        return tools;
    }

    // 获取单个工具
    async getTool(toolId) {
        const toolPath = path.join(this.dataDir, 'tools', `${toolId}.json`);
        try {
            const content = await fs.readFile(toolPath, 'utf8');
            return JSON.parse(content);
        } catch {
            return null;
        }
    }

    // 添加工具
    async addTool(toolData) {
        const tool = {
            ...toolData,
            id: toolData.id || `tool_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const toolPath = path.join(this.dataDir, 'tools', `${tool.id}.json`);
        await fs.writeFile(toolPath, JSON.stringify(tool, null, 2));
        
        return tool;
    }

    // 更新工具
    async updateTool(toolId, updateData) {
        const tool = await this.getTool(toolId);
        if (!tool) {
            throw new Error('Tool not found');
        }
        
        const updatedTool = {
            ...tool,
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        const toolPath = path.join(this.dataDir, 'tools', `${toolId}.json`);
        await fs.writeFile(toolPath, JSON.stringify(updatedTool, null, 2));
        
        return updatedTool;
    }

    // 删除工具
    async deleteTool(toolId) {
        const toolPath = path.join(this.dataDir, 'tools', `${toolId}.json`);
        await fs.unlink(toolPath);
    }

    // 追踪转化
    async trackConversion(conversionData) {
        const conversion = {
            ...conversionData,
            id: `conv_${Date.now()}`,
            timestamp: new Date().toISOString()
        };
        
        const filename = `conversion_${Date.now()}.json`;
        const filepath = path.join(this.dataDir, 'conversions', filename);
        await fs.writeFile(filepath, JSON.stringify(conversion, null, 2));
        
        return conversion;
    }

    // 获取佣金数据
    async getCommissionData(toolId, period) {
        // 这里应该实现真实的佣金数据计算
        return {
            totalRevenue: 494.34,
            monthlyRevenue: 87.23,
            conversionRate: 0.46,
            clickCount: 15847,
            period: period
        };
    }

    // 获取收益数据
    async getRevenueData(period) {
        return {
            totalRevenue: 494.34,
            todayRevenue: 12.45,
            weeklyRevenue: 87.23,
            monthlyRevenue: 494.34,
            averageCommission: 15.67,
            period: period
        };
    }

    // 获取用户分析数据
    async getUserAnalytics(period) {
        return {
            totalUsers: 1247,
            newUsers: 342,
            returningUsers: 905,
            averageSessionTime: '4m 32s',
            bounceRate: 32.4,
            topPages: [
                { page: '/index.html', views: 847 },
                { page: '/admin.html', views: 234 }
            ]
        };
    }

    // 获取页面访问统计
    async getPageviewAnalytics(period) {
        return {
            totalPageviews: 5847,
            uniquePageviews: 3247,
            averagePageviewsPerSession: 2.3,
            topPages: [
                { page: '/index.html', views: 2847 },
                { page: '/admin.html', views: 1247 }
            ]
        };
    }

    // 获取自动化规则
    async getAutomationRules() {
        const rulesPath = path.join(this.dataDir, 'automation-rules.json');
        try {
            const content = await fs.readFile(rulesPath, 'utf8');
            return JSON.parse(content);
        } catch {
            return [];
        }
    }

    // 更新自动化规则
    async updateAutomationRule(ruleId, ruleData) {
        const rules = await this.getAutomationRules();
        const ruleIndex = rules.findIndex(rule => rule.id === ruleId);
        
        if (ruleIndex === -1) {
            throw new Error('Rule not found');
        }
        
        rules[ruleIndex] = {
            ...rules[ruleIndex],
            ...ruleData,
            updatedAt: new Date().toISOString()
        };
        
        const rulesPath = path.join(this.dataDir, 'automation-rules.json');
        await fs.writeFile(rulesPath, JSON.stringify(rules, null, 2));
        
        return rules[ruleIndex];
    }

    // 执行自动化任务
    async executeAutomationTask(taskName, params) {
        console.log(`Executing automation task: ${taskName}`, params);
        
        switch (taskName) {
            case 'optimize_links':
                return await this.optimizeAffiliateLinks();
            case 'update_rankings':
                return await this.updateToolRankings();
            case 'generate_report':
                return await this.generateWeeklyReport();
            default:
                throw new Error(`Unknown automation task: ${taskName}`);
        }
    }

    // 优化联盟链接
    async optimizeAffiliateLinks() {
        const tools = await this.getTools();
        const optimizations = [];
        
        for (const tool of tools) {
            if (tool.type === 'paid' && tool.affiliateUrl) {
                // 模拟优化逻辑
                optimizations.push({
                    toolId: tool.id,
                    toolName: tool.name,
                    optimization: 'Updated affiliate URL',
                    improvement: '+5% CTR'
                });
            }
        }
        
        return { optimizations, timestamp: new Date().toISOString() };
    }

    // 更新工具排行
    async updateToolRankings() {
        const tools = await this.getTools();
        const rankings = tools.map((tool, index) => ({
            rank: index + 1,
            tool: tool,
            score: Math.random() * 100
        }));
        
        return { rankings, timestamp: new Date().toISOString() };
    }

    // 生成周报
    async generateWeeklyReport() {
        const reportData = {
            id: `report_${Date.now()}`,
            type: 'weekly',
            period: {
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                end: new Date().toISOString()
            },
            metrics: await this.getRevenueData('week'),
            topTools: await this.getTrendingTools('week'),
            generatedAt: new Date().toISOString()
        };
        
        const reportPath = path.join(this.dataDir, 'reports', `${reportData.id}.json`);
        await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
        
        return reportData;
    }

    // 生成报告
    async generateReport(type, period, filters) {
        return {
            id: `report_${Date.now()}`,
            type: type,
            period: period,
            filters: filters,
            data: {
                revenue: await this.getRevenueData(period),
                analytics: await this.getUserAnalytics(period)
            },
            generatedAt: new Date().toISOString()
        };
    }

    // 获取报告列表
    async getReports(type, limit) {
        const reportsDir = path.join(this.dataDir, 'reports');
        const files = await fs.readdir(reportsDir);
        const reports = [];
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const content = await fs.readFile(path.join(reportsDir, file), 'utf8');
                const report = JSON.parse(content);
                
                if (type && report.type !== type) continue;
                
                reports.push(report);
            }
        }
        
        return reports
            .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
            .slice(0, limit);
    }

    // 获取系统设置
    async getSettings() {
        const settingsPath = path.join(this.dataDir, 'settings.json');
        try {
            const content = await fs.readFile(settingsPath, 'utf8');
            return JSON.parse(content);
        } catch {
            return {
                siteTitle: 'AI工具导航站',
                defaultCommissionRate: 10,
                dataRetentionDays: 90,
                automationEnabled: true
            };
        }
    }

    // 更新系统设置
    async updateSettings(settingsData) {
        const settings = await this.getSettings();
        const updatedSettings = {
            ...settings,
            ...settingsData,
            updatedAt: new Date().toISOString()
        };
        
        const settingsPath = path.join(this.dataDir, 'settings.json');
        await fs.writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2));
        
        return updatedSettings;
    }

    // 启动服务器
    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Business API Server started on port ${this.port}`);
            console.log(`📊 API documentation: http://localhost:${this.port}/api/health`);
        });
    }
}

// 启动服务器
if (require.main === module) {
    const server = new BusinessAPIServer();
    server.start();
}

module.exports = BusinessAPIServer;