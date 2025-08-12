# CYY家具電商網站部署指南

## 🚀 快速部署

### 方案一：Docker部署（推薦）

#### 1. 安裝Docker
```bash
# Windows: 下載Docker Desktop
https://www.docker.com/products/docker-desktop

# 或使用winget安裝
winget install Docker.DockerDesktop
```

#### 2. 構建並啟動服務
```bash
# 克隆項目
git clone <your-repo-url>
cd CYY-DREAM

# 啟動所有服務
docker-compose up -d

# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f
```

#### 3. 訪問服務
- **前端網站**: http://localhost
- **後端API**: http://localhost/api
- **API文檔**: http://localhost/api/swagger-ui.html
- **管理後台**: http://localhost:3000
- **數據庫**: localhost:3306

---

### 方案二：本地開發部署

#### 前置要求
- **Java 17+**: https://adoptium.net/
- **Node.js 18+**: https://nodejs.org/
- **MySQL 8.0+**: https://dev.mysql.com/downloads/

#### 1. 數據庫配置
```sql
-- 創建數據庫
CREATE DATABASE cyy_furniture CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 創建用戶
CREATE USER 'cyy_user'@'localhost' IDENTIFIED BY 'cyy_password';
GRANT ALL PRIVILEGES ON cyy_furniture.* TO 'cyy_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. 後端啟動
```bash
# 進入後端目錄
cd backend

# 檢查環境
./check-requirements.bat

# 啟動開發環境（使用H2數據庫）
./run-dev.bat

# 或啟動生產環境（使用MySQL）
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

#### 3. 前端啟動
```bash
# 安裝HTTP服務器
npm install -g http-server

# 啟動前端服務
http-server . -p 3000 -c-1

# 或使用Python
python -m http.server 3000

# 或直接用瀏覽器打開index.html
```

---

### 方案三：雲端部署

#### Vercel部署（前端）
1. 推送代碼到GitHub
2. 連接Vercel到GitHub倉庫
3. 配置構建設置：
   ```
   Build Command: (留空)
   Output Directory: (留空)
   Install Command: (留空)
   ```

#### Heroku部署（後端）
```bash
# 安裝Heroku CLI
npm install -g heroku

# 登錄Heroku
heroku login

# 創建應用
heroku create cyy-furniture-api

# 設置Java版本
echo "java.runtime.version=17" > system.properties

# 部署
git subtree push --prefix=backend heroku main
```

#### Railway部署（全棧）
1. 連接GitHub倉庫到Railway
2. 配置環境變量
3. 自動部署

---

## 🔧 配置選項

### 環境變量
```bash
# 數據庫配置
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/cyy_furniture
SPRING_DATASOURCE_USERNAME=cyy_user
SPRING_DATASOURCE_PASSWORD=cyy_password

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# 文件上傳
FILE_UPLOAD_DIRECTORY=./uploads/
FILE_UPLOAD_MAX_SIZE=10MB

# Redis配置（可選）
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379
```

### Nginx配置（生產環境）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 📊 性能優化

### 1. 前端優化
- **圖片優化**: 使用WebP格式
- **代碼分割**: 按需加載模塊
- **CDN加速**: 使用CDN分發靜態資源
- **緩存策略**: 設置適當的緩存頭

### 2. 後端優化
- **數據庫索引**: 為查詢字段添加索引
- **緩存策略**: 使用Redis緩存熱點數據
- **連接池**: 配置數據庫連接池
- **JVM調優**: 設置適當的JVM參數

### 3. 數據庫優化
```sql
-- 添加索引
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_status ON products(status, is_active);
CREATE INDEX idx_product_price ON products(price);
CREATE INDEX idx_product_created ON products(created_at);
```

---

## 🔒 安全配置

### 1. HTTPS配置
```bash
# 使用Let's Encrypt獲取SSL證書
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. 防火牆配置
```bash
# Ubuntu UFW
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 3. 安全標頭
```nginx
# 在Nginx配置中添加
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

---

## 📝 監控與日誌

### 1. 應用監控
- **健康檢查**: `/health` 端點
- **指標監控**: Prometheus + Grafana
- **錯誤追蹤**: Sentry

### 2. 日誌配置
```yaml
# application.yml
logging:
  level:
    com.cyy.furniture: INFO
    org.springframework.security: WARN
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/cyy-furniture.log
    max-size: 10MB
    max-history: 30
```

---

## 🆘 故障排除

### 常見問題

#### 1. Java環境問題
```bash
# 檢查Java版本
java -version

# 安裝Java 17
winget install EclipseAdoptium.Temurin.17.JDK
```

#### 2. 數據庫連接問題
```bash
# 檢查MySQL服務
sudo systemctl status mysql

# 測試數據庫連接
mysql -u cyy_user -p cyy_furniture
```

#### 3. 端口占用問題
```bash
# Windows查看端口占用
netstat -ano | findstr :8080

# 終止進程
taskkill /PID <PID> /F
```

#### 4. 跨域問題
- 檢查CORS配置
- 確保API地址正確
- 檢查瀏覽器控制台錯誤

---

## 📞 技術支持

如有問題，請聯繫：
- 📧 Email: tech@cyy.com
- 📞 電話: 02-1234-5678
- 💬 GitHub Issues: [項目地址]

---

© 2024 CYY. 版權所有
