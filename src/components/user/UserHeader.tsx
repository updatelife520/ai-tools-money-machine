import React from 'react';
import { Search, Menu, X } from 'lucide-react';

const UserHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">
                AI工具导航
              </h1>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#tools" className="text-gray-700 hover:text-indigo-600 transition">
              工具推荐
            </a>
            <a href="#categories" className="text-gray-700 hover:text-indigo-600 transition">
              分类浏览
            </a>
            <a href="#guides" className="text-gray-700 hover:text-indigo-600 transition">
              使用指南
            </a>
            <a href="#comparison" className="text-gray-700 hover:text-indigo-600 transition">
              工具对比
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索AI工具..."
                className="w-64 px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#tools" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                工具推荐
              </a>
              <a href="#categories" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                分类浏览
              </a>
              <a href="#guides" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                使用指南
              </a>
              <a href="#comparison" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                工具对比
              </a>
            </div>
            <div className="px-4 py-3">
              <input
                type="text"
                placeholder="搜索AI工具..."
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UserHeader;