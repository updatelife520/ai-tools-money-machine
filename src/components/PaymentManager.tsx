import React, { useState } from 'react';

interface ToolLink {
  id: string;
  name: string;
  url: string;
  affiliateUrl?: string;
  pricing: string;
  requiresPayment: boolean;
  commission?: number;
}

const PaymentManager: React.FC = () => {
  const [toolLinks, setToolLinks] = useState<ToolLink[]>([
    {
      id: '1',
      name: 'ChatGPT Plus',
      url: 'https://chat.openai.com',
      affiliateUrl: 'https://chat.openai.com?affiliate=yourcode',
      pricing: '$20/月',
      requiresPayment: true,
      commission: 10
    },
    {
      id: '2',
      name: 'Midjourney',
      url: 'https://midjourney.com',
      affiliateUrl: 'https://midjourney.com?affiliate=yourcode',
      pricing: '$10-60/月',
      requiresPayment: true,
      commission: 15
    }
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolLink | null>(null);

  const handleToolClick = (tool: ToolLink) => {
    if (tool.requiresPayment && tool.affiliateUrl) {
      setSelectedTool(tool);
      setShowPaymentModal(true);
    } else {
      window.open(tool.url, '_blank');
    }
  };

  const handlePayment = () => {
    // 这里集成Stripe或其他支付系统
    if (selectedTool?.affiliateUrl) {
      window.open(selectedTool.affiliateUrl, '_blank');
      // 记录点击和转化
      trackAffiliateClick(selectedTool.id);
    }
    setShowPaymentModal(false);
  };

  const trackAffiliateClick = (toolId: string) => {
    // 发送到后端API记录转化数据
    console.log('Affiliate click tracked:', toolId);
    // 实际项目中调用: fetch('/api/affiliate/click', { method: 'POST', body: JSON.stringify({ toolId }) })
  };

  return (
    <>
      {/* 支付弹窗 */}
      {showPaymentModal && selectedTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 max-w-md w-full border border-white/20">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedTool.name}</h3>
              <p className="text-blue-200">通过我们的链接购买，支持网站发展</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">价格</span>
                <span className="text-xl font-bold text-green-400">{selectedTool.pricing}</span>
              </div>
              {selectedTool.commission && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">我们获得佣金</span>
                  <span className="text-yellow-400">{selectedTool.commission}%</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                继续购买
              </button>
            </div>

            <div className="text-center text-xs text-blue-200">
              点击继续购买将跳转到官方支付页面
            </div>
          </div>
        </div>
      )}

      {/* 工具链接管理 */}
      <div className="fixed top-4 right-4 z-40">
        <button className="px-3 py-2 bg-black/60 backdrop-blur-md text-white text-sm rounded-lg hover:bg-black/80 border border-white/20">
          💰 收益管理
        </button>
      </div>
    </>
  );
};

export default PaymentManager;