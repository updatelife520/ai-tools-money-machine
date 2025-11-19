import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  price: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, toolName, price }) => {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'paypal' | 'crypto'>('stripe');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: '支持信用卡、借记卡，安全可靠',
      icon: '💳',
      fee: '2.9% + $0.30',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: '全球通用，支持多种支付方式',
      icon: '🅿️',
      fee: '3.4% + $0.30',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'crypto',
      name: '加密货币',
      description: 'USDT、比特币等，手续费低',
      icon: '₿',
      fee: '1% 固定费率',
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  const handlePayment = async () => {
    setIsLoading(true);
    
    // 模拟支付处理
    setTimeout(() => {
      setIsLoading(false);
      alert('支付功能正在集成中，敬请期待！');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-white/10 shadow-2xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          ✕
        </button>

        {/* 头部 */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">升级到专业版</h2>
          <p className="text-blue-200">解锁 {toolName} 的全部功能</p>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">{price}</span>
            <span className="text-blue-200">/月</span>
          </div>
        </div>

        {/* 支付方式选择 */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">选择支付方式</h3>
          
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id as any)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold">{method.name}</h4>
                    <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded">
                      {method.fee}
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm">{method.description}</p>
                </div>
              </div>
              
              {/* 选中指示器 */}
              {selectedMethod === method.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          ))}

          {/* 安全提示 */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-400 mb-2">
              <span>🔒</span>
              <span className="font-semibold">安全保障</span>
            </div>
            <ul className="text-green-300 text-sm space-y-1">
              <li>• SSL加密传输</li>
              <li>• 符合PCI DSS标准</li>
              <li>• 30天退款保证</li>
            </ul>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>处理中...</span>
              </div>
            ) : (
              `立即支付 ${price}`
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
          >
            取消
          </button>
        </div>

        {/* 底部说明 */}
        <div className="px-6 pb-6">
          <p className="text-xs text-blue-300 text-center">
            支付即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;