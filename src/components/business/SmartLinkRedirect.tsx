import React, { useEffect } from 'react';

// 智能链接重定向系统
class SmartLinkRedirect {
  private static instance: SmartLinkRedirect;
  private redirectQueue: Array<{
    originalUrl: string;
    toolId: string;
    timestamp: number;
  }> = [];

  private constructor() {}

  static getInstance(): SmartLinkRedirect {
    if (!SmartLinkRedirect.instance) {
      SmartLinkRedirect.instance = new SmartLinkRedirect();
    }
    return SmartLinkRedirect.instance;
  }

  static initialize() {
    // 使用 requestIdleCallback 在浏览器空闲时初始化
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const redirect = SmartLinkRedirect.getInstance();
        redirect.setupEventListeners();
        redirect.checkForRedirects();
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        const redirect = SmartLinkRedirect.getInstance();
        redirect.setupEventListeners();
        redirect.checkForRedirects();
      }, 0);
    }
  }

  private setupEventListeners() {
    // 监听所有外部链接点击
    document.addEventListener('click', this.handleLinkClick.bind(this));
    
    // 监听工具点击事件
    window.addEventListener('toolClick', this.handleToolClick.bind(this) as EventListener);
  }

  private handleLinkClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const linkElement = target.closest('a[href]');
    
    if (linkElement) {
      const href = linkElement.getAttribute('href');
      
      // 检查是否是外部链接
      if (href && this.isExternalLink(href)) {
        event.preventDefault();
        
        // 处理外部链接重定向
        this.handleExternalLink(href, linkElement as HTMLAnchorElement);
      }
    }
  }

  private handleToolClick(event: CustomEvent) {
    const { tool, category } = event.detail;
    
    // 智能重定向到最适合的链接
    this.smartRedirect(tool, category);
  }

  private isExternalLink(url: string): boolean {
    try {
      // 检查URL是否有效
      if (!url || url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('mailto:') || url.startsWith('tel:')) {
        return false;
      }
      
      // 检查是否是相对路径
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        return false;
      }
      
      const urlObj = new URL(url);
      const domain = window.location.hostname;
      const linkDomain = urlObj.hostname;
      
      return domain !== linkDomain;
    } catch (error) {
      // URL无效，返回false
      return false;
    }
  }

  private handleExternalLink(url: string, linkElement: HTMLAnchorElement | null) {
    // 检查是否需要添加联盟参数
    const affiliateUrl = this.addAffiliateParameters(url);
    
    // 记录点击事件
    this.recordLinkClick(url, affiliateUrl);
    
    // 在新窗口打开链接
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  }

  private addAffiliateParameters(url: string): string {
    const affiliateParams = {
      utm_source: 'aitools-nav',
      utm_medium: 'referral',
      utm_campaign: 'tool-recommendation',
      ref: 'aitools-nav'
    };

    const urlObj = new URL(url);
    
    // 添加联盟参数
    Object.entries(affiliateParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });

    return urlObj.toString();
  }

  private smartRedirect(tool: string, category: string) {
    // 智能重定向逻辑
    const redirectMap = {
      'ChatGPT': {
        free: 'https://chat.openai.com',
        paid: 'https://openai.com/blog/chatgpt?ref=aitools-nav',
        trial: 'https://chat.openai.com/auth/login'
      },
      'Claude': {
        free: 'https://claude.ai',
        paid: 'https://claude.ai/plans?ref=aitools-nav',
        trial: 'https://claude.ai'
      },
      'Midjourney': {
        free: 'https://discord.gg/midjourney',
        paid: 'https://midjourney.com/account?ref=aitools-nav',
        trial: 'https://midjourney.com/join'
      }
    };

    const toolConfig = redirectMap[tool as keyof typeof redirectMap];
    if (toolConfig) {
      // 根据用户行为智能选择重定向目标
      const redirectType = this.selectRedirectType(category);
      const targetUrl = toolConfig[redirectType as keyof typeof toolConfig];
      
      // 记录智能重定向决策
      this.recordSmartRedirect(tool, category, redirectType, targetUrl);
      
      // 执行重定向
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  }

  private selectRedirectType(category: string): string {
    // 根据用户类别和行为选择重定向类型
    const userBehavior = this.getUserBehavior();
    
    if (userBehavior.isFirstTime) {
      return 'trial'; // 首次用户引导到试用
    } else if (userBehavior.hasPurchasedBefore) {
      return 'paid'; // 有购买历史的用户直接到付费页面
    } else {
      return 'free'; // 默认到免费版本
    }
  }

  private getUserBehavior() {
    // 分析用户行为模式
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    const hasPurchased = localStorage.getItem('hasPurchased') === 'true';
    
    return {
      isFirstTime: visitCount <= 1,
      hasPurchasedBefore: hasPurchased,
      visitCount
    };
  }

  private recordLinkClick(originalUrl: string, finalUrl: string) {
    const clickData = {
      originalUrl,
      finalUrl,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // 发送到后端分析
    fetch('/api/analytics/link-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickData)
    }).catch(error => {
      console.error('Failed to record link click:', error);
    });
  }

  private recordSmartRedirect(tool: string, category: string, redirectType: string, targetUrl: string) {
    const redirectData = {
      tool,
      category,
      redirectType,
      targetUrl,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };

    // 发送到后端分析
    fetch('/api/analytics/smart-redirect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(redirectData)
    }).catch(error => {
      console.error('Failed to record smart redirect:', error);
    });
  }

  private checkForRedirects() {
    // 检查URL中是否有重定向参数
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    if (redirectUrl) {
      // 延迟执行重定向，让用户看到页面
      setTimeout(() => {
        this.handleExternalLink(redirectUrl, null as any);
      }, 2000);
    }
  }

  // 公共方法：手动触发重定向
  public redirect(tool: string, category: string) {
    this.smartRedirect(tool, category);
  }

  // 公共方法：获取重定向统计
  public getRedirectStats(): Promise<any> {
    return fetch('/api/analytics/redirect-stats')
      .then(response => response.json())
      .catch(error => {
        console.error('Failed to get redirect stats:', error);
        return null;
      });
  }
}

// React组件 - 智能链接重定向系统
const SmartLinkRedirectComponent: React.FC = () => {
  useEffect(() => {
    // 初始化智能链接重定向系统
    SmartLinkRedirect.initialize();
    
    // 更新访问计数
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    localStorage.setItem('visitCount', visitCount.toString());
    
    // 记录页面访问
    fetch('/api/analytics/page-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: window.location.pathname,
        visitCount,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    }).catch(error => {
      console.error('Failed to record page visit:', error);
    });
  }, []);

  // 这个组件不渲染任何可见内容
  return null;
};

export default SmartLinkRedirectComponent;
export { SmartLinkRedirect };