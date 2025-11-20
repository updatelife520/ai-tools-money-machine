import React, { useEffect } from 'react';

// 商业逻辑：佣金追踪系统
class CommissionTracker {
  private static instance: CommissionTracker;
  private clickData: Array<{
    toolId: string;
    toolName: string;
    category: string;
    price: string;
    timestamp: number;
    userAgent: string;
    sessionId: string;
  }> = [];

  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): CommissionTracker {
    if (!CommissionTracker.instance) {
      CommissionTracker.instance = new CommissionTracker();
    }
    return CommissionTracker.instance;
  }

  static initialize() {
    // 使用 requestIdleCallback 在浏览器空闲时初始化
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const tracker = CommissionTracker.getInstance();
        tracker.setupEventListeners();
        tracker.restoreSessionData();
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        const tracker = CommissionTracker.getInstance();
        tracker.setupEventListeners();
        tracker.restoreSessionData();
      }, 0);
    }
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private setupEventListeners() {
    // 监听工具点击事件
    window.addEventListener('toolAffiliateClick', this.handleToolClick.bind(this) as EventListener);
    window.addEventListener('userCategorySelected', this.handleCategorySelection.bind(this) as EventListener);
    window.addEventListener('viewMoreTools', this.handleViewMoreTools.bind(this) as EventListener);
    
    // 页面卸载时保存数据
    window.addEventListener('beforeunload', this.saveSessionData.bind(this));
    
    // 定期同步数据到后端 - 降低频率提升性能
    setInterval(() => this.syncDataToBackend(), 60000); // 每60秒同步一次
  }

  private handleToolClick(event: CustomEvent) {
    const { toolId, toolName, category, price } = event.detail;
    
    const clickRecord = {
      toolId,
      toolName,
      category,
      price,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId
    };

    this.clickData.push(clickRecord);
    
    // 立即发送到后端
    this.sendClickToBackend(clickRecord);
    
    // 生成联盟链接并跳转
    this.generateAffiliateLinkAndRedirect(toolId, toolName);
  }

  private handleCategorySelection(event: CustomEvent) {
    const { category } = event.detail;
    
    // 记录用户兴趣，用于后续推荐优化
    this.sendUserInterestToBackend(category);
  }

  private handleViewMoreTools(event: CustomEvent) {
    const { category } = event.detail;
    
    // 记录用户查看更多工具的行为
    this.sendViewMoreEventToBackend(category);
  }

  private generateAffiliateLinkAndRedirect(toolId: string, toolName: string) {
    // 获取联盟链接配置
    const affiliateConfigs = {
      '1': { // ChatGPT
        network: 'openai',
        baseUrl: 'https://openai.com/blog/chatgpt',
        affiliateId: 'aitools_nav',
        commission: '10%'
      },
      '2': { // Claude
        network: 'anthropic',
        baseUrl: 'https://claude.ai',
        affiliateId: 'aitools_nav',
        commission: '10%'
      },
      '3': { // Midjourney
        network: 'midjourney',
        baseUrl: 'https://midjourney.com',
        affiliateId: 'aitools_nav',
        commission: '15%'
      }
    };

    const config = affiliateConfigs[toolId as keyof typeof affiliateConfigs];
    if (config) {
      const affiliateUrl = `${config.baseUrl}?ref=${config.affiliateId}`;
      
      // 在新窗口打开联盟链接
      window.open(affiliateUrl, '_blank');
      
      // 记录潜在佣金
      this.recordPotentialCommission(toolId, toolName, config.commission);
    }
  }

  private recordPotentialCommission(toolId: string, toolName: string, commission: string) {
    const commissionData = {
      toolId,
      toolName,
      commission,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      status: 'pending' // pending, confirmed, rejected
    };

    // 发送到后端记录潜在佣金
    fetch('/api/commissions/potential', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commissionData)
    }).catch(error => {
      console.error('Failed to record potential commission:', error);
    });
  }

  private sendClickToBackend(clickRecord: any) {
    fetch('/api/analytics/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickRecord)
    }).catch(error => {
      console.error('Failed to send click data:', error);
    });
  }

  private sendUserInterestToBackend(category: string) {
    fetch('/api/analytics/interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category,
        timestamp: Date.now(),
        sessionId: this.sessionId
      })
    }).catch(error => {
      console.error('Failed to send user interest:', error);
    });
  }

  private sendViewMoreEventToBackend(category: string) {
    fetch('/api/analytics/view-more', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category,
        timestamp: Date.now(),
        sessionId: this.sessionId
      })
    }).catch(error => {
      console.error('Failed to send view more event:', error);
    });
  }

  public syncDataToBackend() {
    if (this.clickData.length === 0) return;

    // 批量同步点击数据
    fetch('/api/analytics/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clicks: this.clickData,
        sessionId: this.sessionId
      })
    }).then(response => {
      if (response.ok) {
        // 清空已同步的数据
        this.clickData = [];
      }
    }).catch(error => {
      console.error('Failed to sync data to backend:', error);
    });
  }

  private saveSessionData() {
    sessionStorage.setItem('commissionTrackerData', JSON.stringify({
      clickData: this.clickData,
      sessionId: this.sessionId
    }));
  }

  private restoreSessionData() {
    const savedData = sessionStorage.getItem('commissionTrackerData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        this.clickData = parsed.clickData || [];
        this.sessionId = parsed.sessionId || this.sessionId;
      } catch (error) {
        console.error('Failed to restore session data:', error);
      }
    }
  }
}

// React组件 - 这个组件对用户不可见，只负责初始化商业逻辑
const CommissionTrackerComponent: React.FC = () => {
  useEffect(() => {
    // 初始化佣金追踪系统
    CommissionTracker.initialize();
    
    // 页面可见性变化时的处理
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 页面重新可见时，检查是否有新的佣金数据
        CommissionTracker.getInstance().syncDataToBackend();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 这个组件不渲染任何可见内容
  return null;
};

export default CommissionTrackerComponent;
export { CommissionTracker };