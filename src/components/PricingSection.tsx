import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

const PricingSection: React.FC = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: '', price: '' });

  const pricingPlans = [
    {
      name: '免费版',
      price: '¥0',
      description: '适合个人用户探索AI工具',
      features: [
        '访问100+基础AI工具',
        '基础搜索功能',
        '工具使用教程',
        '社区支持'
      ],
      limitations: [
        '每日搜索限制10次',
        '无高级功能',
        '无数据分析'
      ],
      popular: false,
      buttonText: '开始使用',
      buttonColor: 'from-gray-600 to-gray-700'
    },
    {
      name: '专业版',
      price: '¥29',
      description: '适合专业用户和内容创作者',
      features: [
        '访问1000+AI工具',
        '无限制搜索',
        '高级筛选功能',
        '个性化推荐',
        '使用数据分析',
        '优先客服支持',
        'API访问权限'
      ],
      limitations: [],
      popular: true,
      buttonText: '立即升级',
      buttonColor: 'from-blue-600 to-purple-600'
    },
    {
      name: '企业版',
      price: '¥99',
      description: '适合团队和企业用户',
      features: [
        '专业版所有功能',
        '团队协作功能',
        '自定义工具分类',
        '白标解决方案',
        '专属客户经理',
        '定制化服务',
        'SLA保障'
      ],
      limitations: [],
      popular: false,
      buttonText: '联系销售',
      buttonColor: 'from-green-600 to-emerald-600'
    }
  ];

  const handleUpgrade = (planName: string, planPrice: string) => {
    setSelectedPlan({ name: planName, price: planPrice });
    if (planName !== '免费版' && planName !== '企业版') {
      setIsPaymentModalOpen(true);
    } else if (planName === '企业版') {
      alert('企业版请联系客服：support@aitools.com');
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
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
            <div className="w-2 h-2 bg-blue-400/20 rounded-full blur-sm"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl opacity-50 animate-pulse"></div>
            <h2 className="relative text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              选择适合您的方案
            </h2>
          </div>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            从免费探索到专业应用，我们为不同需求的用户提供灵活的定价方案
          </p>
        </div>

        {/* 价格卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group relative ${
                plan.popular ? 'scale-105' : ''
              }`}
            >
              {/* 热门标签 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold animate-pulse">
                    🔥 最受欢迎
                  </div>
                </div>
              )}

              {/* 背景光效 */}
              <div className={`absolute inset-0 bg-gradient-to-r ${
                plan.popular 
                  ? 'from-blue-500/30 to-purple-500/30' 
                  : 'from-white/5 to-white/10'
              } rounded-2xl blur-xl transition-all duration-500 group-hover:scale-105`}></div>

              {/* 卡片主体 */}
              <div className={`relative bg-white/10 backdrop-blur-md border ${
                plan.popular 
                  ? 'border-blue-400/30' 
                  : 'border-white/20'
              } rounded-2xl p-8 hover:bg-white/15 transition-all duration-300`}>
                {/* 头部信息 */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-blue-200">/月</span>
                  </div>
                  <p className="text-blue-200 mt-4">{plan.description}</p>
                </div>

                {/* 功能列表 */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-green-400">✓</span>
                      <span className="text-blue-100">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center space-x-3 opacity-60">
                      <span className="text-red-400">✗</span>
                      <span className="text-blue-200 line-through">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA按钮 */}
                <button
                  onClick={() => handleUpgrade(plan.name, plan.price)}
                  className={`w-full py-3 bg-gradient-to-r ${plan.buttonColor} text-white font-semibold rounded-xl hover:from-opacity-80 hover:to-opacity-80 transform hover:scale-105 transition-all duration-300 shadow-lg ${
                    plan.popular ? 'hover:shadow-blue-500/50' : ''
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 信任标识 */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-8 text-blue-200">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🔒</span>
              <span>安全支付</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">↩️</span>
              <span>30天退款</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">📞</span>
              <span>24/7支持</span>
            </div>
          </div>
        </div>
      </div>

      {/* 支付模态框 */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        toolName={selectedPlan.name}
        price={selectedPlan.price}
      />
    </section>
  );
};

export default PricingSection;