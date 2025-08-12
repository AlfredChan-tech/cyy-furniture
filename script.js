// DOM元素
const carousel = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const searchInput = document.querySelector('.search-input');
const cartCount = document.querySelector('.cart-count');
const authModal = document.getElementById('authModal');
const authTabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const userIcon = document.getElementById('userIcon');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
const wishlistBtns = document.querySelectorAll('.wishlist-btn');

// 輪播圖功能
let currentSlide = 0;
let slideInterval;

function showSlide(n) {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        indicators[index].classList.remove('active');
    });
    
    slides[n].classList.add('active');
    indicators[n].classList.add('active');
    currentSlide = n;
}

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

// 輪播圖事件監聽
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideshow();
        startSlideshow();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideshow();
        startSlideshow();
    });
}

// 指示器事件監聽
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
        stopSlideshow();
        startSlideshow();
    });
});

// 鼠標懸停時暫停輪播
const heroCarousel = document.querySelector('.hero-carousel');
if (heroCarousel) {
    heroCarousel.addEventListener('mouseenter', stopSlideshow);
    heroCarousel.addEventListener('mouseleave', startSlideshow);
}

// 啟動輪播
startSlideshow();

// 加載商品數據
function loadProducts() {
    const siteProducts = JSON.parse(localStorage.getItem('siteProducts') || '[]');
    console.log('載入商品數據:', siteProducts);
    
    if (siteProducts.length > 0) {
        renderProducts(siteProducts);
    } else {
        // 如果沒有商品數據，顯示預設商品
        console.log('沒有找到商品數據，顯示預設商品');
    }
}

// 渲染商品到頁面
function renderProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // 清空現有商品
    productsGrid.innerHTML = '';
    
    // 渲染商品卡片
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
    
    // 重新綁定事件
    setupProductEvents();
}

// 創建商品卡片
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    const originalPrice = product.originalPrice && product.originalPrice !== product.price ? 
        `<span class="original-price">NT$ ${product.originalPrice.toLocaleString()}</span>` : '';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}" alt="${product.name}">
            <div class="product-overlay">
                <button class="wishlist-btn" onclick="toggleWishlist('${product.id}')">
                    <i class="far fa-heart"></i>
                </button>
                <button class="quick-view-btn" onclick="showQuickView(${index})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">NT$ ${product.price.toLocaleString()}</span>
                ${originalPrice}
            </div>
            <button class="add-to-cart-btn" onclick="addToCart({
                id: '${product.id}',
                name: '${product.name}',
                price: ${product.price},
                image: '${product.image || ''}',
                description: '${product.description}'
            })">加入購物車</button>
        </div>
    `;
    
    return card;
}

// 重新綁定產品事件
function setupProductEvents() {
    // 重新綁定加入購物車按鈕
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            
            if (productId) {
                const siteProducts = JSON.parse(localStorage.getItem('siteProducts') || '[]');
                const product = siteProducts.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            }
        });
    });
}

// 監聽localStorage變化
window.addEventListener('storage', function(e) {
    if (e.key === 'siteProducts') {
        console.log('商品數據已更新，重新載入頁面');
        loadProducts();
    }
});

// 頁面載入時加載商品
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

// 搜索功能
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        }
    });
}

function performSearch(term) {
    // 跳轉到搜索結果頁面
    window.location.href = `search-results.html?q=${encodeURIComponent(term)}`;
}

// 購物車功能 - 避免重複聲明
let cart;
if (typeof window.cart === 'undefined') {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
} else {
    cart = window.cart;
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function addToCart(product) {
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
    updateCartCount();
    showNotification('商品已加入購物車！');
}

// 加入購物車按鈕事件
addToCartBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // 防止事件冒泡到產品卡片
        
        // 使用預定義的產品數據
        const product = products[index];
        if (product) {
            addToCart(product);
        }
        
        // 按鈕動畫效果
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    });
});

// 收藏功能
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('已從收藏中移除');
    } else {
        wishlist.push(productId);
        showNotification('已加入收藏');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// 收藏按鈕事件
wishlistBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // 防止事件冒泡到產品卡片
        const productId = index + 1;
        toggleWishlist(productId);
        
        // 切換愛心圖標
        const icon = btn.querySelector('i');
        if (wishlist.includes(productId)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.color = '#e74c3c';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.style.color = '#333';
        }
    });
});

// 模態框功能
function openModal() {
    if (authModal) {
        authModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (authModal) {
        authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 用戶圖標點擊事件
if (userIcon) {
    userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

// 關閉模態框事件
const closeBtn = document.querySelector('.close');
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// 點擊模態框外部關閉
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeModal();
    }
});

// 標籤頁切換
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // 移除所有活動狀態
        authTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 添加活動狀態
        tab.classList.add('active');
        document.getElementById(tabName + 'Tab').classList.add('active');
    });
});

// 表單提交
const authForms = document.querySelectorAll('.auth-form');
authForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isLogin = form.closest('#loginTab');
        if (isLogin) {
            handleLogin(form);
        } else {
            handleRegister(form);
        }
    });
});

function handleLogin(form) {
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // 這裡應該調用後端API進行登錄驗證
    console.log('登錄:', { email, password });
    
    // 模擬登錄成功
    setTimeout(() => {
        showNotification('登錄成功！');
        closeModal();
        // 更新UI顯示已登錄狀態
        updateLoginStatus(true);
    }, 1000);
}

function handleRegister(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // 這裡應該調用後端API進行註冊
    console.log('註冊:', data);
    
    // 模擬註冊成功
    setTimeout(() => {
        showNotification('註冊成功！');
        closeModal();
        updateLoginStatus(true);
    }, 1000);
}

function updateLoginStatus(isLoggedIn) {
    if (isLoggedIn) {
        // 更新用戶圖標，可以顯示用戶頭像或改變顏色
        userIcon.style.color = '#8b7355';
        userIcon.innerHTML = '<i class="fas fa-user-circle"></i>';
    }
}

// 通知功能
function showNotification(message) {
    // 創建通知元素
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
    
    // 顯示動畫
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自動隱藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 平滑滾動到頂部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 懶加載圖片
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 動畫效果
function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .category-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 響應式導航菜單
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navMenuOverlay = document.querySelector('.nav-menu-overlay');
const closeMenuBtn = document.querySelector('.close-menu');

// 開啟菜單
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        navMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// 關閉菜單
if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
        navMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// 點擊覆蓋層關閉菜單
if (navMenuOverlay) {
    navMenuOverlay.addEventListener('click', (e) => {
        if (e.target === navMenuOverlay) {
            navMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ESC鍵關閉菜單
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenuOverlay.classList.contains('active')) {
        navMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// 快速查看功能
const quickViewBtns = document.querySelectorAll('.quick-view-btn');
quickViewBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 這裡可以實現快速查看功能，顯示產品詳細信息的模態框
        showQuickView(index);
    });
});

// 產品數據
const products = [
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

function showQuickView(productIndex) {
    const product = products[productIndex];
    if (!product) return;
    
    // 獲取模態框元素
    const modal = document.getElementById('quickViewModal');
    const image = document.getElementById('quickViewImage');
    const title = document.getElementById('quickViewTitle');
    const description = document.getElementById('quickViewDescription');
    const price = document.getElementById('quickViewPrice');
    const originalPrice = document.getElementById('quickViewOriginalPrice');
    const addToCartBtn = document.getElementById('quickViewAddToCart');
    const wishlistBtn = document.getElementById('quickViewWishlist');
    const detailsBtn = document.getElementById('quickViewDetails');
    
    // 設置產品信息
    if (image) image.src = product.image;
    if (title) title.textContent = product.name;
    if (description) description.textContent = product.description;
    if (price) price.textContent = `NT$ ${product.price.toLocaleString()}`;
    if (originalPrice) {
        originalPrice.textContent = product.originalPrice ? `NT$ ${product.originalPrice.toLocaleString()}` : '';
        originalPrice.style.display = product.originalPrice ? 'inline' : 'none';
    }
    
    // 設置按鈕事件
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            addToCart(product);
            closeQuickView();
        };
    }
    
    if (wishlistBtn) {
        // 檢查是否已在願望清單中
        const isWishlisted = wishlist.includes(product.id);
        const icon = wishlistBtn.querySelector('i');
        if (isWishlisted) {
            icon.className = 'fas fa-heart';
            wishlistBtn.classList.add('active');
        } else {
            icon.className = 'far fa-heart';
            wishlistBtn.classList.remove('active');
        }
        
        wishlistBtn.onclick = () => {
            toggleWishlist(product.id);
            // 更新按鈕狀態
            const isWishlisted = wishlist.includes(product.id);
            if (isWishlisted) {
                icon.className = 'fas fa-heart';
                wishlistBtn.classList.add('active');
            } else {
                icon.className = 'far fa-heart';
                wishlistBtn.classList.remove('active');
            }
        };
    }
    
    if (detailsBtn) {
        detailsBtn.onclick = () => {
            window.location.href = `product-detail.html?id=${product.id}`;
        };
    }
    
    // 顯示模態框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 關閉快速查看模態框
function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 設置快速查看事件監聽器
function setupQuickViewEvents() {
    // 關閉按鈕
    const closeBtn = document.querySelector('.close-quick-view');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuickView);
    }
    
    // 點擊模態框外部關閉
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeQuickView();
            }
        });
    }
    
    // ESC鍵關閉
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeQuickView();
        }
    });
}

// 設置產品卡片點擊事件
function setupProductCardClicks() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // 檢查是否點擊了按鈕或其他交互元素
            if (e.target.closest('.add-to-cart-btn') || 
                e.target.closest('.wishlist-btn') || 
                e.target.closest('.quick-view-btn') ||
                e.target.closest('.product-overlay')) {
                return;
            }
            
            // 跳轉到產品詳細頁面
            const productId = index + 1;
            window.location.href = `product-detail.html?id=${productId}`;
        });
        
        // 為卡片添加鼠標懸停效果
        card.style.cursor = 'pointer';
    });
}

// 輪播圖CTA按鈕功能
function setupCarouselCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 根據輪播圖索引跳轉到相應頁面
            switch(index) {
                case 0: // 限時優惠
                    window.location.href = 'search-results.html?q=限時優惠';
                    break;
                case 1: // 新品上市
                    window.location.href = 'search-results.html?q=新品';
                    break;
                case 2: // 熱門推薦
                    window.location.href = 'search-results.html?q=熱門';
                    break;
                default:
                    window.location.href = 'search-results.html';
            }
        });
    });
}

// 產品分類卡片功能
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    const categories = ['living', 'bedroom', 'dining']; // 根據實際分類調整
    
    categoryCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 跳轉到該分類的搜索結果
            const category = categories[index] || 'all';
            window.location.href = `search-results.html?category=${category}`;
        });
        
        card.style.cursor = 'pointer';
    });
}

// 品牌故事按鈕功能
function setupBrandStoryButton() {
    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // 跳轉到品牌故事頁面（暫時跳轉到關於我們）
            window.location.href = 'about.html';
        });
    }
}

// 初始化函數
function init() {
    updateCartCount();
    lazyLoadImages();
    addScrollAnimations();
    setupProductCardClicks();
    setupCarouselCTAButtons();
    setupCategoryCards();
    setupBrandStoryButton();
    setupQuickViewEvents();
    
    // 檢查用戶登錄狀態
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        updateLoginStatus(true);
    }
    
    // 更新收藏按鈕狀態
    wishlistBtns.forEach((btn, index) => {
        const productId = index + 1;
        if (wishlist.includes(productId)) {
            const icon = btn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.color = '#e74c3c';
        }
    });
    
    console.log('主頁初始化完成，當前購物車:', cart); // 調試信息
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', init);

// 監聽窗口大小變化
window.addEventListener('resize', () => {
    // 響應式處理
    if (window.innerWidth > 768) {
        if (navMenuOverlay && navMenuOverlay.classList.contains('active')) {
            navMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 搜索防抖
const debouncedSearch = debounce((term) => {
    performSearch(term);
}, 300);

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim();
        if (term.length > 2) {
            debouncedSearch(term);
        }
    });
}

// 頁面性能優化
// 預加載重要圖片
function preloadImages() {
    const importantImages = [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// 頁面載入完成後預加載圖片
window.addEventListener('load', preloadImages); 