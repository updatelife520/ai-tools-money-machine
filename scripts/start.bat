@echo off
echo ========================================
echo   AI工具导航站 - 项目启动器
echo ========================================
echo.
echo 项目位置: D:\project1\ai-tools-money-machine
echo.
echo 正在启动项目主页...
echo.

REM 检查文件是否存在
if exist "D:\project1\ai-tools-money-machine\start.html" (
    echo ✅ 找到启动页面
    start "" "D:\project1\ai-tools-money-machine\start.html"
    echo ✅ 项目已启动！
) else (
    echo ❌ 错误: 找不到启动页面
    echo 请检查项目文件是否完整
    pause
    exit /b 1
)

echo.
echo ========================================
echo   项目信息:
echo   - 主页: start.html
echo   - AI工具导航: public/index.html  
echo   - 管理后台: public/admin.html
echo   - 项目文档: docs/
echo ========================================
echo.
echo 按任意键关闭此窗口...
pause > nul