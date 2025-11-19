import React, { useState, useEffect } from 'react';

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  features: string[];
  rating: number;
  users: string;
  trending?: boolean;
}

const ToolsGrid: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = ['全部', '对话AI', '图像AI', '编程AI', '生产力AI', '搜索AI'];

  useEffect(() => {
    const mockTools: Tool[] = [
      {
        id: 1,
        name: "ChatGPT",
        description: "OpenAI开发的强大AI对话助手，支持文本生成、代码编写、翻译等多种任务",
        category: "对话AI",
        pricing: "免费/付费",
        url: "https://chat.openai.com",
        features: ["文本生成", "代码编写", "翻译", "分析"],
        rating: 4.8,
        users: "100M+",
        trending: true
      },
      {
        id: 2,
        name: "Midjourney",
        description: "基于Discord的高质量AI图像生成工具，创造令人惊叹的艺术作品",
        category: "图像AI",
        pricing: "付费",
        url: "https://midjourney.com",
        features: ["图像生成", "艺术创作", "设计辅助"],
        rating: 4.9,
        users: "10M+",
        trending: true
      },
      {
        id: 3,
        name: "Claude",
        description: "Anthropic开发的AI助手，擅长长文本处理和深度分析",
        category: "对话AI",
        pricing: "免费/付费",
        url: "https://claude.ai",
        features: ["长文本处理", "分析", "写作辅助"],
        rating: 4.7,
        users: "5M+"
      },
      {
        id: 4,
        name: "GitHub Copilot",
        description: "GitHub与OpenAI合作的AI代码助手，大幅提高编程效率",
        category: "编程AI",
        pricing: "付费",
        url: "https://github.com/features/copilot",
        features: ["代码补全", "函数生成", "注释生成"],
        rating: 4.6,
        users: "1M+"
      },
      {
        id: 5,
        name: "Notion AI",
        description: "集成在Notion中的AI助手，提升文档处理和知识管理效率",
        category: "生产力AI",
        pricing: "付费",
        url: "https://notion.so",
        features: ["文档生成", "总结", "翻译", "头脑风暴"],
        rating: 4.5,
        users: "20M+"
      },
      {
        id: 6,
        name: "Perplexity",
        description: "AI驱动的搜索引擎，提供准确的信息来源和深度分析",
        category: "搜索AI",
        pricing: "免费/付费",
        url: "https://perplexity.ai",
        features: ["智能搜索", "信息整合", "来源引用"],
        rating: 4.4,
        users: "2M+",
        trending: true
      }
    ];

    setTimeout(() => {
      setTools(mockTools);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTools = selectedCategory === '全部' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <div className="absolute animate-ping h-16 w-16 rounded-full bg-blue-500/20"></div>
            </div>
            <p className="mt-8 text-xl text-blue-200 animate-pulse">正在加载AI工具宇宙...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tools" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-blue-400/30 rounded-full blur-sm"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl opacity-50 animate-pulse"></div>
            <h2 className="relative text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              AI工具宇宙
            </h2>
          </div>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            精选1000+顶级AI工具，覆盖所有应用场景，让您在AI时代保持领先优势
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-12 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 工具卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onMouseEnter={() => !isMobile && setHoveredCard(tool.id)}
              onMouseLeave={() => !isMobile && setHoveredCard(null)}
              className="group relative"
            >
              {/* 背景光效 */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-500 ${
                hoveredCard === tool.id ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}></div>

              {/* 卡片主体 */}
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                {/* 头部信息 */}
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">{tool.name}</h3>
                      {tool.trending && (
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full animate-pulse whitespace-nowrap">
                          🔥 热门
                        </span>
                      )}
                    </div>
                    <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-blue-500/20 text-blue-300 text-xs sm:text-sm rounded-full border border-blue-400/30">
                      {tool.category}
                    </span>
                  </div>
                </div>

                {/* 描述 */}
                <p className="text-blue-200 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">{tool.description}</p>

                {/* 统计信息 */}
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs sm:text-sm">⭐</span>
                    <span className="text-white font-semibold">{tool.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-400 text-xs sm:text-sm">👥</span>
                    <span className="text-blue-200">{tool.users}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-400 text-xs sm:text-sm">💰</span>
                    <span className="text-blue-200">{tool.pricing}</span>
                  </div>
                </div>

                {/* 功能标签 */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {tool.features.slice(0, isMobile ? 3 : 4).map((feature, index) => (
                    <span 
                      key={index} 
                      className="px-1.5 py-1 sm:px-2 sm:py-1 bg-white/10 text-blue-200 text-xs rounded-lg border border-white/20"
                    >
                      {feature}
                    </span>
                  ))}
                  {isMobile && tool.features.length > 3 && (
                    <span className="px-1.5 py-1 bg-white/10 text-blue-200 text-xs rounded-lg border border-white/20">
                      +{tool.features.length - 3}
                    </span>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 sm:gap-3">
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 text-sm sm:text-base"
                  >
                    🚀 立即使用
                  </a>
                  <button className="px-3 py-2 sm:px-4 sm:py-3 bg-white/10 text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm sm:text-base">
                    💎 详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多按钮 */}
        <div className="text-center mt-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50">
            <span className="relative z-10 text-lg">🔍 探索更多AI工具 (1000+)</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </button>
        </div>
      </div>


    </section>
  );
};

export default ToolsGrid;