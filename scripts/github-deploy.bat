@echo off
echo 🚀 开始部署 AI工具赚钱机器 到 GitHub Pages...

REM 检查 Git 是否初始化
if not exist ".git" (
    echo 📁 初始化 Git 仓库...
    git init
)

REM 添加所有文件
echo 📝 添加文件到 Git...
git add .

REM 提交更改
echo 💾 提交更改...
git commit -m "自动部署 - %date% %time%"

REM 检查是否有远程仓库
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 请先在 GitHub 上创建仓库并添加远程仓库
    echo 📋 执行步骤：
    echo 1. 访问 https://github.com/new
    echo 2. 创建仓库 ai-tools-money-machine
    echo 3. 执行: git remote add origin https://github.com/YOUR_USERNAME/ai-tools-money-machine.git
    echo 4. 执行: git push -u origin master
    pause
    exit /b 1
)

REM 推送到 GitHub
echo 📤 推送到 GitHub...
git push origin master

REM 部署到 GitHub Pages
echo 🌐 部署到 GitHub Pages...
call npm run deploy

echo ✅ 部署完成！
echo 🌍 访问地址: https://YOUR_USERNAME.github.io/ai-tools-money-machine
echo 📊 请将 YOUR_USERNAME 替换为您的 GitHub 用户名
pause