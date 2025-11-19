import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              🤖 AI工具赚钱机器
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#tools" className="text-gray-700 hover:text-blue-600">
              AI工具
            </a>
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              功能特性
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600">
              价格方案
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">
              联系我们
            </a>
          </nav>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            开始赚钱
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;