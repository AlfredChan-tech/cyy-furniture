// 後台管理系統主要JavaScript文件
class AdminDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.apiBase = 'http://localhost:8080/api';
        // 檢查localStorage和sessionStorage中的token
        this.token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        
        // 管理員權限系統
        this.adminRoles = {
            'admin032630': { level: 'super_admin', name: '超級管理員', permissions: ['all'] },
            'CYY302630': { level: 'product_manager', name: '商品管理員', permissions: ['products', 'categories', 'dashboard'] }
        };
        
        this.currentAdmin = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthToken();
        // 只在有有效token時載入數據
        if (this.token) {
            this.loadAdminInfo();
            this.loadDashboardData();
        }
    }

    // 載入管理員信息
    loadAdminInfo() {
        const adminUsername = localStorage.getItem('adminUsername') || sessionStorage.getItem('adminUsername');
        if (adminUsername && this.adminRoles[adminUsername]) {
            this.currentAdmin = {
                username: adminUsername,
                ...this.adminRoles[adminUsername]
            };
            this.updateAdminUI();
            this.setupPermissions();
        }
    }

    // 更新管理員UI顯示
    updateAdminUI() {
        if (this.currentAdmin) {
            const userDropdown = document.querySelector('#userDropdown span');
            if (userDropdown) {
                userDropdown.textContent = this.currentAdmin.name;
            }
        }
    }

    // 設置權限控制
    setupPermissions() {
        if (!this.currentAdmin) return;

        const { permissions } = this.currentAdmin;
        
        // 隱藏無權限的菜單項
        if (!this.hasPermission('users')) {
            this.hideMenuItem('users');
        }
        if (!this.hasPermission('orders')) {
            this.hideMenuItem('orders');
        }
        if (!this.hasPermission('statistics')) {
            this.hideMenuItem('statistics');
        }
        if (!this.hasPermission('settings')) {
            this.hideMenuItem('settings');
        }
    }

    // 檢查權限
    hasPermission(permission) {
        if (!this.currentAdmin) return false;
        return this.currentAdmin.permissions.includes('all') || 
               this.currentAdmin.permissions.includes(permission);
    }

    // 隱藏菜單項
    hideMenuItem(page) {
        const menuItem = document.querySelector(`[data-page="${page}"]`);
        if (menuItem) {
            menuItem.closest('.nav-item').style.display = 'none';
        }
    }

    // 身份確認
    async confirmIdentity(action = '執行此操作') {
        return new Promise((resolve) => {
            const confirmModal = `
                <div class="modal fade" id="identityConfirmModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">身份確認</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p>為了安全起見，請確認您的身份以${action}：</p>
                                <form id="identityForm">
                                    <div class="mb-3">
                                        <label class="form-label">請輸入您的密碼</label>
                                        <input type="password" class="form-control" id="confirmPassword" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                                <button type="button" class="btn btn-primary" id="confirmIdentityBtn">確認</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', confirmModal);
            const modal = new bootstrap.Modal(document.getElementById('identityConfirmModal'));
            modal.show();

            document.getElementById('confirmIdentityBtn').addEventListener('click', () => {
                const password = document.getElementById('confirmPassword').value;
                const isValid = this.validateAdminPassword(password);
                
                if (isValid) {
                    modal.hide();
                    setTimeout(() => {
                        document.getElementById('identityConfirmModal').remove();
                    }, 300);
                    resolve(true);
                } else {
                    this.showNotification('密碼錯誤', 'error');
                    resolve(false);
                }
            });

            modal._element.addEventListener('hidden.bs.modal', () => {
                document.getElementById('identityConfirmModal').remove();
                resolve(false);
            });
        });
    }

    // 驗證管理員密碼
    validateAdminPassword(password) {
        if (!this.currentAdmin) return false;
        
        const validPasswords = {
            'admin032630': 'admin123',
            'CYY302630': '1'
        };
        
        return validPasswords[this.currentAdmin.username] === password;
    }

    // 設置事件監聽器
    setupEventListeners() {
        // 側邊欄導航
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.switchPage(page);
            });
        });

        // 側邊欄切換
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // 產品相關事件
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.showProductModal();
        });

        document.getElementById('saveProductBtn').addEventListener('click', () => {
            this.saveProduct();
        });

        // 產品搜索和篩選
        document.getElementById('productSearch')?.addEventListener('input', () => {
            this.loadProducts();
        });

        document.getElementById('categoryFilter')?.addEventListener('change', () => {
            this.loadProducts();
        });

        document.getElementById('statusFilter')?.addEventListener('change', () => {
            this.loadProducts();
        });

        // 全選產品
        document.getElementById('selectAllProducts')?.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.product-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });

        // 圖片預覽
        document.getElementById('imageInput')?.addEventListener('change', (e) => {
            this.previewImage(e.target);
        });

        // 響應式處理
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // 檢查認證令牌
    checkAuthToken() {
        console.log('Checking auth token:', this.token);
        if (!this.token) {
            console.log('No token found, showing login modal');
            this.showLoginModal();
            return;
        }
        // 在開發模式下，只檢查token是否存在，不進行API驗證
        if (this.token.startsWith('mock-admin-token')) {
            // 模擬登錄token，直接認為有效
            console.log('Using mock authentication token, user is authenticated');
            return;
        }
        // 對於真實token，驗證令牌有效性
        console.log('Verifying real token...');
        this.verifyToken();
    }

    // 驗證令牌
    async verifyToken() {
        try {
            const response = await fetch(`${this.apiBase}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Token invalid');
            }
        } catch (error) {
            console.log('Token verification failed, but keeping user logged in for development');
            // 在開發環境下，即使API驗證失敗也不強制重新登錄
            // this.showLoginModal();
        }
    }

    // 顯示登錄模態框
    showLoginModal() {
        // 檢查是否已經有登錄模態框存在
        if (document.getElementById('loginModal')) {
            console.log('Login modal already exists, not creating new one');
            return;
        }

        console.log('Creating login modal');
        const loginModal = `
            <div class="modal fade" id="loginModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">管理員登錄</h5>
                        </div>
                        <div class="modal-body">
                            <form id="loginForm">
                                <div class="mb-3">
                                    <label class="form-label">用戶名</label>
                                    <input type="text" class="form-control" name="username" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">密碼</label>
                                    <input type="password" class="form-control" name="password" required>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">登錄</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loginModal);
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();

        // 登錄表單提交
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e.target);
        });
    }

    // 處理登錄
    async handleLogin(form) {
        const formData = new FormData(form);
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.token;
                localStorage.setItem('adminToken', this.token);
                
                const modalElement = document.getElementById('loginModal');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                    // 移除模態框元素
                    setTimeout(() => {
                        modalElement.remove();
                    }, 300);
                }
                
                this.showNotification('登錄成功', 'success');
                this.loadDashboardData();
            } else {
                this.showNotification('登錄失敗，請檢查用戶名和密碼', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            // 檢查是否為開發環境的測試帳戶
            const username = loginData.username;
            const password = loginData.password;
            
            if ((username === 'admin032630' && password === 'admin123') || 
                (username === 'CYY302630' && password === '1')) {
                // 模擬登錄成功
                const mockToken = 'mock-admin-token-' + Date.now();
                this.token = mockToken;
                localStorage.setItem('adminToken', mockToken);
                localStorage.setItem('adminUsername', username);
                
                // 載入管理員信息
                this.loadAdminInfo();
                
                const modalElement = document.getElementById('loginModal');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                    // 移除模態框元素
                    setTimeout(() => {
                        modalElement.remove();
                    }, 300);
                }
                
                this.showNotification('登錄成功', 'success');
                this.loadDashboardData();
            } else {
                this.showNotification('登錄失敗，請檢查用戶名和密碼', 'error');
            }
        }
    }

    // 頁面切換
    switchPage(page) {
        // 更新導航狀態
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // 切換頁面內容
        document.querySelectorAll('.page-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');

        this.currentPage = page;

        // 載入相應頁面的數據
        switch(page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'statistics':
                this.loadStatistics();
                break;
        }
    }

    // 切換側邊欄
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }

    // 響應式處理
    handleResize() {
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.add('collapsed');
            document.querySelector('.main-content').classList.add('expanded');
        } else {
            document.querySelector('.sidebar').classList.remove('collapsed');
            document.querySelector('.main-content').classList.remove('expanded');
        }
    }

    // 載入儀表板數據
    async loadDashboardData() {
        try {
            // 載入統計數據
            const stats = await this.fetchData('/admin/statistics');
            this.updateStatistics(stats);

            // 載入近期訂單
            const orders = await this.fetchData('/admin/orders/recent');
            this.updateRecentOrders(orders);

            // 載入熱門產品
            const products = await this.fetchData('/admin/products/popular');
            this.updatePopularProducts(products);

        } catch (error) {
            console.error('Dashboard data loading error:', error);
            // 使用模擬數據
            this.loadMockData();
        }
    }

    // 載入模擬數據
    loadMockData() {
        // 模擬統計數據
        const mockStats = {
            totalProducts: 156,
            totalOrders: 89,
            totalUsers: 1247,
            totalSales: 125640
        };
        this.updateStatistics(mockStats);

        // 模擬近期訂單
        const mockOrders = [
            { id: 'ORD001', user: '張三', amount: 2580, status: 'pending', date: '2024-01-15' },
            { id: 'ORD002', user: '李四', amount: 1890, status: 'completed', date: '2024-01-14' },
            { id: 'ORD003', user: '王五', amount: 3420, status: 'processing', date: '2024-01-14' },
            { id: 'ORD004', user: '趙六', amount: 980, status: 'completed', date: '2024-01-13' }
        ];
        this.updateRecentOrders(mockOrders);

        // 模擬熱門產品
        const mockProducts = [
            { name: '現代簡約沙發', sales: 45 },
            { name: '實木餐桌', sales: 38 },
            { name: '舒適辦公椅', sales: 32 },
            { name: '北歐茶几', sales: 28 }
        ];
        this.updatePopularProducts(mockProducts);
    }

    // 更新統計數據
    updateStatistics(stats) {
        document.getElementById('totalProducts').textContent = stats.totalProducts || 0;
        document.getElementById('totalOrders').textContent = stats.totalOrders || 0;
        document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
        document.getElementById('totalSales').textContent = `$${(stats.totalSales || 0).toLocaleString()}`;
    }

    // 更新近期訂單
    updateRecentOrders(orders) {
        const tbody = document.getElementById('recentOrders');
        tbody.innerHTML = '';

        orders.forEach(order => {
            const statusClass = this.getStatusClass(order.status);
            const row = `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.user}</td>
                    <td>$${order.amount.toLocaleString()}</td>
                    <td><span class="badge ${statusClass}">${this.getStatusText(order.status)}</span></td>
                    <td>${order.date}</td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }

    // 更新熱門產品
    updatePopularProducts(products) {
        const container = document.getElementById('popularProducts');
        container.innerHTML = '';

        products.forEach(product => {
            const item = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="mb-1">${product.name}</h6>
                        <small class="text-muted">銷量: ${product.sales}</small>
                    </div>
                    <div class="progress" style="width: 100px;">
                        <div class="progress-bar" role="progressbar" style="width: ${product.sales}%"></div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', item);
        });
    }

    // 載入產品數據
    async loadProducts() {
        try {
            const products = await this.fetchData('/admin/products');
            this.updateProductsTable(products);
        } catch (error) {
            console.error('Products loading error:', error);
            this.loadProductsFromStorage();
        }
    }

    // 載入產品數據
    loadProductsFromStorage() {
        let products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        
        // 如果沒有產品數據，創建初始數據
        if (products.length === 0) {
            products = [
                {
                    id: 1,
                    name: '現代簡約沙發',
                    category: 'sofa',
                    price: 12800,
                    stock: 15,
                    status: 'ACTIVE',
                    description: '時尚現代的簡約風格沙發，適合各種居家裝飾風格',
                    image: 'https://via.placeholder.com/300x200',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                },
                {
                    id: 2,
                    name: '實木餐桌',
                    category: 'table',
                    price: 8900,
                    stock: 8,
                    status: 'ACTIVE',
                    description: '優質實木製作，堅固耐用的餐桌',
                    image: 'https://via.placeholder.com/300x200',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                },
                {
                    id: 3,
                    name: '舒適辦公椅',
                    category: 'chair',
                    price: 2580,
                    stock: 0,
                    status: 'INACTIVE',
                    description: '人體工學設計，舒適的辦公椅',
                    image: 'https://via.placeholder.com/300x200',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                }
            ];
            localStorage.setItem('adminProducts', JSON.stringify(products));
            this.updateMainSiteProducts(); // 初始化主站產品
        }
        
        this.updateProductsTable(products);
    }

    // 更新產品表格
    updateProductsTable(products) {
        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = '';

        // 添加搜索和篩選功能
        const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        let filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            const matchesStatus = !statusFilter || product.status === statusFilter;
            
            return matchesSearch && matchesCategory && matchesStatus;
        });

        if (filteredProducts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4">
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <p>沒有找到符合條件的產品</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        filteredProducts.forEach(product => {
            const statusClass = product.status === 'ACTIVE' ? 'success' : 'danger';
            const statusText = product.status === 'ACTIVE' ? '啟用' : '停用';
            const stockClass = product.stock > 0 ? 'text-success' : 'text-danger';
            const stockStatus = product.stock > 0 ? product.stock : '缺貨';
            const categoryText = this.getCategoryText(product.category);
            
            const row = `
                <tr data-product-id="${product.id}">
                    <td>
                        <input type="checkbox" class="form-check-input product-checkbox" value="${product.id}">
                    </td>
                    <td>
                        <img src="${product.image || 'https://via.placeholder.com/50x50'}" 
                             class="product-image" alt="${product.name}"
                             onerror="this.src='https://via.placeholder.com/50x50'">
                    </td>
                    <td>
                        <div class="fw-semibold">${product.name}</div>
                        <small class="text-muted">ID: ${product.id}</small>
                    </td>
                    <td>${categoryText}</td>
                    <td class="fw-semibold">$${product.price.toLocaleString()}</td>
                    <td class="${stockClass} fw-semibold">${stockStatus}</td>
                    <td><span class="badge badge-${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-primary" onclick="admin.editProduct(${product.id})" 
                                    title="編輯">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-warning" onclick="admin.toggleProductStatus(${product.id})" 
                                    title="${product.status === 'ACTIVE' ? '停用' : '啟用'}">
                                <i class="fas fa-${product.status === 'ACTIVE' ? 'pause' : 'play'}"></i>
                            </button>
                            <button class="btn btn-danger" onclick="admin.deleteProduct(${product.id})" 
                                    title="刪除">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });

        // 更新統計信息
        this.updateProductStats(products, filteredProducts);
    }

    // 獲取分類文本
    getCategoryText(category) {
        const categoryMap = {
            'sofa': '沙發',
            'chair': '椅子',
            'table': '桌子',
            'bed': '床具',
            'storage': '收納',
            'decoration': '裝飾'
        };
        return categoryMap[category] || category;
    }

    // 更新產品統計
    updateProductStats(allProducts, filteredProducts) {
        const statsDiv = document.getElementById('productStats');
        if (statsDiv) {
            const totalProducts = allProducts.length;
            const activeProducts = allProducts.filter(p => p.status === 'ACTIVE').length;
            const lowStockProducts = allProducts.filter(p => p.stock <= 5 && p.stock > 0).length;
            const outOfStockProducts = allProducts.filter(p => p.stock === 0).length;

            statsDiv.innerHTML = `
                <div class="row text-center">
                    <div class="col-md-3">
                        <div class="text-primary fw-bold fs-4">${totalProducts}</div>
                        <div class="text-muted">總產品數</div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-success fw-bold fs-4">${activeProducts}</div>
                        <div class="text-muted">啟用中</div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-warning fw-bold fs-4">${lowStockProducts}</div>
                        <div class="text-muted">庫存不足</div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-danger fw-bold fs-4">${outOfStockProducts}</div>
                        <div class="text-muted">缺貨</div>
                    </div>
                </div>
                <hr>
                <div class="text-muted">
                    顯示 ${filteredProducts.length} / ${totalProducts} 個產品
                </div>
            `;
        }
    }

    // 切換產品狀態
    async toggleProductStatus(id) {
        if (!this.hasPermission('products')) {
            this.showNotification('您沒有權限執行此操作', 'error');
            return;
        }

        const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const productIndex = products.findIndex(p => p.id == id);
        
        if (productIndex !== -1) {
            const newStatus = products[productIndex].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            products[productIndex].status = newStatus;
            products[productIndex].updatedAt = new Date().toISOString();
            
            localStorage.setItem('adminProducts', JSON.stringify(products));
            this.showNotification(`產品已${newStatus === 'ACTIVE' ? '啟用' : '停用'}`, 'success');
            this.loadProducts();
            this.updateMainSiteProducts();
        }
    }

    // 顯示產品模態框
    showProductModal(product = null) {
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal'));
        const form = document.getElementById('productForm');
        
        if (product) {
            // 編輯模式
            document.querySelector('#productModal .modal-title').textContent = '編輯產品';
            form.dataset.productId = product.id;
            this.fillProductForm(product);
        } else {
            // 新增模式
            document.querySelector('#productModal .modal-title').textContent = '新增產品';
            delete form.dataset.productId;
            form.reset();
        }
        
        modal.show();
    }

    // 填充產品表單
    fillProductForm(product) {
        const form = document.getElementById('productForm');
        form.name.value = product.name || '';
        form.category.value = product.category || '';
        form.price.value = product.price || '';
        form.stock.value = product.stock || '';
        form.description.value = product.description || '';
        form.status.value = product.status || 'ACTIVE';
        
        // 顯示當前圖片
        const currentImageDiv = document.getElementById('currentImage');
        if (currentImageDiv) {
            if (product.image) {
                currentImageDiv.innerHTML = `
                    <div class="mb-2">
                        <label class="form-label">當前圖片:</label>
                        <div>
                            <img src="${product.image}" alt="產品圖片" style="max-width: 100px; max-height: 100px;" class="img-thumbnail">
                        </div>
                    </div>
                `;
            } else {
                currentImageDiv.innerHTML = '';
            }
        }
    }

    // 保存產品
    async saveProduct() {
        if (!this.hasPermission('products')) {
            this.showNotification('您沒有權限執行此操作', 'error');
            return;
        }

        // 身份確認
        const confirmed = await this.confirmIdentity('保存產品');
        if (!confirmed) return;

        const form = document.getElementById('productForm');
        const formData = new FormData(form);
        const isEdit = form.dataset.productId;
        
        const productData = {
            id: isEdit || null,
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            description: formData.get('description'),
            status: formData.get('status'),
            imageFile: formData.get('image')
        };

        // 客戶端驗證
        if (!this.validateProductData(productData)) {
            return;
        }

        try {
            // 模擬API調用
            const success = await this.simulateProductSave(productData);
            
            if (success) {
                bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
                this.showNotification(isEdit ? '產品更新成功' : '產品創建成功', 'success');
                this.loadProducts();
                this.updateMainSiteProducts(); // 同步更新主頁
            } else {
                this.showNotification('產品保存失敗', 'error');
            }
        } catch (error) {
            console.error('Product save error:', error);
            this.showNotification('產品保存失敗', 'error');
        }
    }

    // 驗證產品數據
    validateProductData(data) {
        if (!data.name || data.name.trim().length < 2) {
            this.showNotification('產品名稱至少需要2個字符', 'error');
            return false;
        }
        if (!data.category) {
            this.showNotification('請選擇產品分類', 'error');
            return false;
        }
        if (data.price <= 0) {
            this.showNotification('產品價格必須大於0', 'error');
            return false;
        }
        if (data.stock < 0) {
            this.showNotification('庫存數量不能為負數', 'error');
            return false;
        }
        return true;
    }

    // 模擬產品保存
    async simulateProductSave(productData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 獲取現有產品列表
                let products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
                
                if (productData.id) {
                    // 更新現有產品
                    const index = products.findIndex(p => p.id == productData.id);
                    if (index !== -1) {
                        products[index] = { ...products[index], ...productData, updatedAt: new Date().toISOString() };
                    }
                } else {
                    // 創建新產品
                    productData.id = Date.now();
                    productData.createdAt = new Date().toISOString();
                    productData.updatedAt = new Date().toISOString();
                    products.push(productData);
                }
                
                // 保存到localStorage
                localStorage.setItem('adminProducts', JSON.stringify(products));
                resolve(true);
            }, 500);
        });
    }

    // 同步更新主站產品
    updateMainSiteProducts() {
        const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const activeProducts = products.filter(p => p.status === 'ACTIVE');
        
        // 更新主站的產品數據
        localStorage.setItem('siteProducts', JSON.stringify(activeProducts));
        
        console.log('主頁產品已同步更新', activeProducts.length, '個產品');
    }

    // 編輯產品
    async editProduct(id) {
        if (!this.hasPermission('products')) {
            this.showNotification('您沒有權限執行此操作', 'error');
            return;
        }

        const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const product = products.find(p => p.id == id);
        
        if (product) {
            this.showProductModal(product);
        } else {
            this.showNotification('產品不存在', 'error');
        }
    }

    // 刪除產品
    async deleteProduct(id) {
        if (!this.hasPermission('products')) {
            this.showNotification('您沒有權限執行此操作', 'error');
            return;
        }

        // 身份確認
        const confirmed = await this.confirmIdentity('刪除產品');
        if (!confirmed) return;

        const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const productIndex = products.findIndex(p => p.id == id);
        
        if (productIndex !== -1) {
            const product = products[productIndex];
            
            // 二次確認
            const doubleConfirm = confirm(`確定要刪除產品 "${product.name}" 嗎？此操作不可恢復！`);
            if (!doubleConfirm) return;

            products.splice(productIndex, 1);
            localStorage.setItem('adminProducts', JSON.stringify(products));
            
            this.showNotification('產品刪除成功', 'success');
            this.loadProducts();
            this.updateMainSiteProducts(); // 同步更新主頁
        } else {
            this.showNotification('產品不存在', 'error');
        }
    }

    // 批量操作產品
    async bulkProductAction(action, productIds) {
        if (!this.hasPermission('products')) {
            this.showNotification('您沒有權限執行此操作', 'error');
            return;
        }

        const confirmed = await this.confirmIdentity(`批量${action}產品`);
        if (!confirmed) return;

        const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        let updatedCount = 0;

        productIds.forEach(id => {
            const productIndex = products.findIndex(p => p.id == id);
            if (productIndex !== -1) {
                switch(action) {
                    case '啟用':
                        products[productIndex].status = 'ACTIVE';
                        updatedCount++;
                        break;
                    case '停用':
                        products[productIndex].status = 'INACTIVE';
                        updatedCount++;
                        break;
                    case '刪除':
                        products.splice(productIndex, 1);
                        updatedCount++;
                        break;
                }
            }
        });

        if (updatedCount > 0) {
            localStorage.setItem('adminProducts', JSON.stringify(products));
            this.showNotification(`成功${action} ${updatedCount} 個產品`, 'success');
            this.loadProducts();
            this.updateMainSiteProducts();
        }
    }

    // 圖片預覽功能
    previewImage(input) {
        const previewDiv = document.getElementById('imagePreview');
        previewDiv.innerHTML = '';

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewDiv.innerHTML = `
                    <div class="mt-2">
                        <label class="form-label">圖片預覽:</label>
                        <div>
                            <img src="${e.target.result}" alt="圖片預覽" 
                                 style="max-width: 100%; max-height: 200px;" 
                                 class="img-thumbnail">
                        </div>
                    </div>
                `;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // 批量操作
    bulkAction(action) {
        const selectedIds = Array.from(document.querySelectorAll('.product-checkbox:checked'))
                                .map(cb => cb.value);

        if (selectedIds.length === 0) {
            this.showNotification('請先選擇要操作的產品', 'warning');
            return;
        }

        let actionText;
        switch(action) {
            case 'enable':
                actionText = '啟用';
                this.bulkProductAction('啟用', selectedIds);
                break;
            case 'disable':
                actionText = '停用';
                this.bulkProductAction('停用', selectedIds);
                break;
            case 'delete':
                actionText = '刪除';
                if (confirm(`確定要刪除選中的 ${selectedIds.length} 個產品嗎？此操作不可恢復！`)) {
                    this.bulkProductAction('刪除', selectedIds);
                }
                break;
        }
    }

    // 載入分類數據
    async loadCategories() {
        console.log('Loading categories...');
    }

    // 載入訂單數據
    async loadOrders() {
        console.log('Loading orders...');
    }

    // 載入用戶數據
    async loadUsers() {
        console.log('Loading users...');
    }

    // 載入統計數據
    async loadStatistics() {
        console.log('Loading statistics...');
    }

    // 獲取數據的通用方法
    async fetchData(endpoint) {
        const response = await fetch(`${this.apiBase}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // 獲取狀態樣式類
    getStatusClass(status) {
        switch(status) {
            case 'completed': return 'badge-success';
            case 'processing': return 'badge-warning';
            case 'pending': return 'badge-warning';
            case 'cancelled': return 'badge-danger';
            default: return 'badge-secondary';
        }
    }

    // 獲取狀態文本
    getStatusText(status) {
        switch(status) {
            case 'completed': return '已完成';
            case 'processing': return '處理中';
            case 'pending': return '待處理';
            case 'cancelled': return '已取消';
            default: return '未知';
        }
    }

    // 顯示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 工具函數
const Utils = {
    // 格式化日期
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('zh-TW');
    },

    // 格式化貨幣
    formatCurrency: (amount) => {
        return `$${amount.toLocaleString()}`;
    },

    // 防抖函數
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 節流函數
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 初始化後台管理系統
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminDashboard();
}); 