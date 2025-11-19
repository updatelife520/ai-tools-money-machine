#!/bin/bash

# GitHub 自动部署脚本
echo "🚀 开始部署 AI工具赚钱机器 到 GitHub Pages..."

# 检查是否有 GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI 未安装，请先安装 GitHub CLI"
    echo "安装命令: winget install GitHub.cli"
    exit 1
fi

# 创建 GitHub 仓库
echo "📁 创建 GitHub 仓库..."
gh repo create ai-tools-money-machine --public --source=. --remote=origin --push

# 等待仓库创建完成
echo "⏳ 等待仓库创建完成..."
sleep 5

# 部署到 GitHub Pages
echo "🌐 部署到 GitHub Pages..."
npm run deploy

echo "✅ 部署完成！"
echo "🌍 访问地址: https://$(gh api user --jq '.login').github.io/ai-tools-money-machine"
echo "📊 GitHub 仓库: https://github.com/$(gh api user --jq '.login')/ai-tools-money-machine"