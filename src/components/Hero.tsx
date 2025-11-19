import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleMusic = () => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* 背景音乐 */}
      <audio id="bg-music" loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        <source src="https://www.bensound.com/bensound-music/bensound-technology.mp3" type="audio/mpeg" />
      </audio>

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* 动态粒子背景 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
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
                <div className="w-1 h-1 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>

        {/* 动态光效 */}
        <div 
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
            transition: 'all 0.3s ease-out'
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* 主标题动画 */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 animate-gradient">
                AI工具导航站
              </h1>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50 animate-pulse"></div>
                <p className="relative text-2xl md:text-4xl text-white font-light">
                  精选优质AI工具，提升工作效率
                </p>
              </div>
            </div>

            {/* 副标题 */}
            <p className="text-xl md:text-2xl mb-12 text-blue-200 max-w-3xl mx-auto leading-relaxed">
              🤖 1000+实用AI工具 • ⚡ 提升工作效率 • 💎 解决实际问题
            </p>

            {/* CTA按钮组 */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50">
                <span className="relative z-10 text-lg">🔍 免费探索工具</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </button>
              <button className="group relative px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <span className="text-lg">📖 使用指南</span>
              </button>
            </div>

            {/* 统计数据卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { value: "1000+", label: "精选AI工具", icon: "🤖", color: "from-blue-500 to-cyan-500" },
                { value: "50+", label: "应用场景", icon: "⚡", color: "from-purple-500 to-pink-500" },
                { value: "1M+", label: "用户信赖", icon: "👥", color: "from-green-500 to-emerald-500" }
              ].map((stat, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4">{stat.icon}</div>
                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-blue-200">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 功能特性展示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🎯", title: "智能推荐", desc: "根据需求推荐最适合的AI工具" },
                { icon: "📊", title: "效率提升", desc: "平均节省70%工作时间" },
                { icon: "🤝", title: "免费使用", desc: "大部分工具提供免费版本" },
                { icon: "🚀", title: "快速上手", desc: "详细教程，5分钟掌握" }
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-blue-200 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部波浪动画 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 text-blue-900/20" viewBox="0 0 1440 120" fill="none">
            <path 
              d="M0,64 C360,96 720,32 1440,64 L1440,120 L0,120 Z" 
              fill="currentColor"
              className="animate-wave"
            ></path>
          </svg>
        </div>

        {/* 音乐控制按钮 */}
        <button
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          {isPlaying ? "🔇" : "🎵"}
        </button>
      </section>
    </>
  );
};

export default Hero;