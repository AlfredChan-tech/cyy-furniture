@echo off
echo =================================
echo   CYY後端系統環境檢查
echo =================================
echo.

echo 1. 檢查Java環境...
java -version 2>nul
if %errorlevel% equ 0 (
    echo ✓ Java已安裝
    java -version
) else (
    echo ✗ Java未安裝或未配置環境變量
    echo.
    echo 解決方案：
    echo 1. 下載並安裝JDK 17+：https://adoptium.net/
    echo 2. 或使用包管理器：winget install EclipseAdoptium.Temurin.17.JDK
    echo 3. 確保JAVA_HOME環境變量已設置
    goto :java_missing
)

echo.
echo 2. 檢查Maven Wrapper...
if exist "mvnw.cmd" (
    echo ✓ Maven Wrapper已就緒
) else (
    echo ✗ Maven Wrapper文件缺失
    goto :mvn_missing
)

echo.
echo 3. 測試編譯...
echo 正在測試項目編譯...
.\mvnw.cmd compile -q
if %errorlevel% equ 0 (
    echo ✓ 項目編譯成功
) else (
    echo ✗ 項目編譯失敗
    echo 請檢查依賴和網絡連接
    goto :compile_failed
)

echo.
echo =============================
echo   環境檢查完成！
echo   所有依賴都已就緒
echo =============================
echo.
echo 您可以運行以下命令啟動應用：
echo   run-dev.bat
echo.
echo 或手動運行：
echo   .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
echo.
pause
exit /b 0

:java_missing
echo.
echo 請先安裝Java後再次運行此腳本
pause
exit /b 1

:mvn_missing
echo.
echo Maven Wrapper文件缺失，請檢查項目完整性
pause
exit /b 1

:compile_failed
echo.
echo 編譯失敗，請檢查網絡連接和項目配置
pause
exit /b 1 