@echo off
chcp 65001 >nul
echo ========================================
echo    🚀 CYY家具電商 - 一鍵部署到網上
echo ========================================
echo.

echo 📋 部署準備檢查...
echo.

:: 檢查Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git未安裝！請先安裝Git：https://git-scm.com/
    pause
    exit /b 1
) else (
    echo ✅ Git已安裝
)

:: 檢查是否已經是Git倉庫
if not exist ".git" (
    echo ❌ 請先運行 git init 初始化倉庫
    pause
    exit /b 1
) else (
    echo ✅ Git倉庫已初始化
)

echo.
echo 🌐 選擇部署方案：
echo.
echo 1. 🚀 Vercel + Railway（推薦 - 穩定快速）
echo 2. 🆓 Netlify + Render（完全免費）
echo 3. ⚡ Railway全棧（最簡單）
echo 4. 📖 查看詳細部署指南
echo 5. ❌ 取消
echo.

set /p choice=請選擇 (1-5): 

if "%choice%"=="1" goto vercel_railway
if "%choice%"=="2" goto netlify_render  
if "%choice%"=="3" goto railway_fullstack
if "%choice%"=="4" goto show_guide
if "%choice%"=="5" goto exit
goto invalid_choice

:vercel_railway
echo.
echo 🚀 Vercel + Railway 部署方案
echo ================================
echo.
echo 📝 請按照以下步驟操作：
echo.
echo 1️⃣ 推送到GitHub：
echo    - 訪問 https://github.com/new
echo    - 創建名為 'cyy-furniture' 的倉庫
echo    - 複製倉庫URL
echo.
set /p github_url=請輸入GitHub倉庫URL: 

echo.
echo 正在推送代碼到GitHub...
git remote add origin %github_url%
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ 代碼推送成功！
) else (
    echo ❌ 推送失敗，請檢查URL是否正確
    pause
    goto menu
)

echo.
echo 2️⃣ 部署後端到Railway：
echo    - 訪問 https://railway.app/
echo    - 用GitHub登錄
echo    - New Project → Deploy from GitHub repo
echo    - 選擇 cyy-furniture 倉庫
echo    - 設置 Root Directory 為 'backend'
echo    - Add Service → MySQL
echo.
echo 3️⃣ 部署前端到Vercel：
echo    - 訪問 https://vercel.com/
echo    - 用GitHub登錄  
echo    - New Project → 選擇 cyy-furniture 倉庫
echo    - 直接點擊 Deploy
echo.
echo 🌐 部署完成後您將獲得：
echo    - 前端：https://cyy-furniture.vercel.app
echo    - 後端：https://xxx.up.railway.app/api
echo.
pause
goto exit

:netlify_render
echo.
echo 🆓 Netlify + Render 免費方案
echo ==============================
echo.
echo 📝 請按照以下步驟操作：
echo.
echo 1️⃣ 推送到GitHub（同上）
echo.
echo 2️⃣ 部署後端到Render：
echo    - 訪問 https://render.com/
echo    - New → Web Service
echo    - 連接GitHub倉庫，選擇backend目錄
echo    - 免費PostgreSQL數據庫
echo.
echo 3️⃣ 部署前端到Netlify：
echo    - 訪問 https://netlify.com/
echo    - 拖拽整個項目文件夾
echo    - 或連接GitHub自動部署
echo.
pause
goto exit

:railway_fullstack
echo.
echo ⚡ Railway 全棧部署
echo ==================
echo.
echo 📝 最簡單的部署方式：
echo.
echo 1️⃣ 推送到GitHub（同上）
echo.
echo 2️⃣ 一鍵部署：
echo    - 訪問 https://railway.app/
echo    - New Project → Deploy from GitHub repo
echo    - 選擇整個 cyy-furniture 倉庫
echo    - Railway會自動檢測前後端
echo.
echo 🌐 完成後獲得統一域名訪問
echo.
pause
goto exit

:show_guide
echo.
echo 📖 正在打開部署指南...
start QUICK_DEPLOY.md
start DEPLOY_ONLINE.md
echo.
echo 請查看打開的文檔了解詳細步驟
pause
goto exit

:invalid_choice
echo.
echo ❌ 無效選項！請重新選擇
pause
goto menu

:menu
cls
echo ========================================
echo    🚀 CYY家具電商 - 一鍵部署到網上  
echo ========================================
echo.
echo 🌐 選擇部署方案：
echo.
echo 1. 🚀 Vercel + Railway（推薦 - 穩定快速）
echo 2. 🆓 Netlify + Render（完全免費）
echo 3. ⚡ Railway全棧（最簡單）
echo 4. 📖 查看詳細部署指南
echo 5. ❌ 取消
echo.
set /p choice=請選擇 (1-5): 
goto :choice

:exit
echo.
echo 🎉 感謝使用CYY家具電商部署工具！
echo 📞 如需技術支持，請訪問：https://github.com/你的倉庫/issues
echo.
pause
