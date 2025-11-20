import React from 'react';
import { ArrowRight, Star, Zap, Shield } from 'lucide-react';

const UserHero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* 主标题 */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            找到最适合的
            <span className="block text-yellow-300">AI工具解决方案</span>
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
            不再为选择AI工具而烦恼，我们为您推荐最合适的解决方案，
            平均节省70%的选择时间
          </p>

          {/* 核心数据展示 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">1000+</div>
              <div className="text-sm text-indigo-100">精选AI工具</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">95%</div>
              <div className="text-sm text-indigo-100">问题解决率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">10分钟</div>
              <div className="text-sm text-indigo-100">平均解决时间</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">免费</div>
              <div className="text-sm text-indigo-100">大部分工具</div>
            </div>
          </div>

          {/* CTA按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('problem-solver')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              立即找到工具
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              浏览所有工具
            </button>
          </div>

          {/* 信任标识 */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-indigo-100">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-300" size={16} />
              <span>4.9/5 用户评分</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-300" size={16} />
              <span>快速匹配</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-yellow-300" size={16} />
              <span>安全可靠</span>
            </div>
          </div>
        </div>
      </div>

      {/* 装饰性背景 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </section>
  );
};

export default UserHero;