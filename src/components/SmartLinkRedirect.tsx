import React, { useState, useEffect } from 'react';

interface ToolInfo {
  id: string;
  name: string;
  type: 'free' | 'freemium' | 'paid';
  pricing?: string;
  affiliateUrl?: string;
  directUrl: string;
  description: string;
  features: string[];
}

interface SmartRedirectProps {
  tool: ToolInfo;
  onRedirect: (toolId: string, type: string) => void;
  children?: React.ReactNode;
}

const SmartLinkRedirect: React.FC<SmartRedirectProps> = (props) => {
  const { tool, onRedirect, children } = props;
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [userChoice, setUserChoice] = useState<'affiliate' | 'direct' | null>(null);

  const handleToolClick = () => {
    // 智能判断跳转策略
    if (tool.type === 'free') {
      // 免费工具直接跳转
      performRedirect('direct');
    } else if (tool.type === 'paid' && tool.affiliateUrl) {
      // 付费工具显示选择
      setShowRedirectModal(true);
      startCountdown();
    } else {
      // 其他情况直接跳转
      performRedirect('direct');
    }
  };

  const startCountdown = () => {
    let count = 5;
    setCountdown(count);
    
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(timer);
        // 默认选择联盟链接（支持我们）
        performRedirect('affiliate');
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  const performRedirect = (type: 'affiliate' | 'direct') => {
    setUserChoice(type);
    onRedirect(tool.id, type);
    
    const url = type === 'affiliate' ? tool.affiliateUrl : tool.directUrl;
    
    // 记录转化数据
    trackRedirect(tool.id, type);
    
    // 延迟跳转，让用户看到反馈
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setShowRedirectModal(false);
    }, 1000);
  };

  const trackRedirect = async (toolId: string, type: string) => {
    try {
      await fetch('/api/analytics/track-redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          redirectType: type,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.error('Failed to track redirect:', error);
    }
  };

  return (
    <>
      {/* 工具点击触发器 */}
      <div onClick={handleToolClick} className="cursor-pointer">
        {children}
      </div>

      {/* 智能重定向弹窗 */}
      {showRedirectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 max-w-md w-full border border-white/20 transform animate-pulse">
            
            {/* 工具信息 */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-2">{tool.name}</h3>
              <p className="text-blue-200 text-sm">{tool.description}</p>
              {tool.pricing && (
                <div className="mt-2 text-yellow-400 font-bold">{tool.pricing}</div>
              )}
            </div>

            {/* 功能特点 */}
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <div className="text-white font-medium mb-2">✨ 主要功能：</div>
              <ul className="text-blue-200 text-sm space-y-1">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* 选择按钮 */}
            <div className="space-y-3 mb-6">
              {/* 支持我们选项 */}
              {tool.affiliateUrl && (
                <button
                  onClick={() => performRedirect('affiliate')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>💝 支持我们</span>
                  <span className="text-sm opacity-80">(免费给您)</span>
                </button>
              )}

              {/* 直接访问选项 */}
              <button
                onClick={() => performRedirect('direct')}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
              >
                <span>🔗 直接访问</span>
                <span className="text-sm opacity-60">官网</span>
              </button>
            </div>

            {/* 倒计时提示 */}
            <div className="text-center">
              <div className="text-blue-200 text-sm mb-2">
                {countdown > 0 ? (
                  <span>⏰ {countdown}秒后自动选择支持我们</span>
                ) : (
                  <span className="text-green-400">✅ 正在跳转...</span>
                )}
              </div>
              <div className="text-xs text-blue-300">
                选择"支持我们"不会增加您的费用，但能帮助我们维持网站运营
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 使用示例组件
const ToolCard: React.FC<{ tool: ToolInfo }> = ({ tool }) => {
  const handleRedirect = (toolId: string, type: string) => {
    console.log(`Tool ${toolId} redirected via ${type}`);
    // 这里可以添加额外的逻辑，比如更新UI状态
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer transform hover:scale-105">
      <SmartLinkRedirect tool={tool} onRedirect={handleRedirect}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{tool.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tool.type === 'free' ? 'bg-green-500/20 text-green-400' :
            tool.type === 'freemium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {tool.type === 'free' ? '免费' :
             tool.type === 'freemium' ? '免费增值' : '付费'}
          </span>
        </div>
        
        <p className="text-blue-200 text-sm mb-4">{tool.description}</p>
        
        {tool.pricing && (
          <div className="text-yellow-400 font-bold mb-4">{tool.pricing}</div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-blue-300 text-sm">点击访问</span>
          <span className="text-white">→</span>
        </div>
      </SmartLinkRedirect>
    </div>
  );
};

export { SmartLinkRedirect, ToolCard };