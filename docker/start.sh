#!/bin/bash

echo "==================================="
echo "  CYY家具電商系統啟動中..."
echo "==================================="

# 啟動nginx
echo "啟動Nginx..."
nginx

# 等待一秒
sleep 1

# 啟動Spring Boot應用
echo "啟動後端服務..."
java -jar backend.jar &

# 等待服務啟動
echo "等待服務啟動..."
sleep 10

echo "==================================="
echo "  CYY家具電商系統啟動完成！"
echo "  前端地址: http://localhost"
echo "  後端API: http://localhost/api"
echo "  API文檔: http://localhost/api/swagger-ui.html"
echo "==================================="

# 保持容器運行
tail -f /var/log/nginx/access.log
