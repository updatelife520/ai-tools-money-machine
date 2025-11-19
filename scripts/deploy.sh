#!/bin/bash

# AI工具赚钱机器部署脚本

echo "🚀 开始部署AI工具赚钱机器到GitHub Pages..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 部署到GitHub Pages
echo "🌐 部署到GitHub Pages..."
npm run deploy

echo "✅ 部署完成！"
echo "🌍 您的网站将在几分钟内可访问"
echo "📊 访问地址: https://yourusername.github.io/ai-tools-money-machine"