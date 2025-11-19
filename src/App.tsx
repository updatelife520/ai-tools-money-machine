import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSolver from './components/ProblemSolver';
import ToolsGrid from './components/ToolsGrid';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import MediaManager from './components/MediaManager';
import PaymentManager from './components/PaymentManager';
import AdminPanel from './components/AdminPanel';
import AutomationDashboard from './components/AutomationDashboard';
import CommissionSystem from './components/CommissionSystem';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAutomationDashboard, setShowAutomationDashboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* 自动化控制面板 */}
      {showAutomationDashboard && <AutomationDashboard />}
      
      {/* 媒体管理器 - 背景和音乐 */}
      <MediaManager />
      
      {/* 支付管理器 */}
      <PaymentManager />
      
      {/* 管理后台 */}
      <AdminPanel />
      
      {/* 收益统计系统 */}
      <CommissionSystem />

      {/* 自动化控制按钮 */}
      <button
        onClick={() => setShowAutomationDashboard(!showAutomationDashboard)}
        className="fixed top-20 right-4 z-40 px-3 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm rounded-lg hover:from-green-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        🤖 自动化
      </button>

      {/* 主要内容 */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <ProblemSolver />
        <ToolsGrid />
        <PricingSection />
        <Footer />
      </div>
    </div>
  );
}

export default App;