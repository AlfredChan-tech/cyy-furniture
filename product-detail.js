// 產品詳情頁面交互功能

// DOM元素
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const colorOptions = document.querySelectorAll('.color-option');
const sizeOptions = document.querySelectorAll('.size-option');
const quantityInput = document.querySelector('.quantity-input');
const quantityMinusBtn = document.querySelector('.quantity-btn.minus');
const quantityPlusBtn = document.querySelector('.quantity-btn.plus');
const addToCartBtn = document.querySelector('.add-to-cart');
const buyNowBtn = document.querySelector('.buy-now');
const wishlistBtn = document.querySelector('.btn-wishlist');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const zoomBtn = document.querySelector('.zoom-btn');

// 產品數據
let currentProduct = {
    id: 1,
    name: '現代簡約沙發',
    basePrice: 35800,
    originalPrice: 42000,
    selectedColor: '灰色',
    selectedSize: '二人座',
    quantity: 1,
    images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
};

// 圖片切換功能
function initImageGallery() {
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            // 移除所有活動狀態
            thumbnails.forEach(t => t.classList.remove('active'));
            // 添加活動狀態
            thumbnail.classList.add('active');
            
            // 切換主圖片
            const newImageSrc = thumbnail.dataset.image;
            mainImage.src = newImageSrc;
            
            // 添加切換動畫
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 200);
        });
    });
}

// 顏色選擇功能
function initColorOptions() {
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // 移除所有活動狀態
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // 添加活動狀態
            option.classList.add('active');
            
            // 更新選中的顏色
            currentProduct.selectedColor = option.dataset.color;
            
            // 更新價格（如果不同顏色有不同價格）
            updatePrice();
            
            // 顯示通知
            showNotification(`已選擇顏色: ${currentProduct.selectedColor}`);
        });
    });
}

// 尺寸選擇功能
function initSizeOptions() {
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // 移除所有活動狀態
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            // 添加活動狀態
            option.classList.add('active');
            
            // 更新選中的尺寸
            currentProduct.selectedSize = option.dataset.size;
            
            // 更新價格（如果不同尺寸有不同價格）
            updatePrice();
            
            // 顯示通知
            showNotification(`已選擇尺寸: ${currentProduct.selectedSize}`);
        });
    });
}

// 數量控制功能
function initQuantityControls() {
    // 減少數量
    quantityMinusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            currentProduct.quantity = currentValue - 1;
            updatePrice();
        }
    });
    
    // 增加數量
    quantityPlusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) { // 限制最大數量
            quantityInput.value = currentValue + 1;
            currentProduct.quantity = currentValue + 1;
            updatePrice();
        }
    });
    
    // 直接輸入數量
    quantityInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        e.target.value = value;
        currentProduct.quantity = value;
        updatePrice();
    });
}

// 更新價格顯示
function updatePrice() {
    const priceElement = document.querySelector('.current-price');
    const totalPrice = currentProduct.basePrice * currentProduct.quantity;
    
    // 根據選項調整價格
    let priceAdjustment = 0;
    if (currentProduct.selectedSize === '三人座') {
        priceAdjustment = 8000;
    } else if (currentProduct.selectedSize === 'L型') {
        priceAdjustment = 15000;
    }
    
    const finalPrice = totalPrice + priceAdjustment;
    priceElement.textContent = `NT$ ${finalPrice.toLocaleString()}`;
}

// 加入購物車功能
function initAddToCart() {
    addToCartBtn.addEventListener('click', () => {
        const product = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.basePrice,
            color: currentProduct.selectedColor,
            size: currentProduct.selectedSize,
            quantity: currentProduct.quantity,
            image: mainImage.src
        };
        
        // 添加到購物車
        addToCart(product);
        
        // 按鈕動畫
        addToCartBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            addToCartBtn.style.transform = 'scale(1)';
        }, 150);
        
        // 更新按鈕文字
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> 已加入';
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
        }, 2000);
    });
}

// 立即購買功能
function initBuyNow() {
    buyNowBtn.addEventListener('click', () => {
        const product = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.basePrice,
            color: currentProduct.selectedColor,
            size: currentProduct.selectedSize,
            quantity: currentProduct.quantity,
            image: mainImage.src
        };
        
        // 添加到購物車
        addToCart(product);
        
        // 跳轉到結帳頁面
        window.location.href = 'checkout.html';
    });
}

// 收藏功能
function initWishlist() {
    wishlistBtn.addEventListener('click', () => {
        const isWishlisted = wishlistBtn.classList.contains('active');
        
        if (isWishlisted) {
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            showNotification('已從收藏中移除');
        } else {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification('已加入收藏');
        }
        
        // 更新本地存儲
        toggleWishlist(currentProduct.id);
    });
}

// 標籤頁切換功能
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // 移除所有活動狀態
            tabBtns.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加活動狀態
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            // 平滑滾動到標籤頁內容
            document.querySelector('.tabs-content').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// 圖片放大功能
function initImageZoom() {
    if (zoomBtn) {
        zoomBtn.addEventListener('click', () => {
            openImageModal(mainImage.src);
        });
    }
    
    // 主圖片點擊放大
    mainImage.addEventListener('click', () => {
        openImageModal(mainImage.src);
    });
}

// 打開圖片放大模態框
function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="${imageSrc}" alt="產品圖片">
                <div class="modal-controls">
                    <button class="modal-prev"><i class="fas fa-chevron-left"></i></button>
                    <button class="modal-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // 添加樣式
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 關閉模態框
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
    
    // 點擊背景關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

// 購物車功能（重用主頁面的函數）
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => 
        item.id === product.id && 
        item.color === product.color && 
        item.size === product.size
    );
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('商品已加入購物車！');
}

// 更新購物車數量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// 收藏功能
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// 顯示通知
function showNotification(message) {
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

// 產品評分動畫
function initRatingAnimation() {
    const ratingBars = document.querySelectorAll('.fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            }
        });
    });
    
    ratingBars.forEach(bar => observer.observe(bar));
}

// 相關產品功能
function initRelatedProducts() {
    const relatedProductBtns = document.querySelectorAll('.related-products .add-to-cart-btn');
    
    relatedProductBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productCard = btn.closest('.product-card');
            const product = {
                id: index + 10, // 避免與主產品ID衝突
                name: productCard.querySelector('.product-title').textContent,
                price: parseFloat(productCard.querySelector('.current-price').textContent.replace(/[^\d]/g, '')),
                quantity: 1,
                image: productCard.querySelector('img').src
            };
            
            addToCart(product);
            
            // 按鈕動畫
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// 鍵盤導航
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC 關閉模態框
        if (e.key === 'Escape') {
            const modal = document.querySelector('.image-modal');
            if (modal) {
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
            }
        }
        
        // 方向鍵切換圖片
        if (e.key === 'ArrowLeft') {
            const activeIndex = Array.from(thumbnails).findIndex(t => t.classList.contains('active'));
            if (activeIndex > 0) {
                thumbnails[activeIndex - 1].click();
            }
        }
        
        if (e.key === 'ArrowRight') {
            const activeIndex = Array.from(thumbnails).findIndex(t => t.classList.contains('active'));
            if (activeIndex < thumbnails.length - 1) {
                thumbnails[activeIndex + 1].click();
            }
        }
    });
}

// 初始化所有功能
function initProductDetail() {
    initImageGallery();
    initColorOptions();
    initSizeOptions();
    initQuantityControls();
    initAddToCart();
    initBuyNow();
    initWishlist();
    initTabs();
    initImageZoom();
    initRatingAnimation();
    initRelatedProducts();
    initKeyboardNavigation();
    updateCartCount();
    
    // 檢查收藏狀態
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlist.includes(currentProduct.id)) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', initProductDetail);

// 頁面卸載時清理
window.addEventListener('beforeunload', () => {
    // 清理任何定時器或事件監聽器
    document.body.style.overflow = 'auto';
}); 