# CYY家具電商網站 - 項目結構

## 📁 完整項目結構

```
CYY-DREAM/
├── 📄 前端文件
│   ├── index.html              # 主頁面
│   ├── product-detail.html     # 產品詳情頁
│   ├── cart.html              # 購物車頁面
│   ├── search-results.html    # 搜索結果頁
│   ├── wishlist.html          # 收藏夾頁面
│   ├── styles.css             # 主樣式文件
│   ├── script.js              # 主JavaScript文件
│   ├── api.js                 # API接口模塊
│   ├── cart.js                # 購物車功能
│   ├── product-detail.js      # 產品詳情功能
│   ├── search-results.js      # 搜索功能
│   └── wishlist.js            # 收藏功能
│
├── 🔧 後端服務 (backend/)
│   ├── src/main/java/com/cyy/furniture/
│   │   ├── 📱 controller/      # 控制器層
│   │   │   ├── ProductController.java
│   │   │   └── CategoryController.java
│   │   ├── 🔧 service/         # 服務層
│   │   │   ├── ProductService.java
│   │   │   └── CategoryService.java
│   │   ├── 📊 entity/          # 實體類
│   │   │   ├── Product.java
│   │   │   ├── Category.java
│   │   │   ├── User.java
│   │   │   ├── Order.java
│   │   │   └── CartItem.java
│   │   ├── 🗄️ repository/      # 數據訪問層
│   │   │   ├── ProductRepository.java
│   │   │   ├── CategoryRepository.java
│   │   │   └── UserRepository.java
│   │   └── 📦 dto/             # 數據傳輸對象
│   │       ├── ProductDto.java
│   │       └── CategoryDto.java
│   ├── src/main/resources/
│   │   ├── application.yml     # 應用配置
│   │   └── data.sql           # 初始化數據
│   ├── pom.xml                # Maven配置
│   ├── run-dev.bat            # 開發環境啟動腳本
│   └── check-requirements.bat  # 環境檢查腳本
│
├── 🛠️ 管理後台 (admin/)
│   ├── index.html             # 管理主頁
│   ├── login.html             # 登錄頁面
│   ├── css/admin-style.css    # 管理樣式
│   └── js/admin-main.js       # 管理功能
│
├── 🐳 部署配置
│   ├── Dockerfile             # Docker鏡像配置
│   ├── docker-compose.yml     # Docker服務編排
│   ├── docker/
│   │   ├── nginx.conf         # Nginx配置
│   │   └── start.sh           # 容器啟動腳本
│   └── start-cyy.bat          # 一鍵啟動腳本
│
└── 📚 文檔
    ├── README.md              # 項目說明
    ├── DEPLOYMENT.md          # 部署指南
    └── PROJECT_STRUCTURE.md   # 項目結構（本文件）
```

## 🌟 核心功能模塊

### 1. 前端功能
- ✅ **響應式設計** - 適配PC、平板、手機
- ✅ **產品展示** - 輪播圖、分類、詳情頁
- ✅ **搜索功能** - 智能搜索、篩選
- ✅ **購物車** - 添加、修改、結算
- ✅ **用戶系統** - 註冊、登錄、個人中心
- ✅ **收藏功能** - 收藏夾管理

### 2. 後端API
- ✅ **產品管理** - CRUD操作、搜索、分類
- ✅ **分類管理** - 樹形結構分類
- ✅ **用戶管理** - 認證、授權、個人信息
- ✅ **訂單管理** - 訂單創建、狀態管理
- ✅ **購物車** - 購物車操作
- ✅ **API文檔** - Swagger自動生成

### 3. 數據庫設計
- ✅ **用戶表** - 用戶信息、角色權限
- ✅ **產品表** - 產品信息、庫存、價格
- ✅ **分類表** - 樹形分類結構
- ✅ **訂單表** - 訂單信息、狀態
- ✅ **購物車表** - 購物車項目
- ✅ **產品圖片表** - 產品多圖支持

## 🚀 部署方式

### 1. 一鍵啟動（推薦）
```bash
# Windows
start-cyy.bat

# 選擇部署方式：
# 1. Docker部署（完整功能）
# 2. 本地開發（開發調試）
# 3. 僅前端（靜態展示）
```

### 2. Docker部署
```bash
# 啟動所有服務
docker-compose up -d

# 訪問地址：
# 前端: http://localhost
# API: http://localhost/api
# 管理: http://localhost:3000
```

### 3. 本地開發
```bash
# 後端
cd backend
./run-dev.bat

# 前端
# 直接打開 index.html 或使用HTTP服務器
```

## 🔧 技術棧

### 前端技術
- **HTML5** - 語義化標籤
- **CSS3** - Grid、Flexbox、動畫
- **JavaScript** - ES6+、原生DOM操作
- **字體** - Playfair Display、Inter
- **圖標** - Font Awesome 6.0

### 後端技術
- **Spring Boot 3.2.0** - 主框架
- **Spring Security** - 安全框架
- **Spring Data JPA** - 數據訪問
- **MySQL 8.0** - 生產數據庫
- **H2** - 開發測試數據庫
- **Swagger** - API文檔

### 部署技術
- **Docker** - 容器化部署
- **Nginx** - 反向代理、靜態文件服務
- **Maven** - Java項目構建
- **Git** - 版本控制

## 📊 性能特點

### 前端性能
- 🚀 **快速載入** - 圖片懶加載、代碼優化
- 📱 **響應式** - 完美適配各種設備
- 🎨 **視覺效果** - 平滑動畫、過渡效果
- 💾 **本地存儲** - 購物車、收藏持久化

### 後端性能
- ⚡ **高性能** - JPA查詢優化、索引設計
- 🔒 **安全性** - JWT認證、數據驗證
- 📈 **可擴展** - 微服務架構設計
- 🔍 **可觀測** - 日誌、監控、健康檢查

## 🎯 使用場景

### 開發者
- 學習現代Web開發技術
- 了解前後端分離架構
- 掌握Docker容器化部署
- 實踐電商業務邏輯

### 企業用戶
- 快速搭建電商網站
- 定制化產品展示
- 完整的用戶管理系統
- 可擴展的架構設計

### 學習目標
- 全棧開發技能
- 現代化部署方案
- 電商業務理解
- 項目管理經驗

---

## 🔗 相關鏈接

- **項目文檔**: README.md
- **部署指南**: DEPLOYMENT.md
- **API文檔**: http://localhost:8080/api/swagger-ui.html
- **在線演示**: [待部署]

---

© 2024 CYY. 版權所有
