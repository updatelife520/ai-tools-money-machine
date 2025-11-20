import React, { useState, useEffect } from 'react';
import './App.css';

// 用户端组件 - 简洁清晰
import UserHeader from './components/user/UserHeader';
import UserHero from './components/user/UserHero';
import ProblemSolver from './components/user/ProblemSolver';
import ToolsGrid from './components/user/ToolsGrid';
import UserFooter from './components/user/UserFooter';

// 管理端组件 - 后台功能
import AdminPanel from './components/admin/AdminPanel';

// 核心业务逻辑 - 隐藏在后台
import CommissionTracker from './components/business/CommissionTracker';
import SmartLinkRedirect from './components/business/SmartLinkRedirect';
import { CommissionTracker as CommissionTrackerClass } from './components/business/CommissionTracker';
import { SmartLinkRedirect as SmartLinkRedirectClass } from './components/business/SmartLinkRedirect';

function App() {
  const [currentPage, setCurrentPage] = useState('user');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 快速初始化，不阻塞UI
    const initApp = () => {
      // 检查是否在管理页面
      if (window.location.pathname.includes('/admin')) {
        setCurrentPage('admin');
        setIsAdmin(true);
      }
      
      // 异步初始化商业逻辑（用户无感知）
      CommissionTrackerClass.initialize();
      SmartLinkRedirectClass.initialize();
      
      setIsInitialized(true);
    };

    // 使用 requestAnimationFrame 确保DOM已渲染
    requestAnimationFrame(initApp);
  }, []);

  // 快速加载状态
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  // 用户端界面 - 专注工具推荐
  if (currentPage === 'user') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 商业逻辑组件 - 用户不可见 */}
        <CommissionTracker />
        <SmartLinkRedirect />
        
        {/* 用户界面 - 简洁清晰 */}
        <UserHeader />
        <UserHero />
        <ProblemSolver />
        <ToolsGrid />
        <UserFooter />
      </div>
    );
  }

  // 管理端界面 - 专注收益管理
  if (currentPage === 'admin' && isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminPanel />
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;