import React, { useState, useEffect } from 'react';

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  features: string[];
}

const ToolsGrid: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载工具数据
    const mockTools: Tool[] = [
      {
        id: 1,
        name: "ChatGPT",
        description: "强大的AI对话助手，支持多种任务",
        category: "对话AI",
        pricing: "免费/付费",
        url: "https://chat.openai.com",
        features: ["文本生成", "代码编写", "翻译", "分析"]
      },
      {
        id: 2,
        name: "Midjourney",
        description: "高质量AI图像生成工具",
        category: "图像AI",
        pricing: "付费",
        url: "https://midjourney.com",
        features: ["图像生成", "艺术创作", "设计辅助"]
      },
      {
        id: 3,
        name: "Claude",
        description: "Anthropic开发的AI助手",
        category: "对话AI",
        pricing: "免费/付费",
        url: "https://claude.ai",
        features: ["长文本处理", "分析", "写作辅助"]
      },
      {
        id: 4,
        name: "GitHub Copilot",
        description: "AI代码助手，提高编程效率",
        category: "编程AI",
        pricing: "付费",
        url: "https://github.com/features/copilot",
        features: ["代码补全", "函数生成", "注释生成"]
      },
      {
        id: 5,
        name: "Notion AI",
        description: "集成在Notion中的AI助手",
        category: "生产力AI",
        pricing: "付费",
        url: "https://notion.so",
        features: ["文档生成", "总结", "翻译", "头脑风暴"]
      },
      {
        id: 6,
        name: "Perplexity",
        description: "AI驱动的搜索引擎",
        category: "搜索AI",
        pricing: "免费/付费",
        url: "https://perplexity.ai",
        features: ["智能搜索", "信息整合", "来源引用"]
      }
    ];

    setTimeout(() => {
      setTools(mockTools);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">正在加载AI工具...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tools" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            精选AI工具
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们为您精选了最优质的AI工具，覆盖各个领域，助您提高效率，创造价值
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {tool.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{tool.description}</p>
                
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-900">价格: </span>
                  <span className="text-sm text-gray-600">{tool.pricing}</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    访问工具
                  </a>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
            查看更多工具 (1000+)
          </button>
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;