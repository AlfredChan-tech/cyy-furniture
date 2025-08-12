@echo off
echo =================================
echo   CYY家具電商後端系統
echo   開發環境啟動腳本
echo =================================
echo.

echo 正在檢查Java環境...
java -version
if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 未找到Java環境！
    echo 請安裝JDK 17或更高版本
    echo 下載地址: https://adoptium.net/
    pause
    exit /b 1
)

echo.
echo 正在啟動Spring Boot應用（開發環境）...
echo 使用H2內存數據庫，無需額外配置
echo.

.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev

if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 應用啟動失敗！
    echo 請檢查錯誤信息並重試
    pause
    exit /b 1
)

echo.
echo 應用已停止
pause 