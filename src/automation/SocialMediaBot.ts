// 社交媒体自动化分发系统
interface SocialPost {
  id: string;
  platform: 'twitter' | 'linkedin' | 'reddit' | 'weibo' | 'wechat';
  content: string;
  toolId: string;
  toolName: string;
  toolUrl: string;
  hashtags: string[];
  imageUrl?: string;
  scheduledTime: Date;
  status: 'pending' | 'posted' | 'failed';
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

class SocialMediaBot {
  private platforms = {
    twitter: {
      apiKey: process.env.REACT_APP_TWITTER_API_KEY,
      apiSecret: process.env.REACT_APP_TWITTER_API_SECRET,
      accessToken: process.env.REACT_APP_TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.REACT_APP_TWITTER_ACCESS_TOKEN_SECRET,
      maxPostLength: 280
    },
    linkedin: {
      clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
      clientSecret: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET,
      accessToken: process.env.REACT_APP_LINKEDIN_ACCESS_TOKEN,
      maxPostLength: 1300
    },
    reddit: {
      clientId: process.env.REACT_APP_REDDIT_CLIENT_ID,
      clientSecret: process.env.REACT_APP_REDDIT_CLIENT_SECRET,
      userAgent: 'AIToolsBot/1.0'
    }
  };

  // 生成社交媒体内容
  generatePostContent(tool: any, platform: string): SocialPost {
    const templates = {
      twitter: {
        intro: [
          '🚀 发现超赞的AI工具！',
          '💡 这个AI工具太实用了！',
          '🤖 AI界新神器来了！',
          '⚡ 提升效率必备AI工具！'
        ],
        cta: [
          '免费试用 👉',
          '立即体验 👉',
          '不要错过 👉'
        ],
        hashtags: ['#AI工具', '#人工智能', '#效率工具', '#AI', '#Tech']
      },
      linkedin: {
        intro: [
          '【AI工具推荐】今天发现了一个非常实用的AI工具，',
          '分享一个值得关注的AI创新工具，',
          '在AI时代，这个工具能显著提升你的工作效率。'
        ],
        cta: [
          '了解更多：',
          '体验链接：',
          '访问地址：'
        ],
        hashtags: ['#AI', '#人工智能', '#数字化转型', '#效率提升', '#科技创新']
      },
      reddit: {
        intro: [
          'Found an amazing AI tool that you guys should check out:',
          'Hey r/ArtificialIntelligence, discovered this cool AI tool:',
          'This AI tool deserves more attention:'
        ],
        cta: [
          'Try it here:',
          'Link:',
          'Check it out:'
        ],
        hashtags: []
      }
    };

    const template = templates[platform as keyof typeof templates];
    const intro = template.intro[Math.floor(Math.random() * template.intro.length)];
    const cta = template.cta[Math.floor(Math.random() * template.cta.length)];

    let content = '';
    
    if (platform === 'twitter') {
      content = `${intro}\n\n${tool.name}\n${tool.description}\n\n${cta} ${tool.url}\n\n${template.hashtags.slice(0, 3).join(' ')}`;
    } else if (platform === 'linkedin') {
      content = `${intro}${tool.name}。

🎯 主要功能：
${tool.features.slice(0, 3).map((f: string) => `• ${f}`).join('\n')}

💰 价格：${tool.pricing}
⭐ 评分：${tool.rating}/5

${cta} ${tool.url}

${template.hashtags.join(' ')}

#AI工具推荐 #数字化转型`;
    } else if (platform === 'reddit') {
      content = `${intro}

**${tool.name}**
${tool.description}

**Features:**
${tool.features.slice(0, 3).map((f: string) => `• ${f}`).join('\n')}

**Pricing:** ${tool.pricing}
**Rating:** ${tool.rating}/5

${cta} ${tool.url}

What do you think about this tool? Has anyone tried it?`;
    }

    return {
      id: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      platform: platform as any,
      content,
      toolId: tool.id,
      toolName: tool.name,
      toolUrl: tool.url,
      hashtags: template.hashtags,
      scheduledTime: new Date(),
      status: 'pending'
    };
  }

  // 发布到Twitter
  async postToTwitter(post: SocialPost): Promise<boolean> {
    try {
      // Twitter API v2 实现
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.platforms.twitter.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: post.content
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Twitter发布成功:', data.id);
        return true;
      } else {
        console.error('❌ Twitter发布失败:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('❌ Twitter发布异常:', error);
      return false;
    }
  }

  // 发布到LinkedIn
  async postToLinkedIn(post: SocialPost): Promise<boolean> {
    try {
      // LinkedIn API 实现
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.platforms.linkedin.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author: `urn:li:person:${process.env.REACT_APP_LINKEDIN_PERSON_ID}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: post.content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        })
      });

      if (response.ok) {
        console.log('✅ LinkedIn发布成功');
        return true;
      } else {
        console.error('❌ LinkedIn发布失败:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('❌ LinkedIn发布异常:', error);
      return false;
    }
  }

  // 发布到Reddit
  async postToReddit(post: SocialPost, subreddit: string = 'ArtificialIntelligence'): Promise<boolean> {
    try {
      // 首先获取access token
      const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.platforms.reddit.clientId}:${this.platforms.reddit.clientSecret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.platforms.reddit.userAgent
        },
        body: 'grant_type=client_credentials'
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // 发布到Reddit
      const postResponse = await fetch(`https://oauth.reddit.com/r/${subreddit}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': this.platforms.reddit.userAgent
        },
        body: JSON.stringify({
          title: `AI Tool Recommendation: ${post.toolName}`,
          text: post.content,
          kind: 'self'
        })
      });

      if (postResponse.ok) {
        console.log('✅ Reddit发布成功');
        return true;
      } else {
        console.error('❌ Reddit发布失败:', await postResponse.text());
        return false;
      }
    } catch (error) {
      console.error('❌ Reddit发布异常:', error);
      return false;
    }
  }

  // 批量发布到所有平台
  async postToAllPlatforms(tool: any): Promise<{ [platform: string]: boolean }> {
    const results: { [platform: string]: boolean } = {};

    // 生成各平台内容
    const platforms = ['twitter', 'linkedin', 'reddit'];
    
    for (const platform of platforms) {
      try {
        const post = this.generatePostContent(tool, platform);
        
        let success = false;
        switch (platform) {
          case 'twitter':
            success = await this.postToTwitter(post);
            break;
          case 'linkedin':
            success = await this.postToLinkedIn(post);
            break;
          case 'reddit':
            success = await this.postToReddit(post);
            break;
        }
        
        results[platform] = success;
        
        // 平台间延迟，避免触发反垃圾机制
        await this.delay(5000);
        
      } catch (error) {
        console.error(`❌ ${platform}发布失败:`, error);
        results[platform] = false;
      }
    }

    return results;
  }

  // 定时发布
  async schedulePost(tool: any, scheduledTime: Date): Promise<void> {
    const delay = scheduledTime.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(async () => {
        console.log(`📅 开始发布 ${tool.name} 到社交媒体`);
        await this.postToAllPlatforms(tool);
      }, delay);
    }
  }

  // 自动化内容分发
  async autoDistribute(tools: any[]): Promise<void> {
    console.log('🚀 开始自动化内容分发...');
    
    // 按评分排序，优先推广高质量工具
    const sortedTools = tools.sort((a, b) => b.rating - a.rating);
    
    // 每天发布3-5个工具
    const dailyPosts = Math.min(5, Math.max(3, Math.floor(sortedTools.length / 10)));
    
    for (let i = 0; i < dailyPosts && i < sortedTools.length; i++) {
      const tool = sortedTools[i];
      const scheduledTime = new Date();
      scheduledTime.setHours(9 + i * 2, 0, 0, 0); // 9点开始，每2小时发布一个
      
      await this.schedulePost(tool, scheduledTime);
      
      console.log(`📅 已安排发布 ${tool.name} - ${scheduledTime.toLocaleString()}`);
    }
  }

  // 启动自动化分发
  startAutoDistribution(intervalHours: number = 24): void {
    console.log(`⏰ 启动自动化分发，每${intervalHours}小时执行一次`);
    
    // 立即执行一次
    this.executeAutoDistribution();
    
    // 设置定时执行
    setInterval(() => {
      this.executeAutoDistribution();
    }, intervalHours * 60 * 60 * 1000);
  }

  // 执行自动分发
  private async executeAutoDistribution(): Promise<void> {
    try {
      // 获取最新工具数据
      const tools = JSON.parse(localStorage.getItem('aiTools') || '[]');
      
      // 过滤最近24小时未发布的工具
      const recentTools = tools.filter((tool: any) => {
        const lastPosted = localStorage.getItem(`lastPosted_${tool.id}`);
        if (!lastPosted) return true;
        
        const lastPostedTime = new Date(lastPosted);
        const hoursSinceLastPost = (Date.now() - lastPostedTime.getTime()) / (1000 * 60 * 60);
        
        return hoursSinceLastPost >= 24; // 24小时内不重复发布
      });
      
      if (recentTools.length > 0) {
        await this.autoDistribute(recentTools);
        
        // 记录发布时间
        recentTools.forEach((tool: any) => {
          localStorage.setItem(`lastPosted_${tool.id}`, new Date().toISOString());
        });
        
        console.log(`✅ 自动分发完成，发布了 ${recentTools.length} 个工具`);
      } else {
        console.log('ℹ️ 暂无新工具需要发布');
      }
      
    } catch (error) {
      console.error('❌ 自动分发失败:', error);
    }
  }

  // 生成内容报告
  generateContentReport(): any {
    const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
    
    const report = {
      totalPosts: posts.length,
      byPlatform: {} as any,
      engagement: {
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0
      },
      topPerforming: posts
        .filter((p: SocialPost) => p.engagement)
        .sort((a: SocialPost, b: SocialPost) => 
          (b.engagement?.likes || 0) - (a.engagement?.likes || 0)
        )
        .slice(0, 5)
    };

    posts.forEach((post: SocialPost) => {
      report.byPlatform[post.platform] = (report.byPlatform[post.platform] || 0) + 1;
      
      if (post.engagement) {
        report.engagement.totalLikes += post.engagement.likes;
        report.engagement.totalShares += post.engagement.shares;
        report.engagement.totalComments += post.engagement.comments;
      }
    });

    return report;
  }

  // 工具函数：延迟
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default SocialMediaBot;
export type { SocialPost };