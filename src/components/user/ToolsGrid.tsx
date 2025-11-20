import React, { useState, useEffect } from 'react';
import { ExternalLink, Star, Users, DollarSign, Clock, Filter, Search } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  rating: number;
  users: string;
  features: string[];
  affiliateUrl: string;
  isFree: boolean;
}

const ToolsGrid: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    // 模拟工具数据 - 实际应用中从API获取
    const mockTools: Tool[] = [
      {
        id: '1',
        name: 'ChatGPT',
        category: 'content',
        description: '强大的对话AI，适合内容创作、编程辅助、学习辅导',
        price: '$20/月',
        rating: 4.8,
        users: '100M+',
        features: ['多语言支持', '代码生成', '文档写作', '对话记忆'],
        affiliateUrl: 'https://openai.com/blog/chatgpt',
        isFree: false
      },
      {
        id: '2',
        name: 'Claude',
        category: 'content',
        description: 'Anthropic开发的AI助手，擅长长文本处理和复杂推理',
        price: '$20/月',
        rating: 4.7,
        users: '10M+',
        features: ['长文本处理', '代码分析', '学术写作', '安全对话'],
        affiliateUrl: 'https://claude.ai',
        isFree: false
      },
      {
        id: '3',
        name: 'Midjourney',
        category: 'design',
        description: '顶级的AI图像生成工具，创造令人惊叹的视觉艺术',
        price: '$10/月',
        rating: 4.9,
        users: '15M+',
        features: ['高质量图像', '艺术风格', '图像编辑', '批量生成'],
        affiliateUrl: 'https://midjourney.com',
        isFree: false
      },
      {
        id: '4',
        name: 'GitHub Copilot',
        category: 'coding',
        description: 'AI编程助手，实时代码建议和自动补全',
        price: '$10/月',
        rating: 4.6,
        users: '5M+',
        features: ['代码补全', '函数生成', '多语言支持', 'IDE集成'],
        affiliateUrl: 'https://github.com/features/copilot',
        isFree: false
      },
      {
        id: '5',
        name: 'Notion AI',
        category: 'productivity',
        description: '集成在Notion中的AI助手，提升文档和工作流效率',
        price: '$10/月',
        rating: 4.5,
        users: '20M+',
        features: ['文档生成', '任务管理', '会议记录', '知识整理'],
        affiliateUrl: 'https://notion.so',
        isFree: false
      },
      {
        id: '6',
        name: 'Canva AI',
        category: 'design',
        description: '简单易用的设计工具，AI辅助快速创建专业设计',
        price: '免费/付费',
        rating: 4.4,
        users: '135M+',
        features: ['模板设计', 'AI建议', '品牌工具', '团队协作'],
        affiliateUrl: 'https://canva.com',
        isFree: true
      }
    ];

    setTools(mockTools);
    setFilteredTools(mockTools);
  }, []);

  useEffect(() => {
    let filtered = tools;

    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 价格过滤
    if (priceFilter === 'free') {
      filtered = filtered.filter(tool => tool.isFree);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(tool => !tool.isFree);
    }

    setFilteredTools(filtered);
  }, [tools, selectedCategory, searchTerm, priceFilter]);

  const handleToolClick = (tool: Tool) => {
    // 触发商业逻辑：记录工具点击，跳转到联盟链接
    window.dispatchEvent(new CustomEvent('toolAffiliateClick', { 
      detail: { 
        toolId: tool.id, 
        toolName: tool.name, 
        category: tool.category,
        price: tool.price
      } 
    }));
    
    // 实际跳转（这里模拟，实际应用中会跳转到联盟链接）
    console.log(`跳转到 ${tool.name} 的联盟链接: ${tool.affiliateUrl}`);
  };

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: 'content', label: '内容创作' },
    { value: 'design', label: '设计制作' },
    { value: 'coding', label: '编程开发' },
    { value: 'marketing', label: '营销推广' },
    { value: 'data', label: '数据分析' },
    { value: 'productivity', label: '效率提升' }
  ];

  return (
    <section id="tools" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            精选AI工具
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们为您精选了最优质的AI工具，帮助您提升工作效率
          </p>
        </div>

        {/* 过滤器 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 分类选择 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* 价格过滤 */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">全部价格</option>
              <option value="free">免费工具</option>
              <option value="paid">付费工具</option>
            </select>
          </div>
        </div>

        {/* 工具网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => handleToolClick(tool)}
            >
              {/* 工具头部 */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                    {tool.name}
                  </h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full mt-1">
                    {categories.find(cat => cat.value === tool.category)?.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{tool.price}</div>
                  {tool.isFree && (
                    <span className="text-xs text-green-600 font-medium">免费版本</span>
                  )}
                </div>
              </div>

              {/* 描述 */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {tool.description}
              </p>

              {/* 特性 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded"
                  >
                    {feature}
                  </span>
                ))}
                {tool.features.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{tool.features.length - 3}
                  </span>
                )}
              </div>

              {/* 统计信息 */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span>{tool.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{tool.users}</span>
                </div>
              </div>

              {/* CTA按钮 */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition group-hover:bg-indigo-700">
                立即使用
                <ExternalLink size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* 无结果状态 */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Filter size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">没有找到符合条件的工具</p>
              <p className="text-sm mt-2">请尝试调整筛选条件</p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                setPriceFilter('all');
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              重置筛选
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolsGrid;