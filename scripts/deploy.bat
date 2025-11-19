@echo off
echo 🚀 开始部署AI工具赚钱机器到GitHub Pages...

echo 📦 构建项目...
call npm run build

echo 🌐 部署到GitHub Pages...
call npm run deploy

echo ✅ 部署完成！
echo 🌍 您的网站将在几分钟内可访问
echo 📊 访问地址: https://yourusername.github.io/ai-tools-money-machine
pause