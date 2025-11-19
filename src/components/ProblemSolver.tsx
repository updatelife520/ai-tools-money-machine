import React, { useState } from 'react';

const ProblemSolver: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState('');
  const [solutions, setSolutions] = useState<any[]>([]);

  const problems = [
    {
      id: 'content',
      title: '内容创作',
      icon: '✍️',
      description: '需要快速生成高质量文章、视频脚本、社交媒体内容',
      solutions: [
        { tool: 'ChatGPT', use: '文章写作、内容规划', free: true },
        { tool: 'Jasper AI', use: '营销文案、品牌内容', free: false },
        { tool: 'Copy.ai', use: '广告文案、产品描述', free: true }
      ]
    },
    {
      id: 'design',
      title: '设计制作',
      icon: '🎨',
      description: '需要快速制作图片、海报、UI设计、logo等视觉内容',
      solutions: [
        { tool: 'Midjourney', use: 'AI图像生成、艺术创作', free: false },
        { tool: 'Canva AI', use: '海报设计、社交媒体图', free: true },
        { tool: 'Figma AI', use: 'UI设计、原型制作', free: true }
      ]
    },
    {
      id: 'coding',
      title: '编程开发',
      icon: '💻',
      description: '需要代码辅助、调试、文档生成、项目开发',
      solutions: [
        { tool: 'GitHub Copilot', use: '代码补全、函数生成', free: false },
        { tool: 'Cursor', use: 'AI编程助手、代码优化', free: true },
        { tool: 'Replit AI', use: '在线编程、项目协作', free: true }
      ]
    },
    {
      id: 'marketing',
      title: '营销推广',
      icon: '📈',
      description: '需要市场分析、用户画像、营销策略、广告优化',
      solutions: [
        { tool: 'HubSpot AI', use: '客户分析、营销自动化', free: true },
        { tool: 'SEMrush AI', use: 'SEO分析、关键词研究', free: false },
        { tool: 'Mailchimp AI', use: '邮件营销、客户细分', free: true }
      ]
    },
    {
      id: 'data',
      title: '数据分析',
      icon: '📊',
      description: '需要数据处理、图表制作、报告生成、趋势分析',
      solutions: [
        { tool: 'Tableau AI', use: '数据可视化、商业智能', free: false },
        { tool: 'Julius AI', use: '数据分析、报告生成', free: true },
        { tool: 'Polymer', use: '智能图表、数据洞察', free: true }
      ]
    },
    {
      id: 'productivity',
      title: '效率提升',
      icon: '⚡',
      description: '需要时间管理、任务规划、文档整理、会议记录',
      solutions: [
        { tool: 'Notion AI', use: '文档管理、任务规划', free: false },
        { tool: 'Motion AI', use: '智能日程、时间管理', free: true },
        { tool: 'Otter.ai', use: '会议记录、语音转文字', free: true }
      ]
    }
  ];

  const handleProblemSelect = (problemId: string) => {
    setSelectedProblem(problemId);
    const problem = problems.find(p => p.id === problemId);
    setSolutions(problem?.solutions || []);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
        {[...Array(25)].map((_, i) => (
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
            <div className="w-2 h-2 bg-purple-400/20 rounded-full blur-sm"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-50 animate-pulse"></div>
            <h2 className="relative text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">
              遇到问题？AI来解决
            </h2>
          </div>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            选择您遇到的问题，我们将为您推荐最适合的AI工具解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 问题选择区域 */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">选择您的问题类型</h3>
            <div className="space-y-4">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => handleProblemSelect(problem.id)}
                  className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedProblem === problem.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{problem.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {problem.title}
                      </h4>
                      <p className="text-blue-200">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* 选中指示器 */}
                  {selectedProblem === problem.id && (
                    <div className="absolute top-6 right-6 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 解决方案展示区域 */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">推荐解决方案</h3>
            
            {selectedProblem ? (
              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    {/* 背景光效 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">
                            {solution.tool}
                          </h4>
                          <p className="text-blue-200 mb-3">
                            适用场景：{solution.use}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {solution.free ? (
                            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-400/30">
                              ✅ 免费版可用
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full border border-yellow-400/30">
                              💎 付费功能
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                          立即试用
                        </button>
                        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🤔</div>
                <p className="text-xl text-blue-200">
                  请选择左侧的问题类型，我们将为您推荐最适合的AI工具
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 底部统计 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-blue-200">用户问题解决率</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">10分钟</div>
            <div className="text-blue-200">平均问题解决时间</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">1000+</div>
            <div className="text-blue-200">AI工具解决方案</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolver;