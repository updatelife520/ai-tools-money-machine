// AI工具自动化爬虫系统
interface ToolData {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  pricing: string;
  features: string[];
  rating: number;
  users: string;
  tags: string[];
  lastUpdated: Date;
  source: 'producthunt' | 'github' | 'reddit' | 'alternativeTo' | 'manual';
}

class ToolCrawler {
  private sources = {
    productHunt: {
      url: 'https://api.producthunt.com/v2/api/graphql',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_PRODUCTHUNT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    },
    github: {
      url: 'https://api.github.com/search/repositories',
      headers: {
        'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    },
    reddit: {
      url: 'https://www.reddit.com/r/ArtificialIntelligence/hot.json',
      headers: {
        'User-Agent': 'AI-Tools-Crawler/1.0'
      }
    }
  };

  // 从Product Hunt爬取AI工具
  async crawlProductHunt(): Promise<ToolData[]> {
    try {
      const query = `
        query {
          posts(first: 20, topic: "ai-tools") {
            edges {
              node {
                id
                name
                tagline
                description
                url
                votesCount
                commentsCount
                featuredAt
                topics {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch(this.sources.productHunt.url, {
        method: 'POST',
        headers: this.sources.productHunt.headers,
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      return this.transformProductHuntData(data.data.posts.edges);
    } catch (error) {
      console.error('Product Hunt爬取失败:', error);
      return [];
    }
  }

  // 从GitHub爬取AI项目
  async crawlGitHub(): Promise<ToolData[]> {
    try {
      const keywords = ['AI', 'artificial intelligence', 'machine learning', 'GPT', 'LLM'];
      const tools: ToolData[] = [];

      for (const keyword of keywords) {
        const response = await fetch(
          `${this.sources.github.url}?q=${keyword}+language:javascript&sort=stars&order=desc&per_page=10`,
          { headers: this.sources.github.headers }
        );

        const data = await response.json();
        tools.push(...this.transformGitHubData(data.items, keyword));
      }

      return tools;
    } catch (error) {
      console.error('GitHub爬取失败:', error);
      return [];
    }
  }

  // 从Reddit爬取AI工具讨论
  async crawlReddit(): Promise<ToolData[]> {
    try {
      const response = await fetch(this.sources.reddit.url, {
        headers: this.sources.reddit.headers
      });

      const data = await response.json();
      return this.transformRedditData(data.data.children);
    } catch (error) {
      console.error('Reddit爬取失败:', error);
      return [];
    }
  }

  // 数据转换函数
  private transformProductHuntData(edges: any[]): ToolData[] {
    return edges.map(edge => {
      const node = edge.node;
      return {
        id: `ph_${node.id}`,
        name: node.name,
        description: node.tagline || node.description,
        category: this.extractCategory(node.topics.edges.map((t: any) => t.node.name)),
        url: node.url,
        pricing: this.detectPricing(node.description),
        features: this.extractFeatures(node.description),
        rating: Math.min(5, Math.max(1, node.votesCount / 100)),
        users: `${node.votesCount}+`,
        tags: node.topics.edges.map((t: any) => t.node.name),
        lastUpdated: new Date(node.featuredAt),
        source: 'producthunt'
      };
    });
  }

  private transformGitHubData(items: any[], keyword: string): ToolData[] {
    return items.map(item => ({
      id: `gh_${item.id}`,
      name: item.name,
      description: item.description || `GitHub上的${keyword}项目`,
      category: '编程AI',
      url: item.html_url,
      pricing: '开源免费',
      features: ['开源代码', '社区支持', '持续更新'],
      rating: Math.min(5, Math.max(1, item.stargazers_count / 1000)),
      users: `${item.stargazers_count}+`,
      tags: [keyword, 'github', '开源'],
      lastUpdated: new Date(item.updated_at),
      source: 'github'
    }));
  }

  private transformRedditData(posts: any[]): ToolData[] {
    const tools: ToolData[] = [];
    
    posts.forEach(post => {
      const data = post.data;
      if (this.isAIToolPost(data.title, data.selftext)) {
        tools.push({
          id: `rd_${data.id}`,
          name: this.extractToolName(data.title),
          description: data.selftext || data.title,
          category: this.extractCategoryFromTitle(data.title),
          url: data.url,
          pricing: this.detectPricing(data.selftext),
          features: this.extractFeatures(data.selftext),
          rating: Math.min(5, Math.max(1, data.score / 100)),
          users: `${data.score}+`,
          tags: this.extractTags(data.title, data.selftext),
          lastUpdated: new Date(data.created_utc * 1000),
          source: 'reddit'
        });
      }
    });

    return tools;
  }

  // 智能检测工具类型
  private isAIToolPost(title: string, content: string): boolean {
    const aiKeywords = [
      'AI', 'artificial intelligence', 'GPT', 'ChatGPT', 'Claude',
      'machine learning', 'LLM', 'language model', 'AI tool',
      '人工智能', 'AI工具', 'AI助手'
    ];
    
    const text = (title + ' ' + content).toLowerCase();
    return aiKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  // 价格检测
  private detectPricing(text: string): string {
    if (!text) return '免费';
    
    const textLower = text.toLowerCase();
    if (textLower.includes('free') || textLower.includes('免费')) {
      return '免费';
    } else if (textLower.includes('$') || textLower.includes('usd')) {
      const priceMatch = text.match(/\$(\d+)/);
      return priceMatch ? `$${priceMatch[1]}` : '付费';
    } else if (textLower.includes('subscription') || textLower.includes('月费')) {
      return '订阅制';
    }
    
    return '待确认';
  }

  // 功能提取
  private extractFeatures(text: string): string[] {
    if (!text) return [];
    
    const features: string[] = [];
    const featureKeywords = [
      'text generation', 'code generation', 'image generation', 'translation',
      'summarization', 'analysis', 'chat', 'automation', 'API',
      '文本生成', '代码生成', '图像生成', '翻译', '总结', '分析'
    ];
    
    featureKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        features.push(keyword);
      }
    });
    
    return features.slice(0, 5); // 最多返回5个功能
  }

  // 分类提取
  private extractCategory(topics: string[]): string {
    const categoryMap: { [key: string]: string } = {
      'productivity': '生产力AI',
      'design': '图像AI',
      'developer tools': '编程AI',
      'ai': '对话AI',
      'writing': '生产力AI',
      'image': '图像AI',
      'code': '编程AI'
    };

    for (const topic of topics) {
      const lowerTopic = topic.toLowerCase();
      for (const [key, value] of Object.entries(categoryMap)) {
        if (lowerTopic.includes(key)) {
          return value;
        }
      }
    }

    return '其他AI';
  }

  // 工具名称提取
  private extractToolName(title: string): string {
    // 简单的工具名称提取逻辑
    const cleanTitle = title.replace(/\[.*?\]|\(.*?\)|【.*?】/g, '').trim();
    return cleanTitle.split(' ')[0] || cleanTitle;
  }

  // 标签提取
  private extractTags(title: string, content: string): string[] {
    const text = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];
    
    const tagKeywords = [
      'AI', 'GPT', 'ChatGPT', 'Claude', 'Midjourney', 'Stable Diffusion',
      'API', 'free', 'open source', 'premium', 'tool', 'platform'
    ];
    
    tagKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        tags.push(keyword);
      }
    });
    
    return Array.from(new Set(tags)).slice(0, 8);
  }

  // 从标题提取分类
  private extractCategoryFromTitle(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('chat') || titleLower.includes('gpt')) {
      return '对话AI';
    } else if (titleLower.includes('image') || titleLower.includes('art')) {
      return '图像AI';
    } else if (titleLower.includes('code') || titleLower.includes('programming')) {
      return '编程AI';
    } else if (titleLower.includes('productivity') || titleLower.includes('tool')) {
      return '生产力AI';
    }
    
    return '其他AI';
  }

  // 主爬取函数
  async crawlAllSources(): Promise<ToolData[]> {
    console.log('🚀 开始爬取AI工具数据...');
    
    const [productHuntTools, githubTools, redditTools] = await Promise.all([
      this.crawlProductHunt(),
      this.crawlGitHub(),
      this.crawlReddit()
    ]);

    const allTools = [...productHuntTools, ...githubTools, ...redditTools];
    
    // 去重处理
    const uniqueTools = this.deduplicateTools(allTools);
    
    console.log(`✅ 爬取完成，共获取 ${uniqueTools.length} 个AI工具`);
    return uniqueTools;
  }

  // 工具去重
  private deduplicateTools(tools: ToolData[]): ToolData[] {
    const seen = new Set<string>();
    return tools.filter(tool => {
      const key = tool.name.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // 定时爬取
  startAutoCrawl(intervalMinutes: number = 60): void {
    console.log(`⏰ 启动自动爬取，每${intervalMinutes}分钟执行一次`);
    
    setInterval(async () => {
      try {
        const tools = await this.crawlAllSources();
        await this.saveTools(tools);
        console.log('🔄 自动爬取完成');
      } catch (error) {
        console.error('❌ 自动爬取失败:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  // 保存工具到数据库
  private async saveTools(tools: ToolData[]): Promise<void> {
    // 这里应该调用后端API保存到数据库
    // 暂时使用localStorage模拟
    const existingTools = JSON.parse(localStorage.getItem('aiTools') || '[]');
    const mergedTools = this.mergeTools(existingTools, tools);
    localStorage.setItem('aiTools', JSON.stringify(mergedTools));
  }

  // 合并工具数据
  private mergeTools(existing: ToolData[], newTools: ToolData[]): ToolData[] {
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
}

export default ToolCrawler;
export type { ToolData };