import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, MousePointer, Settings, LogOut, BarChart3, Target, Zap } from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  totalClicks: number;
  activeUsers: number;
  topTools: Array<{
    name: string;
    clicks: number;
    revenue: number;
    conversionRate: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    amount?: number;
  }>;
}

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 494.34,
    monthlyRevenue: 0,
    conversionRate: 0.46,
    totalClicks: 15,
    activeUsers: 234,
    topTools: [],
    recentActivity: []
  });
  
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'tools' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载管理后台数据
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 从API获取数据
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data) {
        setStats(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // 使用模拟数据
      setStats(prev => ({
        ...prev,
        topTools: [
          { name: 'ChatGPT', clicks: 45, revenue: 450, conversionRate: 2.3 },
          { name: 'Midjourney', clicks: 32, revenue: 480, conversionRate: 3.1 },
          { name: 'Claude', clicks: 28, revenue: 280, conversionRate: 2.0 }
        ],
        recentActivity: [
          { id: '1', type: 'commission', description: 'ChatGPT 订阅佣金', timestamp: '2分钟前', amount: 20 },
          { id: '2', type: 'click', description: '用户点击 Midjourney 链接', timestamp: '5分钟前' },
          { id: '3', type: 'commission', description: 'Claude Pro 佣金', timestamp: '1小时前', amount: 20 }
        ]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总收益"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          change={12.5}
          icon={<DollarSign size={24} className="text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="本月收益"
          value={`$${stats.monthlyRevenue.toFixed(2)}`}
          change={8.2}
          icon={<TrendingUp size={24} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="转化率"
          value={`${stats.conversionRate}%`}
          change={-2.1}
          icon={<Target size={24} className="text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="总点击量"
          value={stats.totalClicks}
          change={15.3}
          icon={<MousePointer size={24} className="text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* 热门工具和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门工具 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">热门工具</h3>
          <div className="space-y-4">
            {stats.topTools.map((tool, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{tool.name}</h4>
                  <p className="text-sm text-gray-600">{tool.clicks} 次点击</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${tool.revenue}</p>
                  <p className="text-sm text-gray-600">{tool.conversionRate}% 转化</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'commission' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'commission' ? <DollarSign size={16} /> : <MousePointer size={16} />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-600">{activity.timestamp}</p>
                </div>
                {activity.amount && (
                  <span className="font-semibold text-green-600">+${activity.amount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">数据分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">用户行为分析</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">平均停留时间</span>
                <span className="font-medium">3分42秒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">跳出率</span>
                <span className="font-medium">32.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">页面浏览量</span>
                <span className="font-medium">1,234</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">转化分析</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">点击转化率</span>
                <span className="font-medium">0.46%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">购买转化率</span>
                <span className="font-medium">2.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均佣金金额</span>
                <span className="font-medium">$20.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ToolsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">工具管理</h3>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            添加工具
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">工具名称</th>
                <th className="text-left py-3 px-4">分类</th>
                <th className="text-left py-3 px-4">点击量</th>
                <th className="text-left py-3 px-4">转化率</th>
                <th className="text-left py-3 px-4">收益</th>
                <th className="text-left py-3 px-4">状态</th>
                <th className="text-left py-3 px-4">操作</th>
              </tr>
            </thead>
            <tbody>
              {stats.topTools.map((tool, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{tool.name}</td>
                  <td className="py-3 px-4">AI助手</td>
                  <td className="py-3 px-4">{tool.clicks}</td>
                  <td className="py-3 px-4">{tool.conversionRate}%</td>
                  <td className="py-3 px-4 font-medium">${tool.revenue}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      活跃
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-indigo-600 hover:text-indigo-800 mr-2">编辑</button>
                    <button className="text-red-600 hover:text-red-800">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">系统设置</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">联盟网络配置</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Impact Radius ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="your-affiliate-id"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">自动化设置</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-gray-700">启用自动佣金追踪</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-gray-700">启用智能链接重定向</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-700">启用自动优化推荐</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载管理后台数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标签导航 */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              总览
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              数据分析
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'tools'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              工具管理
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              系统设置
            </button>
          </nav>
        </div>

        {/* 内容区域 */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'tools' && <ToolsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default AdminPanel;