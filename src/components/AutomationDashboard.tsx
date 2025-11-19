import React, { useState, useEffect } from 'react';
import AutomationController from '../automation/AutomationController';

interface SystemStatus {
  automation: {
    crawler: boolean;
    socialMedia: boolean;
    revenueOptimizer: boolean;
  };
  stats: {
    toolsCount: number;
    postsCount: number;
    revenueReport: any;
  };
  health: {
    lastCrawl: string | null;
    lastPost: string | null;
    lastOptimization: string | null;
  };
}

const AutomationDashboard: React.FC = () => {
  const [controller] = useState(() => new AutomationController());
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'crawler' | 'social' | 'revenue' | 'logs'>('overview');

  useEffect(() => {
    // 加载系统状态
    loadSystemStatus();
    
    // 定期更新状态
    const interval = setInterval(loadSystemStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = () => {
    try {
      const status = controller.getSystemStatus();
      setSystemStatus(status);
      
      // 检查是否正在运行
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const recentNotifications = notifications.filter((n: any) => {
        const time = new Date(n.timestamp);
        const now = new Date();
        return (now.getTime() - time.getTime()) < 60000; // 最近1分钟
      });
      
      setIsRunning(recentNotifications.length > 0);
      
    } catch (error) {
      console.error('加载系统状态失败:', error);
    }
  };

  const startAutomation = async () => {
    try {
      addLog('🚀 启动自动化系统...');
      await controller.startFullAutomation();
      setIsRunning(true);
      addLog('✅ 自动化系统启动成功');
      loadSystemStatus();
    } catch (error) {
      addLog(`❌ 启动失败: ${error}`);
    }
  };

  const stopAutomation = () => {
    try {
      controller.stopAutomation();
      setIsRunning(false);
      addLog('⏹️ 自动化系统已停止');
    } catch (error) {
      addLog(`❌ 停止失败: ${error}`);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [logEntry, ...prev].slice(0, 100)); // 保留最近100条日志
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportData = () => {
    const data = {
      systemStatus,
      logs,
      exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automation-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!systemStatus) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        {/* 头部 */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">🤖 自动化控制中心</h1>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                ✖️ 关闭
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span>{isRunning ? '运行中' : '已停止'}</span>
              </div>
              
              <button
                onClick={isRunning ? stopAutomation : startAutomation}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isRunning ? '⏹️ 停止系统' : '▶️ 启动系统'}
              </button>
              
              <button
                onClick={exportData}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                📊 导出数据
              </button>
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex gap-2 bg-black/60 rounded-xl p-2">
            {[
              { id: 'overview', label: '📊 总览', icon: '📈' },
              { id: 'crawler', label: '🕷️ 爬虫', icon: '🔍' },
              { id: 'social', label: '📱 社交', icon: '📤' },
              { id: 'revenue', label: '💰 收益', icon: '💵' },
              { id: 'logs', label: '📋 日志', icon: '📝' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-blue-200 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 系统状态卡片 */}
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 border border-blue-400/20">
                <h3 className="text-xl font-bold text-white mb-4">🤖 自动化状态</h3>
                <div className="space-y-3">
                  {Object.entries(systemStatus.automation).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-blue-200 capitalize">
                        {key === 'crawler' ? '爬虫系统' : key === 'socialMedia' ? '社交媒体' : '收益优化'}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 数据统计 */}
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 border border-purple-400/20">
                <h3 className="text-xl font-bold text-white mb-4">📊 数据统计</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-200">AI工具数量</span>
                    <span className="text-white font-bold">{systemStatus.stats.toolsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">社交媒体帖子</span>
                    <span className="text-white font-bold">{systemStatus.stats.postsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">总收入</span>
                    <span className="text-white font-bold">
                      ${systemStatus.stats.revenueReport?.summary?.totalRevenue || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* 健康状态 */}
              <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-6 border border-green-400/20">
                <h3 className="text-xl font-bold text-white mb-4">💚 系统健康</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-green-200 text-sm">最后爬取</span>
                    <div className="text-white">
                      {systemStatus.health.lastCrawl ? 
                        new Date(systemStatus.health.lastCrawl).toLocaleString() : 
                        '尚未执行'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-green-200 text-sm">最后发布</span>
                    <div className="text-white">
                      {systemStatus.health.lastPost ? 
                        new Date(systemStatus.health.lastPost).toLocaleString() : 
                        '尚未执行'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-green-200 text-sm">最后优化</span>
                    <div className="text-white">
                      {systemStatus.health.lastOptimization ? 
                        new Date(systemStatus.health.lastOptimization).toLocaleString() : 
                        '尚未执行'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crawler' && (
            <div className="bg-black/60 rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">🕷️ 爬虫系统管理</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">爬虫配置</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-blue-200 mb-2">爬取间隔（分钟）</label>
                      <input
                        type="number"
                        defaultValue="60"
                        className="w-full px-4 py-2 bg-black/50 text-white rounded-lg border border-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">数据源</label>
                      <div className="space-y-2">
                        {['Product Hunt', 'GitHub', 'Reddit'].map(source => (
                          <label key={source} className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span className="text-white">{source}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">爬取统计</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200">今日爬取</span>
                      <span className="text-white font-bold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">成功率</span>
                      <span className="text-white font-bold">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">错误次数</span>
                      <span className="text-white font-bold">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="bg-black/60 rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">📱 社交媒体管理</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">平台配置</h3>
                  <div className="space-y-4">
                    {['Twitter', 'LinkedIn', 'Reddit'].map(platform => (
                      <div key={platform} className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{platform}</span>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span className="text-blue-200">启用</span>
                          </label>
                        </div>
                        <div className="text-sm text-blue-200">
                          每日发布: 3次 | 最佳时间: 9:00, 12:00, 18:00
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">发布统计</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200">今日发布</span>
                      <span className="text-white font-bold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">总互动量</span>
                      <span className="text-white font-bold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">转化率</span>
                      <span className="text-white font-bold">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="bg-black/60 rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">💰 收益优化管理</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">收益概览</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200">今日收入</span>
                      <span className="text-green-400 font-bold text-xl">
                        ${systemStatus.stats.revenueReport?.summary?.totalRevenue || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">总佣金</span>
                      <span className="text-white font-bold">
                        ${systemStatus.stats.revenueReport?.summary?.totalCommission || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">转化率</span>
                      <span className="text-white font-bold">
                        {((systemStatus.stats.revenueReport?.summary?.avgConversionRate || 0) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">优化建议</h3>
                  <div className="space-y-2">
                    {systemStatus.stats.revenueReport?.optimizationSuggestions?.slice(0, 3).map((suggestion: any, index: number) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3">
                        <div className="text-white font-medium mb-1">{suggestion.title}</div>
                        <div className="text-sm text-blue-200">{suggestion.description}</div>
                        <div className="text-xs text-green-400 mt-1">预期影响: {suggestion.expectedImpact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-black/60 rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">📋 系统日志</h2>
                <button
                  onClick={clearLogs}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  🗑️ 清空日志
                </button>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4 h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-center text-blue-200 py-8">暂无日志记录</div>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono text-green-400">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationDashboard;