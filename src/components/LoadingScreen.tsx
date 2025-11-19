import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      {/* 动态背景 */}
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
            <div className="w-2 h-2 bg-blue-400/30 rounded-full blur-sm"></div>
          </div>
        ))}
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center">
        {/* Logo动画 */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 animate-bounce">
              <span className="text-6xl">🤖</span>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
          AI工具赚钱机器
        </h1>

        {/* 副标题 */}
        <p className="text-xl text-blue-200 mb-8">正在启动您的财富引擎...</p>

        {/* 进度条 */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* 进度百分比 */}
        <p className="text-blue-300 mb-8">{progress}%</p>

        {/* 加载动画 */}
        <div className="flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>

        {/* 提示文字 */}
        <p className="text-sm text-blue-300 mt-8 animate-pulse">
          🚀 准备开启AI赚钱之旅...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;