-- 初始化數據腳本

-- 插入產品分類數據
INSERT INTO categories (id, name, description, image_url, sort_order, is_active, created_at, updated_at, deleted) VALUES
(1, '客廳家具', '為您的客廳打造舒適優雅的環境', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 1, true, NOW(), NOW(), false),
(2, '臥室家具', '營造溫馨舒適的睡眠空間', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400', 2, true, NOW(), NOW(), false),
(3, '餐廳家具', '享受優雅的用餐時光', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 3, true, NOW(), NOW(), false),
(4, '辦公家具', '提升工作效率的理想選擇', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 4, true, NOW(), NOW(), false);

-- 插入子分類
INSERT INTO categories (id, name, description, parent_id, sort_order, is_active, created_at, updated_at, deleted) VALUES
(5, '沙發', '舒適的沙發系列', 1, 1, true, NOW(), NOW(), false),
(6, '茶几', '精美的茶几系列', 1, 2, true, NOW(), NOW(), false),
(7, '電視櫃', '實用的電視櫃系列', 1, 3, true, NOW(), NOW(), false),
(8, '床架', '優質的床架系列', 2, 1, true, NOW(), NOW(), false),
(9, '衣櫃', '大容量衣櫃系列', 2, 2, true, NOW(), NOW(), false),
(10, '餐桌', '精美的餐桌系列', 3, 1, true, NOW(), NOW(), false),
(11, '餐椅', '舒適的餐椅系列', 3, 2, true, NOW(), NOW(), false);

-- 插入產品數據
INSERT INTO products (id, name, description, price, original_price, stock_quantity, is_active, is_featured, status, brand, material, color, size, weight, sku, category_id, created_at, updated_at, deleted) VALUES
(1, '現代簡約沙發', '這款現代簡約沙發體現了當代家居設計的精髓，融合了舒適性與美學的完美平衡。採用進口優質面料，手感柔軟舒適。', 35800.00, 42000.00, 15, true, true, 'ACTIVE', 'CYY', '優質面料+高密度海綿', '灰色', '200cm×90cm×85cm', 65.00, 'CYY-SF001', 5, NOW(), NOW(), false),
(2, '實木雙人床架', '精選實木製作，堅固耐用的雙人床架，簡約設計完美融入現代家居風格。', 28500.00, NULL, 8, true, true, 'ACTIVE', 'CYY', '實木', '原木色', '180cm×200cm×40cm', 45.00, 'CYY-BD001', 8, NOW(), NOW(), false),
(3, '橡木餐桌', '天然橡木材質，六人座餐桌，適合家庭聚餐使用。', 45200.00, NULL, 5, true, true, 'ACTIVE', 'CYY', '橡木', '原木色', '160cm×90cm×75cm', 55.00, 'CYY-DT001', 10, NOW(), NOW(), false),
(4, '現代書櫃', '多層收納設計，適合客廳或書房使用的現代風格書櫃。', 15800.00, NULL, 12, true, false, 'ACTIVE', 'CYY', '板材', '白色', '120cm×30cm×180cm', 35.00, 'CYY-BC001', 1, NOW(), NOW(), false),
(5, '皮革沙發', '真皮材質，奢華舒適的三人座沙發，彰顯尊貴品味。', 58900.00, 65000.00, 6, true, true, 'ACTIVE', 'CYY', '真皮', '咖啡色', '220cm×95cm×85cm', 78.00, 'CYY-SF002', 5, NOW(), NOW(), false),
(6, '實木茶几', '精選實木打造，簡約而實用的茶几設計。', 12800.00, NULL, 20, true, false, 'ACTIVE', 'CYY', '實木', '胡桃色', '120cm×60cm×45cm', 25.00, 'CYY-CT001', 6, NOW(), NOW(), false);

-- 插入產品圖片
INSERT INTO product_images (id, image_url, alt_text, sort_order, is_primary, product_id, created_at, updated_at, deleted) VALUES
(1, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '現代簡約沙發主圖', 1, true, 1, NOW(), NOW(), false),
(2, 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '實木雙人床架主圖', 1, true, 2, NOW(), NOW(), false),
(3, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '橡木餐桌主圖', 1, true, 3, NOW(), NOW(), false),
(4, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '現代書櫃主圖', 1, true, 4, NOW(), NOW(), false),
(5, 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '皮革沙發主圖', 1, true, 5, NOW(), NOW(), false),
(6, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '實木茶几主圖', 1, true, 6, NOW(), NOW(), false);

-- 插入產品屬性
INSERT INTO product_attributes (id, attribute_name, attribute_value, unit, sort_order, product_id, created_at, updated_at, deleted) VALUES
(1, '材質', '優質面料+高密度海綿', NULL, 1, 1, NOW(), NOW(), false),
(2, '承重', '200', 'kg', 2, 1, NOW(), NOW(), false),
(3, '保固期', '2', '年', 3, 1, NOW(), NOW(), false),
(4, '材質', '實木', NULL, 1, 2, NOW(), NOW(), false),
(5, '床板類型', '排骨架', NULL, 2, 2, NOW(), NOW(), false),
(6, '適用床墊尺寸', '180×200', 'cm', 3, 2, NOW(), NOW(), false),
(7, '材質', '橡木', NULL, 1, 3, NOW(), NOW(), false),
(8, '座位數', '6', '人', 2, 3, NOW(), NOW(), false),
(9, '桌面厚度', '4', 'cm', 3, 3, NOW(), NOW(), false);

-- 插入管理員用戶 (密碼: admin123)
INSERT INTO users (id, username, password, email, full_name, phone_number, address, role, account_enabled, account_locked, credentials_expired, account_expired, created_at, updated_at, deleted) VALUES
(1, 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin@cyy.com', 'CYY管理員', '02-1234-5678', '台北市信義區松仁路100號', 'ADMIN', true, false, false, false, NOW(), NOW(), false);

-- 插入測試用戶 (密碼: test123)
INSERT INTO users (id, username, password, email, full_name, phone_number, address, role, account_enabled, account_locked, credentials_expired, account_expired, created_at, updated_at, deleted) VALUES
(2, 'testuser', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'test@example.com', '測試用戶', '0912-345-678', '台北市大安區復興南路一段100號', 'USER', true, false, false, false, NOW(), NOW(), false); 