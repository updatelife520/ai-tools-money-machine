// API服务配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ai-tools-money-machine.vercel.app';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  // 获取工具列表
  async getTools(params = {}) {
    const cacheKey = `tools_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/tools${queryString ? '?' + queryString : ''}`;
    
    const response = await this.request(endpoint);
    
    // 缓存结果
    this.cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return response;
  }

  // 获取工具详情
  async getTool(toolId) {
    const cacheKey = `tool_${toolId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const response = await this.request(`/api/tools/${toolId}`);
    
    this.cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return response;
  }

  // 追踪点击
  async trackClick(toolId, clickType = 'direct') {
    return await this.request('/api/analytics/click', {
      method: 'POST',
      body: JSON.stringify({
        toolId,
        clickType,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    });
  }

  // 追踪转化
  async trackConversion(toolId, clickId, amount, commission) {
    return await this.request('/api/analytics/conversion', {
      method: 'POST',
      body: JSON.stringify({
        toolId,
        clickId,
        amount,
        commission
      })
    });
  }

  // 获取分析数据
  async getAnalytics(period = '30') {
    return await this.request(`/api/analytics?period=${period}`);
  }

  // 搜索工具
  async searchTools(query, filters = {}) {
    return await this.getTools({
      search: query,
      ...filters
    });
  }

  // 按分类获取工具
  async getToolsByCategory(category) {
    return await this.getTools({ category });
  }

  // 按类型获取工具
  async getToolsByType(type) {
    return await this.getTools({ type });
  }

  // 获取热门工具
  async getPopularTools(limit = 10) {
    const analytics = await this.getAnalytics();
    return analytics.data.topTools.slice(0, limit);
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
  }

  // 健康检查
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// 创建单例实例
const apiService = new ApiService();

export default apiService;