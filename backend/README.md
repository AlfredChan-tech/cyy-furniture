# CYY家具電商後端系統

## 🏗️ 項目架構

本項目採用 Spring Boot 3.2.0 + Spring Security + JWT 的現代化架構設計。

### 技術棧
- **框架**: Spring Boot 3.2.0
- **安全**: Spring Security + JWT
- **數據庫**: MySQL 8.0 / H2 (測試)
- **ORM**: Spring Data JPA + Hibernate
- **文檔**: Swagger/OpenAPI 3
- **構建工具**: Maven
- **Java版本**: JDK 17

### 項目結構
```
src/main/java/com/cyy/furniture/
├── entity/          # 實體類層
├── repository/      # 數據訪問層
├── service/         # 業務邏輯層
├── controller/      # 控制器層
├── dto/            # 數據傳輸對象
├── config/         # 配置類
├── security/       # 安全相關
├── exception/      # 異常處理
└── utils/          # 工具類
```

## 📊 數據庫設計

### 核心實體
- **User**: 用戶信息
- **Category**: 產品分類
- **Product**: 產品信息
- **ProductImage**: 產品圖片
- **ProductAttribute**: 產品屬性
- **Order**: 訂單信息
- **OrderItem**: 訂單項目
- **CartItem**: 購物車項目

## 🚀 快速開始

### 1. 環境要求
- JDK 17+
- Maven 3.6+
- MySQL 8.0+ (生產環境)

### 2. 數據庫配置
```sql
-- 創建數據庫
CREATE DATABASE cyy_furniture CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 創建用戶
CREATE USER 'cyy_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cyy_furniture.* TO 'cyy_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 應用配置
修改 `application.yml` 中的數據庫連接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cyy_furniture
    username: cyy_user
    password: your_password
```

### 4. 運行應用
```bash
# 開發環境 (使用H2內存數據庫)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 生產環境
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### 5. 訪問地址
- **API文檔**: http://localhost:8080/api/swagger-ui.html
- **H2控制台**: http://localhost:8080/api/h2-console (僅開發環境)

## 🔐 認證與授權

### JWT認證流程
1. 用戶登錄獲取 JWT Token
2. 請求頭攜帶 `Authorization: Bearer <token>`
3. 後端驗證 Token 並提取用戶信息

### 默認用戶
- **管理員**: username: `admin`, password: `admin123`
- **測試用戶**: username: `testuser`, password: `test123`

## 📝 API接口

### 認證相關
- `POST /auth/register` - 用戶註冊
- `POST /auth/login` - 用戶登錄
- `POST /auth/refresh` - 刷新Token

### 產品相關
- `GET /products` - 獲取產品列表
- `GET /products/{id}` - 獲取產品詳情
- `GET /products/search` - 搜索產品
- `GET /products/featured` - 獲取精選產品

### 分類相關
- `GET /categories` - 獲取分類列表
- `GET /categories/{id}/products` - 獲取分類下的產品

### 購物車相關
- `GET /cart` - 獲取購物車
- `POST /cart/items` - 添加商品到購物車
- `PUT /cart/items/{id}` - 更新購物車項目
- `DELETE /cart/items/{id}` - 刪除購物車項目

### 訂單相關
- `GET /orders` - 獲取訂單列表
- `POST /orders` - 創建訂單
- `GET /orders/{id}` - 獲取訂單詳情

## 🛠️ 開發指南

### 代碼規範
- 使用 Lombok 減少樣板代碼
- 統一使用 BigDecimal 處理金額
- 實體類繼承 BaseEntity 獲得通用字段
- 使用 @Transactional 管理事務

### 異常處理
- 統一異常處理機制
- 自定義業務異常
- 返回統一的錯誤響應格式

### 安全配置
- 密碼使用 BCrypt 加密
- JWT Token 過期時間可配置
- CORS 跨域配置

## 📦 部署

### Docker部署 (計劃)
```bash
# 構建鏡像
docker build -t cyy-furniture-backend .

# 運行容器
docker run -p 8080:8080 cyy-furniture-backend
```

### 環境變量
- `SPRING_PROFILES_ACTIVE`: 運行環境 (dev/prod)
- `DB_URL`: 數據庫連接URL
- `DB_USERNAME`: 數據庫用戶名
- `DB_PASSWORD`: 數據庫密碼
- `JWT_SECRET`: JWT密鑰

## 📋 待完成功能
- [ ] 用戶認證服務
- [ ] 產品管理服務  
- [ ] 購物車服務
- [ ] 訂單處理服務
- [ ] 文件上傳服務
- [ ] 郵件服務
- [ ] 推薦系統
- [ ] 支付集成

## 🤝 貢獻指南
1. Fork 項目
2. 創建功能分支
3. 提交變更
4. 推送到分支
5. 創建 Pull Request

## 📄 許可證
© 2024 CYY. 版權所有 