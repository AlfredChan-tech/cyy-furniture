# 🚀 CYY家具電商 - 5分鐘快速部署指南

## 📋 部署步驟

### 第1步：推送到GitHub ⏱️ 2分鐘

1. **在GitHub創建新倉庫**：
   - 訪問 https://github.com/new
   - 倉庫名稱：`cyy-furniture`
   - 設為Public
   - 點擊 "Create repository"

2. **推送代碼**：
   ```bash
   git remote add origin https://github.com/你的用戶名/cyy-furniture.git
   git branch -M main
   git push -u origin main
   ```

### 第2步：部署後端到Railway ⏱️ 2分鐘

1. **訪問 Railway**：
   - 打開 https://railway.app/
   - 用GitHub登錄

2. **一鍵部署**：
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇 `cyy-furniture` 倉庫
   - **重要**：設置 Root Directory 為 `backend`

3. **添加數據庫**：
   - 點擊 "Add Service" → "MySQL"
   - 等待數據庫創建完成

4. **記錄後端URL**：
   - 部署完成後複製URL（如：`https://xxx.up.railway.app`）

### 第3步：部署前端到Vercel ⏱️ 1分鐘

1. **訪問 Vercel**：
   - 打開 https://vercel.com/
   - 用GitHub登錄

2. **一鍵部署**：
   - 點擊 "New Project"
   - 選擇 `cyy-furniture` 倉庫
   - 直接點擊 "Deploy"

3. **更新API配置**：
   - 編輯 `vercel.json` 文件
   - 將 `https://cyy-backend.up.railway.app` 替換為您的Railway URL
   - 提交更改，Vercel會自動重新部署

## 🎉 完成！

- **前端網站**：https://你的項目名.vercel.app
- **後端API**：https://你的後端.up.railway.app/api
- **API文檔**：https://你的後端.up.railway.app/api/swagger-ui.html

---

## 🆓 完全免費方案（備選）

### Netlify + Render

1. **後端 → Render**：
   - https://render.com/ → 連接GitHub → 選擇backend目錄
   - 免費PostgreSQL數據庫

2. **前端 → Netlify**：
   - https://netlify.com/ → 拖拽整個項目文件夾
   - 或連接GitHub自動部署

---

## ⚡ 超快速部署（推薦）

點擊下面的按鈕一鍵部署：

### 部署到Railway（全棧）
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/cyy-furniture)

### 部署到Vercel（前端）
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用戶名/cyy-furniture)

### 部署到Netlify（前端）
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/你的用戶名/cyy-furniture)

---

## 🔧 部署後檢查

訪問您的網站，確認：
- ✅ 首頁正常顯示
- ✅ 產品列表加載
- ✅ 搜索功能工作
- ✅ 購物車功能正常
- ✅ 響應式設計正常

---

## 💡 提示

- **免費額度充足**：Railway每月$5，Vercel每月100GB流量
- **自動HTTPS**：所有平台都提供免費SSL證書
- **全球CDN**：自動獲得全球加速
- **自動部署**：代碼更新會自動重新部署

---

**🎊 恭喜！您的CYY家具電商網站已經上線了！**
