import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSolver from './components/ProblemSolver';
import ToolsGrid from './components/ToolsGrid';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      {/* 全局鼠标跟随光效 */}
      <div 
        className="pointer-events-none fixed w-96 h-96 bg-blue-500/10 rounded-full blur-3xl z-0"
        style={{
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
          transition: 'all 0.3s ease-out'
        }}
      ></div>

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