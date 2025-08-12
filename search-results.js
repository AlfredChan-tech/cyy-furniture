// 搜索結果頁面功能
class SearchResultsPage {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentSearchTerm = '';
        this.filters = {
            category: '',
            priceRange: '',
            sortBy: 'relevance'
        };
        this.allProducts = [];
        this.filteredProducts = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.parseURLParams();
        this.performSearch();
    }

    // 模擬產品數據
    loadProducts() {
        this.allProducts = [
            {
                id: 1,
                name: '現代簡約沙發',
                description: '舒適的三人座沙發，採用高品質布料',
                price: 15900,
                originalPrice: 18900,
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                category: 'living',
                tags: ['沙發', '客廳', '布沙發', '三人座']
            },
            {
                id: 2,
                name: '橡木餐桌',
                description: '天然橡木製作的六人餐桌',
                price: 28900,
                originalPrice: 32900,
                image: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                category: 'dining',
                tags: ['餐桌', '橡木', '實木', '餐廳']
            },
            {
                id: 3,
                name: '舒適雙人床',
                description: '現代風格雙人床架，含床頭櫃',
                price: 22900,
                originalPrice: 25900,
                image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                category: 'bedroom',
                tags: ['床', '雙人床', '床架', '臥室']
            },
            {
                id: 4,
                name: '現代辦公椅',
                description: '人體工學設計的辦公椅，提供全日舒適支撐',
                price: 8900,
                originalPrice: 10900,
                image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                category: 'office',
                tags: ['辦公椅', '人體工學', '椅子', '辦公']
            },
            {
                id: 5,
                name: '工業風茶几',
                description: '結合金屬與木材的現代茶几',
                price: 12900,
                originalPrice: 14900,
                image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                category: 'living',
                tags: ['茶几', '工業風', '金屬', '客廳']
            },
            {
                id: 6,
                name: '北歐書櫃',
                description: '簡約北歐風格的開放式書櫃',
                price: 18900,
                originalPrice: 21900,
                image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                category: 'living',
                tags: ['書櫃', '北歐', '收納', '展示櫃']
            },
            {
                id: 7,
                name: '舒適單人椅',
                description: '柔軟舒適的休閒單人椅',
                price: 9900,
                originalPrice: 12900,
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                category: 'living',
                tags: ['單人椅', '休閒椅', '客廳', '椅子']
            },
            {
                id: 8,
                name: '實木衣櫃',
                description: '大容量實木衣櫃，含鏡面門',
                price: 35900,
                originalPrice: 39900,
                image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                category: 'bedroom',
                tags: ['衣櫃', '實木', '收納', '臥室']
            }
        ];
    }

    setupEventListeners() {
        // 搜索輸入框
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }

        // 篩選器
        const sortBy = document.getElementById('sortBy');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceRange = document.getElementById('priceRange');
        const clearFilters = document.querySelector('.clear-filters');

        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        if (priceRange) {
            priceRange.addEventListener('change', (e) => {
                this.filters.priceRange = e.target.value;
                this.applyFilters();
            });
        }

        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // 分頁
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');

        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.displayResults();
                }
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.displayResults();
                }
            });
        }

        // 導航菜單
        this.setupNavigation();
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

    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentSearchTerm = urlParams.get('q') || '';
        const categoryParam = urlParams.get('category') || '';
        
        // 更新搜索輸入框
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = this.currentSearchTerm;
        }
        
        // 更新分類篩選器
        if (categoryParam) {
            this.filters.category = categoryParam;
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = categoryParam;
            }
        }
    }

    handleSearch(term) {
        this.currentSearchTerm = term.trim();
        this.currentPage = 1;
        
        // 更新URL
        const url = new URL(window.location);
        url.searchParams.set('q', this.currentSearchTerm);
        window.history.replaceState({}, '', url);
        
        this.performSearch();
    }

    performSearch() {
        if (!this.currentSearchTerm) {
            this.filteredProducts = [...this.allProducts];
        } else {
            this.filteredProducts = this.allProducts.filter(product => {
                const searchLower = this.currentSearchTerm.toLowerCase();
                return product.name.toLowerCase().includes(searchLower) ||
                       product.description.toLowerCase().includes(searchLower) ||
                       product.tags.some(tag => tag.toLowerCase().includes(searchLower));
            });
        }

        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.filteredProducts];

        // 分類篩選
        if (this.filters.category) {
            filtered = filtered.filter(product => product.category === this.filters.category);
        }

        // 價格範圍篩選
        if (this.filters.priceRange) {
            filtered = filtered.filter(product => {
                const price = product.price;
                switch (this.filters.priceRange) {
                    case '0-5000':
                        return price <= 5000;
                    case '5000-10000':
                        return price > 5000 && price <= 10000;
                    case '10000-20000':
                        return price > 10000 && price <= 20000;
                    case '20000+':
                        return price > 20000;
                    default:
                        return true;
                }
            });
        }

        // 排序
        switch (this.filters.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'relevance':
            default:
                // 保持原有順序
                break;
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.displayResults();
    }

    clearAllFilters() {
        this.filters = {
            category: '',
            priceRange: '',
            sortBy: 'relevance'
        };

        // 重置篩選器UI
        const sortBy = document.getElementById('sortBy');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceRange = document.getElementById('priceRange');

        if (sortBy) sortBy.value = 'relevance';
        if (categoryFilter) categoryFilter.value = '';
        if (priceRange) priceRange.value = '';

        this.performSearch();
    }

    displayResults() {
        const resultsGrid = document.getElementById('resultsGrid');
        const noResults = document.getElementById('noResults');
        const searchTerm = document.getElementById('searchTerm');
        const resultCount = document.getElementById('resultCount');

        // 更新搜索信息
        if (searchTerm) {
            searchTerm.textContent = this.currentSearchTerm;
        }
        if (resultCount) {
            resultCount.textContent = this.filteredProducts.length;
        }

        // 如果沒有結果
        if (this.filteredProducts.length === 0) {
            resultsGrid.style.display = 'none';
            noResults.style.display = 'block';
            this.updatePagination();
            return;
        }

        // 顯示結果
        resultsGrid.style.display = 'grid';
        noResults.style.display = 'none';

        // 分頁計算
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);

        // 清空現有結果
        resultsGrid.innerHTML = '';

        // 渲染產品卡片
        pageProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            resultsGrid.appendChild(productCard);
        });

        // 更新分頁
        this.updatePagination();

        // 滾動到頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="wishlist-btn" data-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="quick-view-btn" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="current-price">$${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">加入購物車</button>
            </div>
        `;

        // 添加事件監聽
        this.addProductCardEvents(card, product);

        return card;
    }

    addProductCardEvents(card, product) {
        // 加入購物車
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(product);
            });
        }

        // 收藏功能
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.toggleWishlist(product.id);
            });
        }

        // 快速查看
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', () => {
                this.showQuickView(product);
            });
        }

        // 點擊產品跳轉詳細頁面
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.product-overlay') && !e.target.closest('.add-to-cart-btn')) {
                window.location.href = `product-detail.html?id=${product.id}`;
            }
        });
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

    toggleWishlist(productId) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const index = wishlist.indexOf(productId);

        if (index > -1) {
            wishlist.splice(index, 1);
            this.showNotification('已從收藏中移除');
        } else {
            wishlist.push(productId);
            this.showNotification('已加入收藏');
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    showQuickView(product) {
        // 實現快速查看功能
        alert(`快速查看: ${product.name}`);
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        const pageNumbers = document.getElementById('pageNumbers');

        // 更新按鈕狀態
        if (prevPage) {
            prevPage.disabled = this.currentPage === 1;
        }
        if (nextPage) {
            nextPage.disabled = this.currentPage === totalPages || totalPages === 0;
        }

        // 更新頁碼
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            if (totalPages <= 5) {
                // 顯示所有頁碼
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.appendChild(this.createPageButton(i));
                }
            } else {
                // 智能顯示頁碼
                const startPage = Math.max(1, this.currentPage - 2);
                const endPage = Math.min(totalPages, this.currentPage + 2);

                if (startPage > 1) {
                    pageNumbers.appendChild(this.createPageButton(1));
                    if (startPage > 2) {
                        pageNumbers.appendChild(this.createEllipsis());
                    }
                }

                for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.appendChild(this.createPageButton(i));
                }

                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                        pageNumbers.appendChild(this.createEllipsis());
                    }
                    pageNumbers.appendChild(this.createPageButton(totalPages));
                }
            }
        }
    }

    createPageButton(pageNum) {
        const button = document.createElement('button');
        button.className = 'page-number';
        button.textContent = pageNum;
        if (pageNum === this.currentPage) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            this.currentPage = pageNum;
            this.displayResults();
        });

        return button;
    }

    createEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        return ellipsis;
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

// 初始化搜索結果頁面
document.addEventListener('DOMContentLoaded', () => {
    new SearchResultsPage();
}); 