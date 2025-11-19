import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">🤖 AI工具赚钱机器</h3>
            <p className="text-gray-400">
              全自动AI工具整合平台，让您轻松实现被动收入
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">产品功能</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">AI工具整合</a></li>
              <li><a href="#" className="hover:text-white">自动化营销</a></li>
              <li><a href="#" className="hover:text-white">收入分析</a></li>
              <li><a href="#" className="hover:text-white">API服务</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">支持</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">使用指南</a></li>
              <li><a href="#" className="hover:text-white">API文档</a></li>
              <li><a href="#" className="hover:text-white">常见问题</a></li>
              <li><a href="#" className="hover:text-white">联系我们</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">订阅更新</h4>
            <p className="text-gray-400 mb-4">
              获取最新的AI工具和赚钱策略
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="输入您的邮箱" 
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-900"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700">
                订阅
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AI工具赚钱机器. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;