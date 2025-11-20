// AI工具导航站 - 核心商业逻辑服务
// 实现完整的商业闭环：用户发现 → 智能推荐 → 联盟跳转 → 佣金追踪 → 收益优化 → 自动化运营

class BusinessLogicService {
    constructor() {
        this.apiEndpoint = '/api';
        this.sessionId = this.generateSessionId();
        this.userData = this.loadUserData();
        this.commissionData = this.loadCommissionData();
        this.automationRules = this.loadAutomationRules();
        
        // 初始化自动化系统
        this.initAutomation();
    }

    // ==================== 用户行为追踪 ====================
    
    // 追踪用户行为
    async trackUserAction(action, data = {}) {
        const trackingData = {
            action: action,
            data: data,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            userId: this.userData.userId,
            ip: await this.getUserIP()
        };

        try {
            // 发送到本地存储
            this.saveLocalTracking(trackingData);
            
            // 发送到后端API
            await this.sendToAPI('/tracking', trackingData);
            
            // 触发自动化规则检查
            this.checkAutomationRules(action, data);
            
        } catch (error) {
            console.error('Tracking error:', error);
        }
    }

    // 获取用户IP
    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    // ==================== 智能推荐系统 ====================
    
    // 根据用户行为推荐工具
    async getRecommendedTools(category = null, userContext = {}) {
        try {
            const requestData = {
                category: category,
                userContext: {
                    sessionId: this.sessionId,
                    previousActions: this.getUserHistory(),
                    preferences: this.userData.preferences,
                    ...userContext
                },
                timestamp: new Date().toISOString()
            };

            const response = await this.sendToAPI('/recommendations', requestData);
            
            // 记录推荐行为
            this.trackUserAction('tools_recommended', {
                category: category,
                toolCount: response.tools.length,
                recommendationId: response.recommendationId
            });
            
            return response;
            
        } catch (error) {
            console.error('Recommendation error:', error);
            return this.getFallbackRecommendations(category);
        }
    }

    // 备用推荐逻辑
    getFallbackRecommendations(category) {
        const fallbackTools = {
            content: ['chatgpt', 'claude', 'jasper'],
            design: ['midjourney', 'dalle', 'canva'],
            coding: ['github-copilot', 'tabnine'],
            marketing: ['surfer-seo', 'jasper-copywriting'],
            data: ['tableau', 'notion-ai'],
            productivity: ['notion', 'motion']
        };
        
        return {
            tools: fallbackTools[category] || [],
            recommendationId: 'fallback_' + Date.now(),
            fallback: true
        };
    }

    // ==================== 智能链接管理 ====================
    
    // 生成智能跳转链接
    async generateSmartLink(toolId, linkType = 'auto') {
        try {
            const tool = await this.getToolInfo(toolId);
            
            let targetUrl;
            let redirectType;
            
            if (linkType === 'auto') {
                // 智能判断跳转类型
                if (tool.type === 'free') {
                    targetUrl = tool.directUrl;
                    redirectType = 'direct';
                } else if (tool.type === 'paid' && tool.affiliateUrl) {
                    // 检查佣金比例和转化率
                    const commissionData = await this.getCommissionData(toolId);
                    if (commissionData.conversionRate > 0.3) {
                        targetUrl = tool.affiliateUrl;
                        redirectType = 'affiliate';
                    } else {
                        targetUrl = tool.directUrl;
                        redirectType = 'direct';
                    }
                } else {
                    targetUrl = tool.directUrl;
                    redirectType = 'direct';
                }
            } else {
                targetUrl = linkType === 'affiliate' ? tool.affiliateUrl : tool.directUrl;
                redirectType = linkType;
            }
            
            // 生成追踪链接
            const trackingLink = this.generateTrackingLink(targetUrl, toolId, redirectType);
            
            // 记录链接生成
            this.trackUserAction('link_generated', {
                toolId: toolId,
                toolName: tool.name,
                redirectType: redirectType,
                trackingLink: trackingLink
            });
            
            return {
                url: trackingLink,
                redirectType: redirectType,
                tool: tool
            };
            
        } catch (error) {
            console.error('Smart link generation error:', error);
            return null;
        }
    }

    // 生成追踪链接
    generateTrackingLink(originalUrl, toolId, redirectType) {
        const trackingParams = new URLSearchParams({
            utm_source: 'aitools-nav',
            utm_medium: redirectType,
            utm_campaign: toolId,
            utm_content: this.sessionId,
            timestamp: Date.now()
        });
        
        const separator = originalUrl.includes('?') ? '&' : '?';
        return `${originalUrl}${separator}${trackingParams.toString()}`;
    }

    // ==================== 佣金追踪系统 ====================
    
    // 追踪转化事件
    async trackConversion(toolId, conversionData = {}) {
        try {
            const conversion = {
                toolId: toolId,
                sessionId: this.sessionId,
                userId: this.userData.userId,
                conversionType: conversionData.type || 'purchase',
                amount: conversionData.amount || 0,
                commission: conversionData.commission || 0,
                timestamp: new Date().toISOString(),
                metadata: conversionData.metadata || {}
            };
            
            // 发送到后端
            await this.sendToAPI('/conversions', conversion);
            
            // 更新本地佣金数据
            this.updateCommissionData(conversion);
            
            // 触发自动化规则
            this.checkAutomationRules('conversion', conversion);
            
            // 显示成功通知
            this.showConversionNotification(conversion);
            
        } catch (error) {
            console.error('Conversion tracking error:', error);
        }
    }

    // 获取佣金数据
    async getCommissionData(toolId = null) {
        try {
            const params = toolId ? `?toolId=${toolId}` : '';
            const response = await fetch(`${this.apiEndpoint}/commission${params}`);
            return await response.json();
        } catch (error) {
            return this.commissionData[toolId] || this.getDefaultCommissionData();
        }
    }

    // 更新佣金数据
    updateCommissionData(conversion) {
        if (!this.commissionData[conversion.toolId]) {
            this.commissionData[conversion.toolId] = {
                totalRevenue: 0,
                conversions: 0,
                conversionRate: 0,
                lastUpdated: new Date().toISOString()
            };
        }
        
        const toolData = this.commissionData[conversion.toolId];
        toolData.totalRevenue += conversion.commission;
        toolData.conversions += 1;
        toolData.lastUpdated = new Date().toISOString();
        
        // 保存到本地存储
        this.saveCommissionData();
    }

    // ==================== 自动化系统 ====================
    
    // 初始化自动化
    initAutomation() {
        // 设置定时任务
        this.setupScheduledTasks();
        
        // 设置事件监听
        this.setupEventListeners();
        
        console.log('Automation system initialized');
    }

    // 设置定时任务
    setupScheduledTasks() {
        // 每小时检查佣金数据
        setInterval(() => {
            this.checkCommissionOptimization();
        }, 60 * 60 * 1000);
        
        // 每天更新工具排行
        setInterval(() => {
            this.updateToolRankings();
        }, 24 * 60 * 60 * 1000);
        
        // 每周生成报告
        setInterval(() => {
            this.generateWeeklyReport();
        }, 7 * 24 * 60 * 60 * 1000);
    }

    // 检查自动化规则
    checkAutomationRules(action, data) {
        this.automationRules.forEach(rule => {
            if (this.shouldTriggerRule(rule, action, data)) {
                this.executeAutomationRule(rule, action, data);
            }
        });
    }

    // 判断是否触发规则
    shouldTriggerRule(rule, action, data) {
        if (!rule.enabled) return false;
        
        return rule.trigger.action === action && 
               this.evaluateCondition(rule.trigger.condition, data);
    }

    // 执行自动化规则
    async executeAutomationRule(rule, action, data) {
        try {
            console.log(`Executing automation rule: ${rule.name}`);
            
            switch (rule.action.type) {
                case 'optimize_links':
                    await this.optimizeAffiliateLinks();
                    break;
                case 'update_rankings':
                    await this.updateToolRankings();
                    break;
                case 'send_notification':
                    await this.sendNotification(rule.action.payload, data);
                    break;
                case 'adjust_commission':
                    await this.adjustCommissionRates(rule.action.payload);
                    break;
                default:
                    console.log(`Unknown automation action: ${rule.action.type}`);
            }
            
            // 记录规则执行
            this.trackUserAction('automation_executed', {
                ruleId: rule.id,
                ruleName: rule.name,
                triggerAction: action,
                triggerData: data
            });
            
        } catch (error) {
            console.error(`Automation rule execution error: ${rule.name}`, error);
        }
    }

    // 优化联盟链接
    async optimizeAffiliateLinks() {
        console.log('Optimizing affiliate links...');
        
        // 获取所有工具的转化数据
        const tools = await this.getAllTools();
        
        for (const tool of tools) {
            const commissionData = await this.getCommissionData(tool.id);
            
            // 如果转化率低于阈值，尝试切换到其他联盟网络
            if (commissionData.conversionRate < 0.3 && tool.alternativeAffiliateUrls) {
                // 这里可以实现A/B测试逻辑
                console.log(`Optimizing links for ${tool.name}`);
            }
        }
    }

    // 更新工具排行
    async updateToolRankings() {
        console.log('Updating tool rankings...');
        
        // 获取所有工具的统计数据
        const tools = await this.getAllTools();
        const rankings = [];
        
        for (const tool of tools) {
            const stats = await this.getToolStats(tool.id);
            rankings.push({
                tool: tool,
                score: this.calculateRankingScore(stats),
                stats: stats
            });
        }
        
        // 按分数排序
        rankings.sort((a, b) => b.score - a.score);
        
        // 保存排行数据
        this.saveToolRankings(rankings);
        
        console.log('Tool rankings updated');
    }

    // 计算排行分数
    calculateRankingScore(stats) {
        return (
            stats.clicks * 0.3 +
            stats.conversions * 10 +
            stats.revenue * 5 +
            stats.userRating * 20
        );
    }

    // ==================== 数据分析和报告 ====================
    
    // 生成周报
    async generateWeeklyReport() {
        try {
            const reportData = {
                period: 'weekly',
                startDate: this.getWeekStart(),
                endDate: new Date().toISOString(),
                metrics: await this.getWeeklyMetrics(),
                topTools: await this.getTopTools('week'),
                trends: await this.getTrends('week'),
                recommendations: await this.getRecommendations('week')
            };
            
            // 保存报告
            this.saveReport(reportData);
            
            // 发送邮件通知
            await this.sendReportEmail(reportData);
            
            console.log('Weekly report generated');
            
        } catch (error) {
            console.error('Weekly report generation error:', error);
        }
    }

    // 获取周指标
    async getWeeklyMetrics() {
        return {
            totalRevenue: await this.getTotalRevenue('week'),
            totalClicks: await this.getTotalClicks('week'),
            conversionRate: await this.getConversionRate('week'),
            newUsers: await this.getNewUsers('week'),
            topCategory: await this.getTopCategory('week')
        };
    }

    // ==================== 工具函数 ====================
    
    // 生成会话ID
    generateSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    // 加载用户数据
    loadUserData() {
        const stored = localStorage.getItem('userData');
        return stored ? JSON.parse(stored) : {
            userId: 'user_' + Date.now(),
            preferences: {},
            history: []
        };
    }

    // 加载佣金数据
    loadCommissionData() {
        const stored = localStorage.getItem('commissionData');
        return stored ? JSON.parse(stored) : {};
    }

    // 加载自动化规则
    loadAutomationRules() {
        const defaultRules = [
            {
                id: 'link_optimization',
                name: '智能链接优化',
                enabled: true,
                trigger: {
                    action: 'conversion',
                    condition: {
                        conversionRate: { lt: 0.3 }
                    }
                },
                action: {
                    type: 'optimize_links',
                    payload: {}
                }
            },
            {
                id: 'ranking_update',
                name: '工具排行更新',
                enabled: true,
                trigger: {
                    action: 'scheduled',
                    condition: {
                        interval: 'daily'
                    }
                },
                action: {
                    type: 'update_rankings',
                    payload: {}
                }
            }
        ];
        
        const stored = localStorage.getItem('automationRules');
        return stored ? JSON.parse(stored) : defaultRules;
    }

    // 保存本地追踪数据
    saveLocalTracking(data) {
        let trackingData = JSON.parse(localStorage.getItem('trackingData') || '[]');
        trackingData.push(data);
        
        // 只保留最近1000条记录
        if (trackingData.length > 1000) {
            trackingData = trackingData.slice(-1000);
        }
        
        localStorage.setItem('trackingData', JSON.stringify(trackingData));
    }

    // 发送API请求
    async sendToAPI(endpoint, data) {
        // 这里应该实现真实的API调用
        // 现在只是模拟
        console.log(`API Call to ${endpoint}:`, data);
        
        // 模拟API响应
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: data });
            }, 100);
        });
    }

    // 获取用户历史
    getUserHistory() {
        return this.userData.history || [];
    }

    // 获取工具信息
    async getToolInfo(toolId) {
        // 这里应该从数据库或API获取工具信息
        const tools = {
            chatgpt: {
                id: 'chatgpt',
                name: 'ChatGPT',
                type: 'freemium',
                directUrl: 'https://chat.openai.com',
                affiliateUrl: 'https://chat.openai.com?affiliate=aitools'
            },
            midjourney: {
                id: 'midjourney',
                name: 'Midjourney',
                type: 'paid',
                directUrl: 'https://midjourney.com',
                affiliateUrl: 'https://midjourney.com?affiliate=aitools'
            }
        };
        
        return tools[toolId] || null;
    }

    // 显示转化通知
    showConversionNotification(conversion) {
        // 这里可以实现更优雅的通知系统
        console.log(`🎉 Conversion tracked! Commission: $${conversion.commission}`);
    }

    // 获取默认佣金数据
    getDefaultCommissionData() {
        return {
            totalRevenue: 0,
            conversions: 0,
            conversionRate: 0,
            lastUpdated: new Date().toISOString()
        };
    }

    // 保存佣金数据
    saveCommissionData() {
        localStorage.setItem('commissionData', JSON.stringify(this.commissionData));
    }

    // 获取所有工具
    async getAllTools() {
        // 这里应该从数据库获取
        return [];
    }

    // 获取工具统计
    async getToolStats(toolId) {
        return {
            clicks: 0,
            conversions: 0,
            revenue: 0,
            userRating: 0
        };
    }

    // 保存工具排行
    saveToolRankings(rankings) {
        localStorage.setItem('toolRankings', JSON.stringify(rankings));
    }

    // 获取周开始时间
    getWeekStart() {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        return startOfWeek.toISOString();
    }

    // 保存报告
    saveReport(report) {
        localStorage.setItem(`report_${report.period}_${Date.now()}`, JSON.stringify(report));
    }

    // 发送报告邮件
    async sendReportEmail(report) {
        console.log('Sending weekly report email:', report);
    }

    // 获取总收益
    async getTotalRevenue(period) {
        return 0;
    }

    // 获取总点击量
    async getTotalClicks(period) {
        return 0;
    }

    // 获取转化率
    async getConversionRate(period) {
        return 0;
    }

    // 获取新用户数
    async getNewUsers(period) {
        return 0;
    }

    // 获取热门类别
    async getTopCategory(period) {
        return 'content';
    }

    // 获取热门工具
    async getTopTools(period) {
        return [];
    }

    // 获取趋势数据
    async getTrends(period) {
        return {};
    }

    // 获取推荐
    async getRecommendations(period) {
        return [];
    }

    // 评估条件
    evaluateCondition(condition, data) {
        // 简单的条件评估逻辑
        if (condition.conversionRate && condition.conversionRate.lt) {
            return data.conversionRate < condition.conversionRate.lt;
        }
        return true;
    }

    // 发送通知
    async sendNotification(payload, data) {
        console.log('Sending notification:', payload, data);
    }

    // 调整佣金比例
    async adjustCommissionRates(payload) {
        console.log('Adjusting commission rates:', payload);
    }

    // 检查佣金优化
    async checkCommissionOptimization() {
        await this.optimizeAffiliateLinks();
    }

    // 设置事件监听
    setupEventListeners() {
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.trackUserAction('page_focus', { page: 'homepage' });
            }
        });
        
        // 监听页面卸载
        window.addEventListener('beforeunload', () => {
            this.trackUserAction('page_unload', { 
                timeOnPage: Date.now() - performance.timing.navigationStart 
            });
        });
    }
}

// 创建全局实例
window.businessLogic = new BusinessLogicService();

// 导出服务
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BusinessLogicService;
}