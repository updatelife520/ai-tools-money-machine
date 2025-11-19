import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
        {[...Array(20)].map((_, i) => (
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
            <div className="w-1 h-1 bg-blue-400/20 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                  <span className="text-white text-xl">🤖</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">AI工具导航站</h3>
            </div>
            <p className="text-blue-200 leading-relaxed">
              精选优质AI工具，解决实际问题，提升工作效率，让AI成为您的得力助手
            </p>
            <div className="flex space-x-4">
              {['Twitter', 'GitHub', 'Discord', 'Telegram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-sm">
                    {social === 'Twitter' && '🐦'}
                    {social === 'GitHub' && '🐙'}
                    {social === 'Discord' && '💬'}
                    {social === 'Telegram' && '✈️'}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 产品功能 */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <span className="mr-2">⚡</span> 产品功能
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'AI工具整合', icon: '🔧' },
                { name: '自动化营销', icon: '📈' },
                { name: '收入分析', icon: '💰' },
                { name: 'API服务', icon: '🔌' },
                { name: '数据监控', icon: '📊' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href="#" 
                    className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-300 group"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform">{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 支持与资源 */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <span className="mr-2">💎</span> 支持与资源
            </h4>
            <ul className="space-y-3">
              {[
                { name: '使用指南', icon: '📚' },
                { name: 'API文档', icon: '📄' },
                { name: '视频教程', icon: '🎥' },
                { name: '常见问题', icon: '❓' },
                { name: '联系我们', icon: '📞' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href="#" 
                    className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-300 group"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform">{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 订阅更新 */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <span className="mr-2">🚀</span> 订阅更新
            </h4>
            <p className="text-blue-200 mb-6 leading-relaxed">
              获取最新AI工具推荐和实用技巧，抢先一步掌握AI工具使用方法
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱地址" 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                {isSubscribed ? '✅ 订阅成功！' : '🔔 立即订阅'}
              </button>
            </form>
            <p className="text-xs text-blue-300 mt-4">
              📧 每周精选内容，随时可取消订阅
            </p>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-blue-200 text-sm">
              <p>&copy; 2025 AI工具赚钱机器. 保留所有权利.</p>
              <p className="mt-1">🔒 您的数据安全是我们的首要任务</p>
            </div>
            <div className="flex space-x-6 text-sm text-blue-200">
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
              <a href="#" className="hover:text-white transition-colors">Cookie设置</a>
            </div>
          </div>
        </div>

        {/* 成功提示 */}
        {isSubscribed && (
          <div className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl transform animate-bounce">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold">订阅成功！</p>
                <p className="text-sm">您将收到我们的最新资讯</p>
              </div>
            </div>
          </div>
        )}
      </div>


    </footer>
  );
};

export default Footer;