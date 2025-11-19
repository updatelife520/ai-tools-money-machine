import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            全自动AI工具赚钱机器
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            整合1000+AI工具，自动化营销，被动收入，24小时不间断赚钱
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              立即开始免费试用
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
              查看演示
            </button>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-blue-100">AI工具整合</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-100">自动化运营</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">¥50K+</div>
              <div className="text-blue-100">月收入潜力</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;