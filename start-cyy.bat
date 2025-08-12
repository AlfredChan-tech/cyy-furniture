@echo off
chcp 65001 >nul
echo ====================================
echo    CYY家具電商網站啟動程序
echo ====================================
echo.

echo 正在檢查環境...

:: 檢查Java環境
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java未安裝！
    echo.
    echo 請先安裝Java 17或更高版本：
    echo 1. 訪問 https://adoptium.net/
    echo 2. 或運行: winget install EclipseAdoptium.Temurin.17.JDK
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Java環境正常
)

:: 檢查Docker（可選）
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker已安裝
    set DOCKER_AVAILABLE=1
) else (
    echo ⚠️  Docker未安裝（可選）
    set DOCKER_AVAILABLE=0
)

echo.
echo 請選擇啟動方式：
echo.
echo 1. 🚀 Docker部署（推薦 - 一鍵啟動）
echo 2. 💻 本地開發模式（僅後端API）
echo 3. 🌐 僅打開前端網站
echo 4. 📖 查看部署說明
echo 5. ❌ 退出
echo.

set /p choice=請輸入選項 (1-5): 

if "%choice%"=="1" goto docker_deploy
if "%choice%"=="2" goto local_dev
if "%choice%"=="3" goto frontend_only
if "%choice%"=="4" goto show_docs
if "%choice%"=="5" goto exit
goto invalid_choice

:docker_deploy
echo.
echo 🚀 使用Docker部署...
if %DOCKER_AVAILABLE% equ 0 (
    echo ❌ Docker未安裝！請先安裝Docker Desktop
    echo 下載地址: https://www.docker.com/products/docker-desktop
    pause
    goto menu
)

echo 正在構建並啟動服務...
docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ✅ 服務啟動成功！
    echo.
    echo 🌐 前端網站: http://localhost
    echo 🔧 後端API: http://localhost/api
    echo 📚 API文檔: http://localhost/api/swagger-ui.html
    echo 🛠️  管理後台: http://localhost:3000
    echo.
    echo 正在打開網站...
    timeout /t 3 /nobreak >nul
    start http://localhost
) else (
    echo ❌ 啟動失敗！請檢查Docker配置
)
pause
goto exit

:local_dev
echo.
echo 💻 啟動本地開發模式...
echo.
echo 1. 啟動後端服務...
cd backend
start "CYY Backend" cmd /k "run-dev.bat"
cd..

echo 2. 等待後端啟動...
timeout /t 5 /nobreak >nul

echo 3. 打開前端網站...
start index.html

echo.
echo ✅ 本地開發環境已啟動！
echo.
echo 🌐 前端網站: 瀏覽器中的 index.html
echo 🔧 後端API: http://localhost:8080/api
echo 📚 API文檔: http://localhost:8080/api/swagger-ui.html
echo.
pause
goto exit

:frontend_only
echo.
echo 🌐 打開前端網站...
start index.html
echo ✅ 前端網站已在瀏覽器中打開！
echo.
echo 注意：這只是靜態前端，沒有後端功能
echo 如需完整功能，請選擇選項1或2
echo.
pause
goto exit

:show_docs
echo.
echo 📖 正在打開部署說明...
start DEPLOYMENT.md
echo.
echo 請查看 DEPLOYMENT.md 文件了解詳細部署說明
pause
goto exit

:invalid_choice
echo.
echo ❌ 無效選項！請重新選擇
pause
goto menu

:menu
cls
echo ====================================
echo    CYY家具電商網站啟動程序
echo ====================================
echo.
echo 請選擇啟動方式：
echo.
echo 1. 🚀 Docker部署（推薦 - 一鍵啟動）
echo 2. 💻 本地開發模式（僅後端API）
echo 3. 🌐 僅打開前端網站
echo 4. 📖 查看部署說明
echo 5. ❌ 退出
echo.
set /p choice=請輸入選項 (1-5): 
goto :choice

:exit
echo.
echo 👋 感謝使用CYY家具電商系統！
echo.
pause
