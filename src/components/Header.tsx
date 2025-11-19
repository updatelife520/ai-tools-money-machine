import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo区域 */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                <span className="text-white text-xl">🤖</span>
              </div>
            </div>
            <h1 className={`text-xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-white' : 'text-white'
            }`}>
              AI工具导航站
            </h1>
          </div>

          {/* 导航菜单 - 桌面版 */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'AI工具', href: '#tools', icon: '🔧' },
              { name: '功能特性', href: '#features', icon: '⚡' },
              { name: '价格方案', href: '#pricing', icon: '💎' },
              { name: '成功案例', href: '#cases', icon: '📈' },
              { name: '联系我们', href: '#contact', icon: '📞' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
                <div className="w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </a>
            ))}
          </nav>

          {/* CTA按钮组 */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-300">
              登录
            </button>
            <button className="group relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50">
              <span className="relative z-10">🔍 探索工具</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </button>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <div className="space-y-1">
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* 移动端菜单 */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            {[
              { name: 'AI工具', href: '#tools', icon: '🔧' },
              { name: '功能特性', href: '#features', icon: '⚡' },
              { name: '价格方案', href: '#pricing', icon: '💎' },
              { name: '成功案例', href: '#cases', icon: '📈' },
              { name: '联系我们', href: '#contact', icon: '📞' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                登录
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                🚀 开始赚钱
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;