import React from 'react';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const UserFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 关于我们 */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-indigo-400">
              AI工具导航
            </h3>
            <p className="text-gray-300 mb-4">
              专注于为用户推荐最适合的AI工具解决方案，
              帮助您提升工作效率，解决实际问题。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <a href="#tools" className="text-gray-300 hover:text-indigo-400 transition">
                  工具推荐
                </a>
              </li>
              <li>
                <a href="#categories" className="text-gray-300 hover:text-indigo-400 transition">
                  分类浏览
                </a>
              </li>
              <li>
                <a href="#guides" className="text-gray-300 hover:text-indigo-400 transition">
                  使用指南
                </a>
              </li>
              <li>
                <a href="#comparison" className="text-gray-300 hover:text-indigo-400 transition">
                  工具对比
                </a>
              </li>
            </ul>
          </div>

          {/* 热门分类 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">热门分类</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition">
                  内容创作
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition">
                  设计制作
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition">
                  编程开发
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition">
                  营销推广
                </a>
              </li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">联系我们</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="text-indigo-400" />
                <span>contact@aitools.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="text-indigo-400" />
                <span>+86 123-4567-8900</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} className="text-indigo-400" />
                <span>北京市朝阳区</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 AI工具导航. 保留所有权利.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                隐私政策
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                服务条款
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                Cookie政策
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;