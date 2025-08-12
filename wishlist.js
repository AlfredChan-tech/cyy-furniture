// 收藏頁面功能
class WishlistPage {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.selectedItems = [];
        this.products = [
            {
                id: 1,
                name: '現代簡約沙發',
                description: '舒適的三人座沙發，適合現代家居風格，採用高品質布料製作，提供優異的坐感體驗。',
                price: 35800,
                originalPrice: 42000,
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 2,
                name: '實木雙人床架',
                description: '精選實木製作，堅固耐用的雙人床架，簡約設計適合各種臥室風格。',
                price: 28500,
                originalPrice: null,
                image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 3,
                name: '橡木餐桌',
                description: '天然橡木材質，六人座餐桌，結合實用性與美觀性，是家庭聚餐的理想選擇。',
                price: 45200,
                originalPrice: null,
                image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 4,
                name: '現代書櫃',
                description: '多層收納設計，適合客廳或書房使用，簡潔線條展現現代美學。',
                price: 15800,
                originalPrice: null,
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderWishlist();
        this.updateCartCount();
    }

    setupEventListeners() {
        // 全選按鈕
        const selectAllBtn = document.getElementById('selectAllBtn');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => this.toggleSelectAll());
        }

        // 移除選中項目
        const removeSelectedBtn = document.getElementById('removeSelectedBtn');
        if (removeSelectedBtn) {
            removeSelectedBtn.addEventListener('click', () => this.removeSelectedItems());
        }

        // 全部加入購物車
        const addAllToCartBtn = document.getElementById('addAllToCartBtn');
        if (addAllToCartBtn) {
            addAllToCartBtn.addEventListener('click', () => this.addAllToCart());
        }

        // 模態框關閉事件
        const modal = document.getElementById('removeModal');
        const closeBtn = modal?.querySelector('.close');
        const cancelBtn = modal?.querySelector('.cancel-remove-btn');
        const confirmBtn = modal?.querySelector('.confirm-remove-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmRemove());
        }

        // 點擊模態框外部關閉
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // 導航菜單
        this.setupNavigation();

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = e.target.value.trim();
                    if (searchTerm) {
                        window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
                    }
                }
            });
        }

        // 推薦商品加入收藏
        const addToWishlistBtns = document.querySelectorAll('.add-to-wishlist-btn');
        addToWishlistBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const newProductId = Date.now() + index; // 簡單的ID生成
                this.addToWishlist(newProductId);
                btn.textContent = '已收藏';
                btn.disabled = true;
                btn.style.backgroundColor = '#27ae60';
                btn.style.borderColor = '#27ae60';
                btn.style.color = 'white';
            });
        });
    }

    setupNavigation() {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navMenuOverlay = document.querySelector('.nav-menu-overlay');
        const closeMenuBtn = document.querySelector('.close-menu');

        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', () => {
                navMenuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                navMenuOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        if (navMenuOverlay) {
            navMenuOverlay.addEventListener('click', (e) => {
                if (e.target === navMenuOverlay) {
                    navMenuOverlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    renderWishlist() {
        const wishlistItems = document.getElementById('wishlistItems');
        const emptyWishlist = document.getElementById('emptyWishlist');
        const wishlistActions = document.getElementById('wishlistActions');

        if (this.wishlist.length === 0) {
            wishlistItems.style.display = 'none';
            emptyWishlist.style.display = 'block';
            wishlistActions.style.display = 'none';
            return;
        }

        wishlistItems.style.display = 'grid';
        emptyWishlist.style.display = 'none';
        wishlistActions.style.display = 'flex';

        // 清空現有內容
        wishlistItems.innerHTML = '';

        // 渲染收藏商品
        this.wishlist.forEach(productId => {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                const wishlistItem = this.createWishlistItem(product);
                wishlistItems.appendChild(wishlistItem);
            }
        });

        this.updateActionButtons();
    }

    createWishlistItem(product) {
        const item = document.createElement('div');
        item.className = 'wishlist-item';
        item.dataset.productId = product.id;

        const isSelected = this.selectedItems.includes(product.id);

        item.innerHTML = `
            <input type="checkbox" class="item-checkbox" ${isSelected ? 'checked' : ''}>
            <div class="wishlist-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="remove-item-btn" data-product-id="${product.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="wishlist-info">
                <h3 class="wishlist-title">${product.name}</h3>
                <p class="wishlist-description">${product.description}</p>
                <div class="wishlist-price">
                    <span class="current-price">NT$ ${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="original-price">NT$ ${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="item-actions">
                    <button class="add-to-cart-btn" data-product-id="${product.id}">加入購物車</button>
                    <button class="view-details-btn" data-product-id="${product.id}">查看詳細</button>
                </div>
            </div>
        `;

        // 添加事件監聽器
        this.addItemEventListeners(item, product);

        return item;
    }

    addItemEventListeners(item, product) {
        // 選擇框事件
        const checkbox = item.querySelector('.item-checkbox');
        checkbox.addEventListener('change', (e) => {
            this.toggleItemSelection(product.id, e.target.checked);
        });

        // 移除單個商品
        const removeBtn = item.querySelector('.remove-item-btn');
        removeBtn.addEventListener('click', () => {
            this.removeFromWishlist(product.id);
        });

        // 加入購物車
        const addToCartBtn = item.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            this.addToCart(product);
        });

        // 查看詳細
        const viewDetailsBtn = item.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', () => {
            window.location.href = `product-detail.html?id=${product.id}`;
        });

        // 點擊商品圖片跳轉詳細頁面
        const image = item.querySelector('.wishlist-image img');
        image.addEventListener('click', () => {
            window.location.href = `product-detail.html?id=${product.id}`;
        });
        image.style.cursor = 'pointer';
    }

    toggleItemSelection(productId, isSelected) {
        const item = document.querySelector(`[data-product-id="${productId}"]`);
        
        if (isSelected) {
            if (!this.selectedItems.includes(productId)) {
                this.selectedItems.push(productId);
            }
            item.classList.add('selected');
        } else {
            this.selectedItems = this.selectedItems.filter(id => id !== productId);
            item.classList.remove('selected');
        }

        this.updateSelectAllButton();
        this.updateActionButtons();
    }

    toggleSelectAll() {
        const selectAllBtn = document.getElementById('selectAllBtn');
        const isAllSelected = this.selectedItems.length === this.wishlist.length;

        if (isAllSelected) {
            // 取消全選
            this.selectedItems = [];
            selectAllBtn.classList.remove('selected');
            selectAllBtn.innerHTML = '<i class="far fa-square"></i> 全選';
        } else {
            // 全選
            this.selectedItems = [...this.wishlist];
            selectAllBtn.classList.add('selected');
            selectAllBtn.innerHTML = '<i class="fas fa-check-square"></i> 取消全選';
        }

        // 更新所有商品的選中狀態
        const checkboxes = document.querySelectorAll('.item-checkbox');
        const wishlistItems = document.querySelectorAll('.wishlist-item');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = !isAllSelected;
        });

        wishlistItems.forEach(item => {
            if (!isAllSelected) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        this.updateActionButtons();
    }

    updateSelectAllButton() {
        const selectAllBtn = document.getElementById('selectAllBtn');
        const isAllSelected = this.selectedItems.length === this.wishlist.length && this.wishlist.length > 0;

        if (isAllSelected) {
            selectAllBtn.classList.add('selected');
            selectAllBtn.innerHTML = '<i class="fas fa-check-square"></i> 取消全選';
        } else {
            selectAllBtn.classList.remove('selected');
            selectAllBtn.innerHTML = '<i class="far fa-square"></i> 全選';
        }
    }

    updateActionButtons() {
        const removeSelectedBtn = document.getElementById('removeSelectedBtn');
        const addAllToCartBtn = document.getElementById('addAllToCartBtn');

        const hasSelection = this.selectedItems.length > 0;

        if (removeSelectedBtn) {
            removeSelectedBtn.disabled = !hasSelection;
        }

        if (addAllToCartBtn) {
            addAllToCartBtn.disabled = !hasSelection;
        }
    }

    removeSelectedItems() {
        if (this.selectedItems.length === 0) {
            this.showNotification('請先選擇要移除的商品');
            return;
        }

        this.showRemoveModal();
    }

    showRemoveModal() {
        const modal = document.getElementById('removeModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('removeModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    confirmRemove() {
        // 從收藏列表中移除選中的商品
        this.selectedItems.forEach(productId => {
            this.removeFromWishlist(productId, false);
        });

        this.selectedItems = [];
        this.saveWishlist();
        this.renderWishlist();
        this.closeModal();
        this.showNotification(`已移除 ${this.selectedItems.length} 個商品`);
    }

    removeFromWishlist(productId, showNotification = true) {
        this.wishlist = this.wishlist.filter(id => id !== productId);
        this.selectedItems = this.selectedItems.filter(id => id !== productId);
        this.saveWishlist();
        
        if (showNotification) {
            this.renderWishlist();
            this.showNotification('已從收藏中移除');
        }
    }

    addToWishlist(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            this.saveWishlist();
            this.showNotification('已加入收藏');
        }
    }

    addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification('商品已加入購物車！');
    }

    addAllToCart() {
        if (this.selectedItems.length === 0) {
            this.showNotification('請先選擇要加入購物車的商品');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let addedCount = 0;

        this.selectedItems.forEach(productId => {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                const existingItem = cart.find(item => item.id === product.id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        ...product,
                        quantity: 1
                    });
                }
                addedCount++;
            }
        });

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification(`已將 ${addedCount} 個商品加入購物車！`);
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #8b7355;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 3000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 初始化收藏頁面
document.addEventListener('DOMContentLoaded', () => {
    new WishlistPage();
}); 