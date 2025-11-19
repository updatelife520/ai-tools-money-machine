import React, { useState, useEffect } from 'react';

interface CommissionData {
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  clickCount: number;
  topTools: Array<{
    name: string;
    revenue: number;
    clicks: number;
    commission: number;
  }>;
}

interface AffiliateLink {
  id: string;
  toolId: string;
  network: string;
  url: string;
  commission: number;
  isActive: boolean;
}

const CommissionSystem: React.FC = () => {
  const [commissionData, setCommissionData] = useState<CommissionData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    clickCount: 0,
    topTools: []
  });

  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    {
      id: '1',
      toolId: 'chatgpt',
      network: 'OpenAI Affiliate',
      url: 'https://chat.openai.com?affiliate=yourcode',
      commission: 10,
      isActive: true
    },
    {
      id: '2',
      toolId: 'midjourney',
      network: 'Midjourney Partner',
      url: 'https://midjourney.com?affiliate=yourcode',
      commission: 15,
      isActive: true
    }
  ]);

  const [showConfig, setShowConfig] = useState(false);

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCommissionData(prev => ({
        ...prev,
        totalRevenue: prev.totalRevenue + Math.random() * 100,
        clickCount: prev.clickCount + Math.floor(Math.random() * 5),
        conversionRate: Math.min(5, prev.conversionRate + Math.random() * 0.1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateAffiliateLink = (toolId: string, network: string) => {
    // 生成联盟链接的逻辑
    const baseUrl = 'https://your-site.com';
    const affiliateCode = 'your-affiliate-code';
    return `${baseUrl}/go/${toolId}?network=${network}&code=${affiliateCode}`;
  };

  const trackClick = async (linkId: string) => {
    // 发送点击追踪到后端
    try {
      await fetch('/api/commission/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, timestamp: Date.now() })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const trackConversion = async (linkId: string, amount: number) => {
    // 发送转化追踪到后端
    try {
      await fetch('/api/commission/track-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, amount, timestamp: Date.now() })
      });
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* 收益统计面板 */}
      <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">💰 收益统计</h3>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ⚙️
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-blue-300">总收益</div>
            <div className="text-white font-bold">
              ${commissionData.totalRevenue.toFixed(2)}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-blue-300">本月收益</div>
            <div className="text-green-400 font-bold">
              ${commissionData.monthlyRevenue.toFixed(2)}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-blue-300">转化率</div>
            <div className="text-yellow-400 font-bold">
              {commissionData.conversionRate.toFixed(2)}%
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-blue-300">点击量</div>
            <div className="text-purple-400 font-bold">
              {commissionData.clickCount}
            </div>
          </div>
        </div>
      </div>

      {/* 配置面板 */}
      {showConfig && (
        <div className="bg-black/90 backdrop-blur-md rounded-xl p-4 border border-white/20 w-80">
          <h3 className="text-white font-bold mb-3">🔗 联盟链接配置</h3>
          
          <div className="space-y-3">
            {affiliateLinks.map(link => (
              <div key={link.id} className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium capitalize">{link.toolId}</span>
                  <span className="text-green-400 text-sm">{link.commission}%</span>
                </div>
                <div className="text-blue-300 text-xs mb-2">{link.network}</div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={link.url}
                    readOnly
                    className="flex-1 bg-black/30 text-white text-xs px-2 py-1 rounded border border-white/20"
                  />
                  <button
                    onClick={() => trackClick(link.id)}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    测试
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/20">
            <button className="w-full px-3 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 text-sm font-medium">
              + 添加新链接
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionSystem;