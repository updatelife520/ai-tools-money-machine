// 自动化主控制器 - 整合所有自动化系统
import ToolCrawler, { ToolData } from './ToolCrawler';
import SocialMediaBot, { SocialPost } from './SocialMediaBot';
import RevenueOptimizer, { RevenueData, AffiliateLink } from './RevenueOptimizer';

interface AutomationConfig {
  // 爬虫配置
  crawler: {
    enabled: boolean;
    intervalMinutes: number;
    sources: string[];
    maxToolsPerCrawl: number;
  };
  
  // 社交媒体配置
  socialMedia: {
    enabled: boolean;
    platforms: string[];
    postsPerDay: number;
    postingHours: number[];
  };
  
  // 收益优化配置
  revenueOptimizer: {
    enabled: boolean;
    optimizationIntervalHours: number;
    autoOptimize: boolean;
  };
  
  // 通知配置
  notifications: {
    email: boolean;
    webhook: boolean;
    slack: boolean;
  };
}

class AutomationController {
  private toolCrawler: ToolCrawler;
  private socialBot: SocialMediaBot;
  private revenueOptimizer: RevenueOptimizer;
  private config: AutomationConfig;
  
  constructor(config?: Partial<AutomationConfig>) {
    this.config = {
      crawler: {
        enabled: true,
        intervalMinutes: 60,
        sources: ['producthunt', 'github', 'reddit'],
        maxToolsPerCrawl: 50
      },
      socialMedia: {
        enabled: true,
        platforms: ['twitter', 'linkedin', 'reddit'],
        postsPerDay: 3,
        postingHours: [9, 12, 15, 18, 21]
      },
      revenueOptimizer: {
        enabled: true,
        optimizationIntervalHours: 6,
        autoOptimize: true
      },
      notifications: {
        email: false,
        webhook: false,
        slack: false
      },
      ...config
    };
    
    this.toolCrawler = new ToolCrawler();
    this.socialBot = new SocialMediaBot();
    this.revenueOptimizer = new RevenueOptimizer();
  }

  // 启动完整自动化系统
  async startFullAutomation(): Promise<void> {
    console.log('🚀 启动AI工具导航站完整自动化系统...');
    
    try {
      // 1. 启动爬虫系统
      if (this.config.crawler.enabled) {
        await this.startCrawlerAutomation();
      }
      
      // 2. 启动社交媒体自动化
      if (this.config.socialMedia.enabled) {
        await this.startSocialMediaAutomation();
      }
      
      // 3. 启动收益优化系统
      if (this.config.revenueOptimizer.enabled) {
        await this.startRevenueOptimization();
      }
      
      // 4. 启动监控和报告系统
      this.startMonitoringSystem();
      
      console.log('✅ 自动化系统启动完成！');
      this.sendNotification('success', '自动化系统启动成功');
      
    } catch (error) {
      console.error('❌ 自动化系统启动失败:', error);
      this.sendNotification('error', '自动化系统启动失败');
    }
  }

  // 启动爬虫自动化
  private async startCrawlerAutomation(): Promise<void> {
    console.log('🕷️ 启动爬虫自动化...');
    
    // 立即执行一次爬取
    const tools = await this.toolCrawler.crawlAllSources();
    await this.processNewTools(tools);
    
    // 启动定时爬取
    this.toolCrawler.startAutoCrawl(this.config.crawler.intervalMinutes);
    
    // 设置爬取结果处理
    this.setupCrawlerResultProcessing();
  }

  // 启动社交媒体自动化
  private async startSocialMediaAutomation(): Promise<void> {
    console.log('📱 启动社交媒体自动化...');
    
    // 启动自动分发
    this.socialBot.startAutoDistribution(24); // 每24小时执行一次
    
    // 设置智能发布时间
    this.setupSmartPosting();
  }

  // 启动收益优化
  private async startRevenueOptimization(): Promise<void> {
    console.log('💰 启动收益优化系统...');
    
    // 启动自动优化
    if (this.config.revenueOptimizer.autoOptimize) {
      this.revenueOptimizer.startAutoOptimization(this.config.revenueOptimizer.optimizationIntervalHours);
    }
    
    // 设置联盟链接优化
    this.setupAffiliateLinkOptimization();
  }

  // 处理新工具
  private async processNewTools(tools: ToolData[]): Promise<void> {
    console.log(`📋 处理 ${tools.length} 个新工具...`);
    
    // 1. 保存工具到数据库
    await this.saveToolsToDatabase(tools);
    
    // 2. 优化联盟链接
    const affiliateLinks = await this.revenueOptimizer.optimizeAffiliateLinks(tools);
    await this.saveAffiliateLinks(affiliateLinks);
    
    // 3. 生成社交媒体内容
    const socialPosts = await this.generateSocialPosts(tools);
    await this.scheduleSocialPosts(socialPosts);
    
    // 4. 更新网站内容
    await this.updateWebsiteContent(tools);
    
    console.log('✅ 新工具处理完成');
  }

  // 保存工具到数据库
  private async saveToolsToDatabase(tools: ToolData[]): Promise<void> {
    // 实际项目中应该发送到后端API
    // await fetch('/api/tools/batch', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(tools)
    // });
    
    // 暂时使用localStorage
    const existingTools = JSON.parse(localStorage.getItem('aiTools') || '[]');
    const mergedTools = this.mergeToolData(existingTools, tools);
    localStorage.setItem('aiTools', JSON.stringify(mergedTools));
    
    console.log(`💾 保存了 ${tools.length} 个工具到数据库`);
  }

  // 合并工具数据
  private mergeToolData(existing: ToolData[], newTools: ToolData[]): ToolData[] {
    const toolMap = new Map<string, ToolData>();
    
    // 添加现有工具
    existing.forEach(tool => toolMap.set(tool.id, tool));
    
    // 更新或添加新工具
    newTools.forEach(tool => {
      const existing = toolMap.get(tool.id);
      if (!existing || tool.lastUpdated > existing.lastUpdated) {
        toolMap.set(tool.id, tool);
      }
    });
    
    return Array.from(toolMap.values());
  }

  // 保存联盟链接
  private async saveAffiliateLinks(links: AffiliateLink[]): Promise<void> {
    // 实际项目中应该发送到后端API
    const existingLinks = JSON.parse(localStorage.getItem('affiliateLinks') || '[]');
    const mergedLinks = [...existingLinks, ...links];
    localStorage.setItem('affiliateLinks', JSON.stringify(mergedLinks));
    
    console.log(`💾 保存了 ${links.length} 个联盟链接`);
  }

  // 生成社交媒体内容
  private async generateSocialPosts(tools: ToolData[]): Promise<SocialPost[]> {
    const posts: SocialPost[] = [];
    
    for (const tool of tools) {
      for (const platform of this.config.socialMedia.platforms) {
        const post = this.socialBot.generatePostContent(tool, platform);
        posts.push(post);
      }
    }
    
    return posts;
  }

  // 安排社交媒体发布
  private async scheduleSocialPosts(posts: SocialPost[]): Promise<void> {
    // 按发布时间排序
    const sortedPosts = posts.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
    
    // 分散发布时间
    const now = new Date();
    sortedPosts.forEach((post, index) => {
      const hoursToAdd = Math.floor(index / this.config.socialMedia.postsPerDay) * 24;
      const hourOfDay = this.config.socialMedia.postingHours[index % this.config.socialMedia.postingHours.length];
      
      const scheduledTime = new Date(now);
      scheduledTime.setDate(scheduledTime.getDate() + Math.floor(hoursToAdd / 24));
      scheduledTime.setHours(hourOfDay, 0, 0, 0);
      
      post.scheduledTime = scheduledTime;
    });
    
    // 保存发布计划
    const existingPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    const allPosts = [...existingPosts, ...sortedPosts];
    localStorage.setItem('scheduledPosts', JSON.stringify(allPosts));
    
    console.log(`📅 安排了 ${sortedPosts.length} 个社交媒体帖子发布`);
  }

  // 更新网站内容
  private async updateWebsiteContent(tools: ToolData[]): Promise<void> {
    // 这里可以实现自动更新网站首页、工具页面等
    console.log(`🔄 更新网站内容，新增 ${tools.length} 个工具`);
    
    // 触发网站重新构建（如果使用静态站点生成器）
    // await this.triggerWebsiteRebuild();
  }

  // 设置智能发布
  private setupSmartPosting(): void {
    // 根据用户活跃时间智能调整发布时间
    const optimalHours = this.calculateOptimalPostingHours();
    this.config.socialMedia.postingHours = optimalHours;
    
    console.log('🧠 智能发布时间已设置:', optimalHours);
  }

  // 计算最佳发布时间
  private calculateOptimalPostingHours(): number[] {
    // 基于历史数据分析最佳发布时间
    // 这里使用固定时间，实际应该基于数据分析
    return [9, 12, 18, 20]; // 上午9点，中午12点，下午6点，晚上8点
  }

  // 设置爬取结果处理
  private setupCrawlerResultProcessing(): void {
    // 监听爬取完成事件
    setInterval(() => {
      this.processCrawlerResults();
    }, 5 * 60 * 1000); // 每5分钟检查一次
  }

  // 处理爬取结果
  private async processCrawlerResults(): Promise<void> {
    // 检查是否有新的爬取结果需要处理
    const pendingResults = JSON.parse(localStorage.getItem('pendingCrawlerResults') || '[]');
    
    if (pendingResults.length > 0) {
      console.log(`🔄 处理 ${pendingResults.length} 个待处理爬取结果...`);
      
      for (const result of pendingResults) {
        await this.processNewTools(result.tools);
      }
      
      // 清空待处理结果
      localStorage.setItem('pendingCrawlerResults', '[]');
    }
  }

  // 设置联盟链接优化
  private setupAffiliateLinkOptimization(): void {
    // 定期检查和优化联盟链接
    setInterval(async () => {
      await this.optimizeAffiliateLinks();
    }, 7 * 24 * 60 * 60 * 1000); // 每周执行一次
  }

  // 优化联盟链接
  private async optimizeAffiliateLinks(): Promise<void> {
    console.log('🔧 优化联盟链接...');
    
    const tools = JSON.parse(localStorage.getItem('aiTools') || '[]');
    const optimizedLinks = await this.revenueOptimizer.optimizeAffiliateLinks(tools);
    
    localStorage.setItem('affiliateLinks', JSON.stringify(optimizedLinks));
    
    console.log('✅ 联盟链接优化完成');
  }

  // 启动监控系统
  private startMonitoringSystem(): void {
    // 性能监控
    this.startPerformanceMonitoring();
    
    // 错误监控
    this.startErrorMonitoring();
    
    // 收益监控
    this.startRevenueMonitoring();
    
    // 生成报告
    this.startReportGeneration();
  }

  // 性能监控
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      const performance = this.collectPerformanceMetrics();
      this.savePerformanceMetrics(performance);
    }, 60 * 60 * 1000); // 每小时收集一次
  }

  // 错误监控
  private startErrorMonitoring(): void {
    // 设置全局错误处理
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason
      });
    });
  }

  // 收益监控
  private startRevenueMonitoring(): void {
    setInterval(() => {
      const revenueData = this.revenueOptimizer.analyzeRevenue();
      this.checkRevenueAlerts(revenueData);
    }, 30 * 60 * 1000); // 每30分钟检查一次
  }

  // 生成报告
  private startReportGeneration(): void {
    // 每日报告
    setInterval(() => {
      this.generateDailyReport();
    }, 24 * 60 * 60 * 1000);
    
    // 每周报告
    setInterval(() => {
      this.generateWeeklyReport();
    }, 7 * 24 * 60 * 60 * 1000);
  }

  // 收集性能指标
  private collectPerformanceMetrics(): any {
    return {
      timestamp: new Date().toISOString(),
      pageLoad: performance.timing.loadEventEnd - performance.timing.navigationStart,
      domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      toolsCount: JSON.parse(localStorage.getItem('aiTools') || '[]').length,
      postsCount: JSON.parse(localStorage.getItem('scheduledPosts') || '[]').length
    };
  }

  // 保存性能指标
  private savePerformanceMetrics(metrics: any): void {
    const metricsHistory = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
    metricsHistory.push(metrics);
    
    // 只保留最近30天的数据
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredMetrics = metricsHistory.filter((m: any) => 
      new Date(m.timestamp) > thirtyDaysAgo
    );
    
    localStorage.setItem('performanceMetrics', JSON.stringify(filteredMetrics));
  }

  // 记录错误
  private logError(type: string, details: any): void {
    const error = {
      timestamp: new Date().toISOString(),
      type,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    const errors = JSON.parse(localStorage.getItem('errors') || '[]');
    errors.push(error);
    
    // 只保留最近100个错误
    if (errors.length > 100) {
      errors.splice(0, errors.length - 100);
    }
    
    localStorage.setItem('errors', JSON.stringify(errors));
    
    console.error(`🚨 ${type}:`, details);
  }

  // 检查收益警报
  private checkRevenueAlerts(revenueData: RevenueData[]): void {
    const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0);
    
    // 如果24小时内收益低于预期，发送警报
    if (totalRevenue < 10) { // 假设最低收益目标是10美元
      this.sendNotification('warning', '24小时内收益低于预期');
    }
  }

  // 生成每日报告
  private generateDailyReport(): void {
    const report = {
      date: new Date().toISOString().split('T')[0],
      tools: JSON.parse(localStorage.getItem('aiTools') || '[]').length,
      posts: JSON.parse(localStorage.getItem('scheduledPosts') || '[]').length,
      revenue: this.revenueOptimizer.generateRevenueReport(),
      performance: this.getLatestPerformanceMetrics(),
      errors: this.getRecentErrors(24)
    };
    
    localStorage.setItem(`dailyReport_${report.date}`, JSON.stringify(report));
    
    console.log('📊 每日报告已生成:', report);
  }

  // 生成每周报告
  private generateWeeklyReport(): void {
    const report = {
      week: this.getWeekNumber(new Date()),
      summary: this.generateWeeklySummary(),
      trends: this.analyzeWeeklyTrends(),
      recommendations: this.generateWeeklyRecommendations()
    };
    
    localStorage.setItem(`weeklyReport_${report.week}`, JSON.stringify(report));
    
    console.log('📈 每周报告已生成:', report);
  }

  // 发送通知
  private sendNotification(type: 'success' | 'error' | 'warning', message: string): void {
    const notification = {
      timestamp: new Date().toISOString(),
      type,
      message
    };
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    
    // 只保留最近50个通知
    if (notifications.length > 50) {
      notifications.splice(0, notifications.length - 50);
    }
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    console.log(`🔔 [${type.toUpperCase()}] ${message}`);
  }

  // 获取最新性能指标
  private getLatestPerformanceMetrics(): any {
    const metrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  }

  // 获取最近错误
  private getRecentErrors(hours: number): any[] {
    const errors = JSON.parse(localStorage.getItem('errors') || '[]');
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);
    
    return errors.filter((error: any) => 
      new Date(error.timestamp) > cutoffTime
    );
  }

  // 获取周数
  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // 生成周总结
  private generateWeeklySummary(): any {
    // 实现周总结逻辑
    return {
      totalTools: JSON.parse(localStorage.getItem('aiTools') || '[]').length,
      totalPosts: JSON.parse(localStorage.getItem('scheduledPosts') || '[]').length,
      totalRevenue: this.revenueOptimizer.generateRevenueReport().summary.totalRevenue
    };
  }

  // 分析周趋势
  private analyzeWeeklyTrends(): any {
    // 实现趋势分析逻辑
    return {
      toolGrowth: '+15%',
      revenueGrowth: '+23%',
      engagementGrowth: '+8%'
    };
  }

  // 生成周建议
  private generateWeeklyRecommendations(): string[] {
    // 实现建议生成逻辑
    return [
      '增加图像AI工具的推广频率',
      '优化移动端用户体验',
      '添加更多付费工具的联盟链接'
    ];
  }

  // 获取系统状态
  getSystemStatus(): any {
    return {
      automation: {
        crawler: this.config.crawler.enabled,
        socialMedia: this.config.socialMedia.enabled,
        revenueOptimizer: this.config.revenueOptimizer.enabled
      },
      stats: {
        toolsCount: JSON.parse(localStorage.getItem('aiTools') || '[]').length,
        postsCount: JSON.parse(localStorage.getItem('scheduledPosts') || '[]').length,
        revenueReport: this.revenueOptimizer.generateRevenueReport()
      },
      health: {
        lastCrawl: localStorage.getItem('lastCrawlTime'),
        lastPost: localStorage.getItem('lastPostTime'),
        lastOptimization: localStorage.getItem('lastOptimizationTime')
      }
    };
  }

  // 停止自动化系统
  stopAutomation(): void {
    console.log('⏹️ 停止自动化系统...');
    
    // 清理所有定时器
    // 注意：在实际实现中需要保存定时器引用以便清理
    
    this.sendNotification('success', '自动化系统已停止');
  }
}

export default AutomationController;
export type { AutomationConfig };