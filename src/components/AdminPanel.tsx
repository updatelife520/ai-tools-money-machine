import React, { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  affiliateUrl?: string;
  pricing: string;
  features: string[];
  rating: number;
  requiresPayment: boolean;
  commission?: number;
}

const AdminPanel: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'ChatGPT',
      description: 'OpenAI开发的强大AI对话助手',
      category: '对话AI',
      url: 'https://chat.openai.com',
      affiliateUrl: 'https://chat.openai.com?affiliate=yourcode',
      pricing: '免费/付费',
      features: ['文本生成', '代码编写', '翻译'],
      rating: 4.8,
      requiresPayment: true,
      commission: 10
    }
  ]);

  const [newTool, setNewTool] = useState<Partial<Tool>>({
    name: '',
    description: '',
    category: '',
    url: '',
    pricing: '',
    features: [],
    rating: 0,
    requiresPayment: false
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const addTool = () => {
    if (newTool.name && newTool.url) {
      const tool: Tool = {
        id: Date.now().toString(),
        name: newTool.name,
        description: newTool.description || '',
        category: newTool.category || '其他',
        url: newTool.url,
        affiliateUrl: newTool.affiliateUrl,
        pricing: newTool.pricing || '免费',
        features: newTool.features || [],
        rating: newTool.rating || 0,
        requiresPayment: newTool.requiresPayment || false,
        commission: newTool.commission
      };
      setTools([...tools, tool]);
      setNewTool({
        name: '',
        description: '',
        category: '',
        url: '',
        pricing: '',
        features: [],
        rating: 0,
        requiresPayment: false
      });
      setShowAddForm(false);
    }
  };

  const deleteTool = (id: string) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  const exportTools = () => {
    const dataStr = JSON.stringify(tools, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ai-tools.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <button className="px-3 py-2 bg-black/60 backdrop-blur-md text-white text-sm rounded-lg hover:bg-black/80 border border-white/20">
        ⚙️ 管理后台
      </button>

      {/* 管理面板 */}
      <div className="absolute bottom-12 left-0 bg-black/80 backdrop-blur-md rounded-xl p-4 w-96 border border-white/20 max-h-96 overflow-y-auto">
        <h3 className="text-white font-semibold mb-4">工具管理</h3>
        
        <div className="space-y-3">
          {tools.map(tool => (
            <div key={tool.id} className="bg-white/10 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-medium">{tool.name}</h4>
                  <p className="text-blue-200 text-sm">{tool.category} • {tool.pricing}</p>
                </div>
                <button
                  onClick={() => deleteTool(tool.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  删除
                </button>
              </div>
              {tool.requiresPayment && (
                <div className="text-green-400 text-xs">
                  佣金: {tool.commission}%
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ➕ 添加工具
          </button>
          <button
            onClick={exportTools}
            className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📤 导出数据
          </button>
        </div>

        {/* 添加工具表单 */}
        {showAddForm && (
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <input
              type="text"
              placeholder="工具名称"
              value={newTool.name}
              onChange={(e) => setNewTool({...newTool, name: e.target.value})}
              className="w-full px-3 py-2 bg-black/50 text-white rounded mb-2"
            />
            <input
              type="text"
              placeholder="工具链接"
              value={newTool.url}
              onChange={(e) => setNewTool({...newTool, url: e.target.value})}
              className="w-full px-3 py-2 bg-black/50 text-white rounded mb-2"
            />
            <input
              type="text"
              placeholder="分类"
              value={newTool.category}
              onChange={(e) => setNewTool({...newTool, category: e.target.value})}
              className="w-full px-3 py-2 bg-black/50 text-white rounded mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={addTool}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                添加
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;