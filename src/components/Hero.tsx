import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 检测移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 只在非移动设备上启用鼠标跟踪
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isMobile]);

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

        {/* 动态光效 - 只在非移动设备显示 */}
        {!isMobile && (
          <div 
            className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
            style={{
              left: `${mousePosition.x * 0.05}px`,
              top: `${mousePosition.y * 0.05}px`,
              transition: 'all 0.3s ease-out'
            }}
          ></div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* 主标题动画 */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 sm:mb-6 animate-gradient leading-tight">
                AI工具导航站
              </h1>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50 animate-pulse"></div>
                <p className="relative text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-light leading-tight">
                  精选优质AI工具，提升工作效率
                </p>
              </div>
            </div>

            {/* 副标题 */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 text-blue-200 max-w-3xl mx-auto leading-relaxed px-4">
              🤖 1000+实用AI工具 • ⚡ 提升工作效率 • 💎 解决实际问题
            </p>

            {/* CTA按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 w-full sm:w-auto">
                <span className="relative z-10 text-sm sm:text-base md:text-lg">🔍 免费探索工具</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </button>
              <button className="group relative px-6 py-3 sm:px-8 sm:py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                <span className="text-sm sm:text-base md:text-lg">📖 使用指南</span>
              </button>
            </div>

            {/* 统计数据卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16 px-4">
              {[
                { value: "1000+", label: "精选AI工具", icon: "🤖", color: "from-blue-500 to-cyan-500" },
                { value: "50+", label: "应用场景", icon: "⚡", color: "from-purple-500 to-pink-500" },
                { value: "1M+", label: "用户信赖", icon: "👥", color: "from-green-500 to-emerald-500" }
              ].map((stat, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-105 transition-all duration-300">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4">{stat.icon}</div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                    <div className="text-sm sm:text-base text-blue-200">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 功能特性展示 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
              {[
                { icon: "🎯", title: "智能推荐", desc: "根据需求推荐最适合的AI工具" },
                { icon: "📊", title: "效率提升", desc: "平均节省70%工作时间" },
                { icon: "🤝", title: "免费使用", desc: "大部分工具提供免费版本" },
                { icon: "🚀", title: "快速上手", desc: "详细教程，5分钟掌握" }
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg sm:rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{feature.icon}</div>
                    <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
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

        {/* 音乐控制按钮 - 移动端优化位置 */}
        <button
          onClick={toggleMusic}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <span className="text-sm sm:text-base">{isPlaying ? "🔇" : "🎵"}</span>
        </button>
      </section>
    </>
  );
};

export default Hero;