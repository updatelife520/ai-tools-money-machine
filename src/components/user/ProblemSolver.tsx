import React, { useState } from 'react';
import { ArrowRight, PenTool, Palette, Code, TrendingUp, BarChart3, Zap } from 'lucide-react';

const ProblemSolver: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'content',
      title: '内容创作',
      description: '需要快速生成高质量文章、视频脚本、社交媒体内容',
      icon: PenTool,
      color: 'from-blue-500 to-cyan-500',
      tools: ['ChatGPT', 'Claude', 'Jasper', 'Copy.ai']
    },
    {
      id: 'design',
      title: '设计制作',
      description: '需要快速制作图片、海报、UI设计、logo等视觉内容',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      tools: ['Midjourney', 'DALL-E', 'Canva AI', 'Figma AI']
    },
    {
      id: 'coding',
      title: '编程开发',
      description: '需要代码辅助、调试、文档生成、项目开发',
      icon: Code,
      color: 'from-green-500 to-emerald-500',
      tools: ['GitHub Copilot', 'Cursor', 'Replit AI', 'Tabnine']
    },
    {
      id: 'marketing',
      title: '营销推广',
      description: '需要市场分析、用户画像、营销策略、广告优化',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      tools: ['HubSpot AI', 'Marketo AI', 'AdCreative AI', 'Jasper AI']
    },
    {
      id: 'data',
      title: '数据分析',
      description: '需要数据处理、图表制作、报告生成、趋势分析',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      tools: ['Tableau AI', 'Power BI AI', 'Julius AI', 'Polymer']
    },
    {
      id: 'productivity',
      title: '效率提升',
      description: '需要时间管理、任务规划、文档整理、会议记录',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      tools: ['Notion AI', 'Motion AI', 'Fireflies.ai', 'Otter.ai']
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // 触发商业逻辑：记录用户选择，用于后续推荐优化
    window.dispatchEvent(new CustomEvent('userCategorySelected', { 
      detail: { category: categoryId } 
    }));
  };

  const getRecommendedTools = () => {
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.tools : [];
  };

  return (
    <section id="problem-solver" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            遇到什么问题？
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            选择您遇到的问题类型，我们将为您推荐最适合的AI工具解决方案
          </p>
        </div>

        {/* 问题分类网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? 'bg-gradient-to-br ' + category.color + ' text-white shadow-xl' 
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isSelected ? 'bg-white/20' : 'bg-gradient-to-br ' + category.color + ' text-white'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}>
                      {category.title}
                    </h3>
                    <p className={`text-sm ${
                      isSelected ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 推荐工具展示 */}
        {selectedCategory && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                为您推荐的AI工具
              </h3>
              <p className="text-gray-600">
                基于您的需求，我们精选了以下工具
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getRecommendedTools().map((tool, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => {
                    // 触发商业逻辑：记录工具点击，跳转到联盟链接
                    window.dispatchEvent(new CustomEvent('toolClick', { 
                      detail: { tool, category: selectedCategory } 
                    }));
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                      {tool}
                    </h4>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition" />
                  </div>
                  <p className="text-sm text-gray-600">
                    立即体验
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <button 
                onClick={() => {
                  // 触发商业逻辑：查看更多工具
                  window.dispatchEvent(new CustomEvent('viewMoreTools', { 
                    detail: { category: selectedCategory } 
                  }));
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              >
                查看更多工具
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* 未选择状态的提示 */}
        {!selectedCategory && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-full text-gray-600">
              <Zap size={20} />
              <span>请选择左侧的问题类型，我们将为您推荐最适合的AI工具</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProblemSolver;