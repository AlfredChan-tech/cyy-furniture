/**
 * CYY家具電商 - API接口模塊
 * 
 * @author CYY Team
 * @version 1.0.0
 */

// API基礎配置
const API_CONFIG = {
    baseURL: (() => {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8080/api';
        } else if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
            // 生產環境使用代理
            return '/api';
        } else {
            // 自定義域名
            return '/api';
        }
    })(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// HTTP請求工具類
class HttpClient {
    constructor(config) {
        this.config = config;
    }

    async request(method, url, data = null, options = {}) {
        const config = {
            method: method.toUpperCase(),
            headers: {
                ...this.config.headers,
                ...options.headers
            }
        };

        if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        // 添加認證token
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const fullUrl = `${this.config.baseURL}${url}`;
            console.log(`API請求: ${method.toUpperCase()} ${fullUrl}`);
            
            const response = await fetch(fullUrl, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(`API響應:`, result);
            return result;
        } catch (error) {
            console.error(`API錯誤:`, error);
            throw error;
        }
    }

    get(url, options = {}) {
        return this.request('GET', url, null, options);
    }

    post(url, data, options = {}) {
        return this.request('POST', url, data, options);
    }

    put(url, data, options = {}) {
        return this.request('PUT', url, data, options);
    }

    delete(url, options = {}) {
        return this.request('DELETE', url, null, options);
    }
}

// 創建HTTP客戶端實例
const httpClient = new HttpClient(API_CONFIG);

// 產品API
const ProductAPI = {
    // 獲取所有產品
    async getAll(page = 0, size = 20, sort = 'createdAt,desc') {
        return await httpClient.get(`/products?page=${page}&size=${size}&sort=${sort}`);
    },

    // 根據ID獲取產品
    async getById(id) {
        return await httpClient.get(`/products/${id}`);
    },

    // 根據分類獲取產品
    async getByCategory(categoryId, page = 0, size = 20) {
        return await httpClient.get(`/products/category/${categoryId}?page=${page}&size=${size}`);
    },

    // 搜索產品
    async search(keyword, page = 0, size = 20) {
        return await httpClient.get(`/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    },

    // 根據價格範圍獲取產品
    async getByPriceRange(minPrice, maxPrice, page = 0, size = 20) {
        return await httpClient.get(`/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=${size}`);
    },

    // 獲取精選產品
    async getFeatured() {
        return await httpClient.get('/products/featured');
    },

    // 獲取熱門產品
    async getPopular() {
        return await httpClient.get('/products/popular');
    },

    // 獲取相關產品
    async getRelated(productId) {
        return await httpClient.get(`/products/${productId}/related`);
    }
};

// 分類API
const CategoryAPI = {
    // 獲取所有分類
    async getAll() {
        return await httpClient.get('/categories');
    },

    // 獲取根分類
    async getRoot() {
        return await httpClient.get('/categories/root');
    },

    // 根據ID獲取分類
    async getById(id) {
        return await httpClient.get(`/categories/${id}`);
    },

    // 獲取子分類
    async getChildren(parentId) {
        return await httpClient.get(`/categories/${parentId}/children`);
    }
};

// 用戶API
const UserAPI = {
    // 用戶註冊
    async register(userData) {
        return await httpClient.post('/auth/register', userData);
    },

    // 用戶登錄
    async login(credentials) {
        return await httpClient.post('/auth/login', credentials);
    },

    // 獲取用戶信息
    async getProfile() {
        return await httpClient.get('/user/profile');
    },

    // 更新用戶信息
    async updateProfile(userData) {
        return await httpClient.put('/user/profile', userData);
    },

    // 用戶登出
    async logout() {
        return await httpClient.post('/auth/logout');
    }
};

// 購物車API
const CartAPI = {
    // 獲取購物車
    async getCart() {
        return await httpClient.get('/cart');
    },

    // 添加到購物車
    async addItem(productId, quantity = 1, attributes = {}) {
        return await httpClient.post('/cart/items', {
            productId,
            quantity,
            attributes
        });
    },

    // 更新購物車項目
    async updateItem(itemId, quantity) {
        return await httpClient.put(`/cart/items/${itemId}`, { quantity });
    },

    // 刪除購物車項目
    async removeItem(itemId) {
        return await httpClient.delete(`/cart/items/${itemId}`);
    },

    // 清空購物車
    async clear() {
        return await httpClient.delete('/cart');
    }
};

// 訂單API
const OrderAPI = {
    // 創建訂單
    async create(orderData) {
        return await httpClient.post('/orders', orderData);
    },

    // 獲取用戶訂單
    async getUserOrders(page = 0, size = 10) {
        return await httpClient.get(`/orders?page=${page}&size=${size}`);
    },

    // 根據ID獲取訂單
    async getById(orderId) {
        return await httpClient.get(`/orders/${orderId}`);
    },

    // 取消訂單
    async cancel(orderId) {
        return await httpClient.put(`/orders/${orderId}/cancel`);
    }
};

// API錯誤處理
class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// 導出API模塊
window.CYY_API = {
    Product: ProductAPI,
    Category: CategoryAPI,
    User: UserAPI,
    Cart: CartAPI,
    Order: OrderAPI,
    HttpClient: httpClient,
    APIError
};

// 初始化API
console.log('CYY API模塊已加載');
console.log('API基礎地址:', API_CONFIG.baseURL);
