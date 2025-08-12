# 🌐 CYY家具電商網站 - 線上部署指南

## 🚀 快速部署（推薦方案）

### 方案一：Vercel（前端）+ Railway（後端）

#### 1️⃣ 準備GitHub倉庫

```bash
# 1. 添加所有文件到Git
git add .
git commit -m "Initial commit: CYY furniture e-commerce website"

# 2. 創建GitHub倉庫（在GitHub網站上創建新倉庫）
# 3. 連接到GitHub
git remote add origin https://github.com/你的用戶名/cyy-furniture.git
git branch -M main
git push -u origin main
```

#### 2️⃣ 部署後端到Railway

1. **訪問 [Railway.app](https://railway.app/)**
2. **使用GitHub登錄**
3. **創建新項目**：
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇您的 `cyy-furniture` 倉庫
   - 選擇 `backend` 文件夾作為根目錄

4. **配置環境變量**：
   ```
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:mysql://railway-mysql:3306/railway
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=自動生成
   PORT=8080
   ```

5. **添加MySQL數據庫**：
   - 在項目中點擊 "Add Service"
   - 選擇 "MySQL"
   - Railway會自動配置連接

6. **獲取後端URL**：
   - 部署完成後，記錄生成的URL（如：`https://cyy-backend.up.railway.app`）

#### 3️⃣ 部署前端到Vercel

1. **訪問 [Vercel.com](https://vercel.com/)**
2. **使用GitHub登錄**
3. **導入項目**：
   - 點擊 "New Project"
   - 選擇您的 `cyy-furniture` 倉庫
   - 配置設置：
     ```
     Framework Preset: Other
     Root Directory: ./
     Build Command: (留空)
     Output Directory: (留空)
     Install Command: (留空)
     ```

4. **更新API配置**：
   - 編輯 `vercel.json` 中的後端URL
   - 將 `https://cyy-backend.up.railway.app` 替換為您的Railway URL

5. **部署**：
   - 點擊 "Deploy"
   - 等待部署完成

#### 4️⃣ 配置自定義域名（可選）

**Vercel域名配置**：
1. 在Vercel項目設置中點擊 "Domains"
2. 添加您的自定義域名
3. 按照指示配置DNS記錄

**Railway域名配置**：
1. 在Railway項目設置中點擊 "Domains"
2. 添加自定義域名或使用提供的域名

---

### 方案二：Netlify（前端）+ Render（後端）- 完全免費

#### 1️⃣ 部署後端到Render

1. **訪問 [Render.com](https://render.com/)**
2. **創建新的Web Service**：
   - 連接GitHub倉庫
   - 選擇 `backend` 目錄
   - 配置：
     ```
     Name: cyy-furniture-backend
     Environment: Java
     Build Command: ./mvnw clean package -DskipTests
     Start Command: java -Dserver.port=$PORT -jar target/*.jar
     ```

3. **配置環境變量**：
   ```
   SPRING_PROFILES_ACTIVE=prod
   JAVA_TOOL_OPTIONS=-Xmx512m
   ```

4. **添加PostgreSQL數據庫**：
   - 創建新的PostgreSQL數據庫
   - 將連接信息添加到環境變量

#### 2️⃣ 部署前端到Netlify

1. **訪問 [Netlify.com](https://www.netlify.com/)**
2. **拖拽部署**：
   - 將項目根目錄的所有文件拖拽到Netlify
   - 或連接GitHub倉庫自動部署

3. **配置重定向**：
   - `netlify.toml` 已經配置好了重定向規則

---

### 方案三：一鍵全棧部署到Railway

1. **點擊一鍵部署按鈕**：
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

2. **或手動配置**：
   - 創建新項目
   - 添加GitHub倉庫
   - Railway會自動檢測並部署前後端

---

## 🔧 部署後配置

### 1. 更新CORS設置
確保後端 `application.yml` 中的CORS配置包含您的域名：
```yaml
cors:
  allowed-origins: 
    - https://your-frontend-domain.vercel.app
    - https://your-custom-domain.com
```

### 2. 配置HTTPS
所有推薦的平台都自動提供HTTPS證書。

### 3. 設置環境變量
```bash
# 生產環境變量
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=your-database-url
JWT_SECRET=your-secure-jwt-secret
```

### 4. 數據庫初始化
首次部署時，數據庫會自動創建表結構並插入初始數據。

---

## 📊 部署後檢查清單

- [ ] ✅ 前端網站可以正常訪問
- [ ] ✅ API接口響應正常
- [ ] ✅ 數據庫連接成功
- [ ] ✅ 產品數據顯示正確
- [ ] ✅ 搜索功能工作正常
- [ ] ✅ 購物車功能正常
- [ ] ✅ 響應式設計在移動端正常
- [ ] ✅ HTTPS證書配置正確
- [ ] ✅ 自定義域名解析正常（如果配置）

---

## 🔗 部署結果

部署完成後，您將獲得：

- **前端網站**：`https://your-project.vercel.app`
- **後端API**：`https://your-backend.up.railway.app/api`
- **API文檔**：`https://your-backend.up.railway.app/api/swagger-ui.html`
- **管理後台**：`https://your-project.vercel.app/admin`

---

## 💡 部署提示

1. **免費額度**：
   - Vercel：每月100GB流量
   - Railway：每月$5免費額度
   - Netlify：每月100GB流量

2. **性能優化**：
   - 啟用CDN加速
   - 配置圖片優化
   - 啟用Gzip壓縮

3. **監控**：
   - 設置錯誤監控
   - 配置性能監控
   - 設置正常運行時間監控

---

## 🆘 故障排除

### 常見問題

1. **API調用失敗**：
   - 檢查CORS設置
   - 確認API URL正確
   - 查看網絡請求日誌

2. **數據庫連接失敗**：
   - 檢查環境變量
   - 確認數據庫服務狀態
   - 查看應用日誌

3. **靜態文件404**：
   - 檢查文件路徑
   - 確認構建配置
   - 查看部署日誌

---

**🎉 恭喜！您的CYY家具電商網站現在已經在線上運行了！**

訪問您的網站並享受現代化的家具購物體驗吧！
