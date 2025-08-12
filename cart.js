// 購物車頁面功能

// DOM元素 - 延遲獲取以確保DOM已加載
let cartItemsContainer, emptyCart, selectAllCheckbox, subtotalAmount, totalAmount;
let checkoutBtn, continueShoppingBtn, deleteModal, confirmDeleteBtn, cancelDeleteBtn;
let closeModalBtn, couponCodeInput, applyCouponBtn, useCouponBtns, addRecommendedBtns;
let batchDeleteBtn;

function initDOMElements() {
    cartItemsContainer = document.querySelector('.cart-items-container');
    emptyCart = document.querySelector('.empty-cart');
    selectAllCheckbox = document.getElementById('selectAll');
    subtotalAmount = document.querySelector('.subtotal-amount');
    totalAmount = document.querySelector('.total-amount');
    checkoutBtn = document.querySelector('.checkout-btn');
    continueShoppingBtn = document.querySelector('.continue-shopping');
    deleteModal = document.getElementById('deleteModal');
    confirmDeleteBtn = document.querySelector('.confirm-delete');
    cancelDeleteBtn = document.querySelector('.cancel-delete');
    closeModalBtn = document.querySelector('.close');
    couponCodeInput = document.querySelector('.coupon-code');
    applyCouponBtn = document.querySelector('.apply-coupon');
    useCouponBtns = document.querySelectorAll('.use-coupon');
    addRecommendedBtns = document.querySelectorAll('.add-recommended');
    batchDeleteBtn = document.querySelector('.batch-delete-btn');
    
    console.log('DOM元素初始化：');
    console.log('  購物車容器:', cartItemsContainer ? '找到' : '未找到');
    console.log('  空購物車:', emptyCart ? '找到' : '未找到');
    console.log('  全選框:', selectAllCheckbox ? '找到' : '未找到');
    console.log('  批量刪除按鈕:', batchDeleteBtn ? '找到' : '未找到');
}

// 購物車數據 - 使用window對象避免重複聲明
window.cartPageData = window.cartPageData || {};
let cart = [];
let selectedItems = [];
let itemToDelete = null;
let appliedCoupon = null;

// 優惠券數據
const availableCoupons = [
    {
        code: 'NEWUSER',
        name: '新用戶專享',
        description: '滿NT$ 30,000 折NT$ 3,000',
        minAmount: 30000,
        discount: 3000
    },
    {
        code: 'SPECIAL',
        name: '限時優惠',
        description: '滿NT$ 50,000 折NT$ 5,000',
        minAmount: 50000,
        discount: 5000
    }
];

// 初始化購物車
function initCart() {
    // 先初始化DOM元素
    initDOMElements();
    
    // 確保DOM元素存在
    if (!cartItemsContainer) {
        console.error('購物車容器未找到，無法初始化');
        return;
    }
    
    loadCartData();
    renderCart();
    updateSummary();
    initEventListeners();
    updateRecommendedProducts(); // 更新推薦商品
}

// 從本地存儲載入購物車數據
function loadCartData() {
    try {
        const cartData = localStorage.getItem('cart');
        cart = cartData ? JSON.parse(cartData) : [];
        
        // 確保所有商品都有ID
        cart.forEach((item, index) => {
            if (!item.id) {
                item.id = Date.now() + index;
            }
        });
        
        // 默認選中所有商品
        selectedItems = cart.map(item => item.id);
        
        console.log('購物車數據載入:', cart); 
        console.log('選中商品ID:', selectedItems);
    } catch (error) {
        console.error('載入購物車數據時出錯:', error);
        cart = [];
        selectedItems = [];
    }
}

// 渲染購物車
function renderCart() {
    if (cart.length === 0) {
        showEmptyCart();
        return;
    }
    hideEmptyCart();
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItem = createCartItemElement(item, index);
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    updateSelectAllCheckbox();
    updateSelectedItemsDisplay(); // 更新選中狀態顯示
    updateSummary(); // 確保摘要信息被更新
    
    // 移動端添加滑動刪除功能
    setTimeout(() => {
        addSwipeToDelete();
    }, 100);
}

// 創建購物車商品元素
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.index = index;
    
    const isSelected = selectedItems.includes(item.id);
    const itemSubtotal = item.price * item.quantity;
    
    // 確保圖片URL有效
    const imageUrl = item.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
    
    // 檢測是否為移動設備
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // 移動端佈局
        cartItem.innerHTML = `
            <div class="item-select">
                <input type="checkbox" class="item-checkbox" ${isSelected ? 'checked' : ''}>
            </div>
            <div class="item-actions">
                <button class="remove-item" data-index="${index}" title="刪除商品">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="item-info">
                <div class="item-image">
                    <img src="${imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    ${item.color ? `<div class="item-specs">顏色: ${item.color}</div>` : ''}
                    ${item.size ? `<div class="item-specs">尺寸: ${item.size}</div>` : ''}
                </div>
            </div>
            <div class="cart-item-mobile">
                <div class="item-price">NT$ ${item.price.toLocaleString()}</div>
                <div class="item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}" title="減少數量">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-index="${index}" title="輸入數量">
                        <button class="quantity-btn plus" data-index="${index}" title="增加數量">+</button>
                    </div>
                </div>
                <div class="item-subtotal">小計: NT$ ${itemSubtotal.toLocaleString()}</div>
            </div>
        `;
    } else {
        // 桌面端佈局
        cartItem.innerHTML = `
            <div class="item-select">
                <input type="checkbox" class="item-checkbox" ${isSelected ? 'checked' : ''}>
            </div>
            <div class="item-info">
                <div class="item-image">
                    <img src="${imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    ${item.color ? `<div class="item-specs">顏色: ${item.color}</div>` : ''}
                    ${item.size ? `<div class="item-specs">尺寸: ${item.size}</div>` : ''}
                </div>
            </div>
            <div class="item-price">NT$ ${item.price.toLocaleString()}</div>
            <div class="item-quantity">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-index="${index}" title="減少數量">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-index="${index}" title="輸入數量">
                    <button class="quantity-btn plus" data-index="${index}" title="增加數量">+</button>
                </div>
            </div>
            <div class="item-subtotal">NT$ ${itemSubtotal.toLocaleString()}</div>
            <div class="item-actions">
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }
    
    return cartItem;
}

// 顯示空購物車
function showEmptyCart() {
    console.log('顯示空購物車狀態');
    if (cartItemsContainer) {
        cartItemsContainer.style.display = 'none';
        cartItemsContainer.innerHTML = '';
    }
    if (emptyCart) {
        emptyCart.style.display = 'block';
    }
    const cartTableHeader = document.querySelector('.cart-table-header');
    if (cartTableHeader) {
        cartTableHeader.style.display = 'none';
    }
}

// 隱藏空購物車
function hideEmptyCart() {
    console.log('隱藏空購物車狀態，準備顯示商品');
    if (cartItemsContainer) {
        cartItemsContainer.style.display = 'block';
        cartItemsContainer.style.visibility = 'visible';
    }
    if (emptyCart) {
        emptyCart.style.display = 'none';
    }
    const cartTableHeader = document.querySelector('.cart-table-header');
    if (cartTableHeader) {
        cartTableHeader.style.display = 'grid';
    }
}

// 初始化事件監聽器
function initEventListeners() {
    // 全選/取消全選
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAll);
    }
    
    // 商品選擇和操作（只有當容器存在時才添加）
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('change', handleItemSelect);
        cartItemsContainer.addEventListener('click', handleQuantityChange);
        cartItemsContainer.addEventListener('input', handleQuantityInput);
        cartItemsContainer.addEventListener('click', handleDeleteItem);
    }
    
    // 結帳按鈕
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // 繼續購物按鈕
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // 刪除確認模態框
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDeleteModal);
    }
    
    // 優惠券功能
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    if (couponCodeInput) {
        couponCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyCoupon();
            }
        });
    }
    
    // 使用優惠券按鈕
    useCouponBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const couponCode = e.target.closest('.coupon-item').querySelector('.coupon-title').textContent;
            const coupon = availableCoupons.find(c => c.name === couponCode);
            if (coupon) {
                applyCouponByCode(coupon.code);
            }
        });
    });
    
    // 推薦商品
    addRecommendedBtns.forEach(btn => {
        btn.addEventListener('click', handleAddRecommended);
    });
    
    // 批量刪除按鈕
    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', batchDeleteSelectedItems);
    }
    
    // 點擊模態框外部關閉
    window.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// 處理全選/取消全選
function handleSelectAll(e) {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll('.item-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    
    if (isChecked) {
        selectedItems = cart.map(item => item.id);
    } else {
        selectedItems = [];
    }
    
    updateSelectAllCheckbox();
    updateSummary();
    
    // 添加視覺反饋
    if (isChecked) {
        showNotification('已選擇所有商品');
    } else {
        showNotification('已取消選擇所有商品');
    }
}

// 處理商品選擇
function handleItemSelect(e) {
    if (e.target.classList.contains('item-checkbox')) {
        const cartItem = e.target.closest('.cart-item');
        const index = parseInt(cartItem.dataset.index);
        const itemId = cart[index].id;
        const itemName = cart[index].name;
        
        if (e.target.checked) {
            if (!selectedItems.includes(itemId)) {
                selectedItems.push(itemId);
                // 視覺反饋 - 選中效果
                cartItem.style.backgroundColor = '#f8f9fa';
                cartItem.style.borderLeft = '4px solid #8b7355';
                showNotification(`已選擇 ${itemName}`);
            }
        } else {
            selectedItems = selectedItems.filter(id => id !== itemId);
            // 移除選中效果
            cartItem.style.backgroundColor = '';
            cartItem.style.borderLeft = '';
            showNotification(`已取消選擇 ${itemName}`);
        }
        
        updateSelectAllCheckbox();
        updateSummary();
        
        // 更新選中項目的顯示狀態
        updateSelectedItemsDisplay();
    }
}

// 更新選中項目的顯示狀態
function updateSelectedItemsDisplay() {
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach((item, index) => {
        const itemId = cart[index].id;
        const isSelected = selectedItems.includes(itemId);
        
        if (isSelected) {
            item.style.backgroundColor = '#f8f9fa';
            item.style.borderLeft = '4px solid #8b7355';
        } else {
            item.style.backgroundColor = '';
            item.style.borderLeft = '';
        }
    });
    
    // 更新批量刪除按鈕顯示狀態
    updateBatchDeleteButton();
}

// 更新批量刪除按鈕狀態
function updateBatchDeleteButton() {
    if (batchDeleteBtn) {
        if (selectedItems.length > 0) {
            batchDeleteBtn.style.display = 'inline-block';
            batchDeleteBtn.textContent = `刪除選中 (${selectedItems.length})`;
        } else {
            batchDeleteBtn.style.display = 'none';
        }
    }
}

// 批量刪除選中商品
function batchDeleteSelectedItems() {
    if (selectedItems.length === 0) {
        showNotification('請先選擇要刪除的商品');
        return;
    }
    
    const selectedCount = selectedItems.length;
    const selectedNames = cart
        .filter(item => selectedItems.includes(item.id))
        .map(item => item.name)
        .slice(0, 3); // 只顯示前3個商品名稱
    
    let confirmMessage = `確定要刪除這 ${selectedCount} 件商品嗎？\n\n`;
    confirmMessage += selectedNames.join('\n');
    if (selectedCount > 3) {
        confirmMessage += `\n...等 ${selectedCount} 件商品`;
    }
    
    if (confirm(confirmMessage)) {
        // 過濾掉選中的商品
        cart = cart.filter(item => !selectedItems.includes(item.id));
        
        // 清空選中項目
        selectedItems = [];
        
        // 保存到本地存儲
        saveCart();
        
        // 重新渲染購物車
        renderCart();
        updateSummary();
        updateNavCartCount();
        
        // 顯示通知
        showNotification(`已刪除 ${selectedCount} 件商品`);
    }
}

// 更新全選復選框狀態
function updateSelectAllCheckbox() {
    if (selectAllCheckbox) {
        const totalItems = cart.length;
        const selectedCount = selectedItems.length;
        
        selectAllCheckbox.checked = selectedCount === totalItems && totalItems > 0;
        selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < totalItems;
    }
}

// 處理數量變化
function handleQuantityChange(e) {
    const index = parseInt(e.target.dataset.index);
    if (isNaN(index)) return;
    
    if (e.target.classList.contains('minus')) {
        changeQuantity(index, -1);
    } else if (e.target.classList.contains('plus')) {
        changeQuantity(index, 1);
    }
}

// 處理數量輸入
function handleQuantityInput(e) {
    if (e.target.classList.contains('quantity-input')) {
        const index = parseInt(e.target.dataset.index);
        const newQuantity = parseInt(e.target.value) || 1; // 如果輸入無效，默認為1
        const oldQuantity = cart[index].quantity;
        const item = cart[index];
        
        if (newQuantity >= 1 && newQuantity <= 99) {
            cart[index].quantity = newQuantity;
            saveCart();
            updateCartItemSubtotal(index);
            updateSummary();
            updateNavCartCount();
            
            // 顯示變化通知
            if (newQuantity !== oldQuantity) {
                showNotification(`${item.name} 數量已更改為 ${newQuantity} 件`);
            }
            
            // 輸入框動畫
            e.target.style.backgroundColor = '#e8f5e8';
            setTimeout(() => {
                e.target.style.backgroundColor = '';
            }, 500);
            
        } else if (newQuantity < 1) {
            // 提示是否刪除
            if (confirm(`確定要從購物車中移除 ${item.name} 嗎？`)) {
                removeCartItem(index);
            } else {
                e.target.value = oldQuantity;
            }
        } else {
            // 數量超出限制
            e.target.value = oldQuantity;
            showNotification('數量不能超過99件');
            
            // 錯誤提示動畫
            e.target.style.backgroundColor = '#ffe8e8';
            setTimeout(() => {
                e.target.style.backgroundColor = '';
            }, 500);
        }
    }
}

// 改變商品數量
function changeQuantity(index, change) {
    const oldQuantity = cart[index].quantity;
    const newQuantity = cart[index].quantity + change;
    
    if (newQuantity >= 1 && newQuantity <= 99) { // 增加上限到99
        cart[index].quantity = newQuantity;
        saveCart();
        
        // 更新輸入框和小計
        const quantityInput = document.querySelector(`input[data-index="${index}"]`);
        if (quantityInput) {
            quantityInput.value = newQuantity;
            
            // 添加動畫效果
            quantityInput.style.transform = 'scale(1.1)';
            setTimeout(() => {
                quantityInput.style.transform = 'scale(1)';
            }, 200);
        }
        
        updateCartItemSubtotal(index);
        updateSummary();
        updateNavCartCount();
        
        // 顯示數量變化通知
        const item = cart[index];
        if (change > 0) {
            showNotification(`${item.name} 數量增加到 ${newQuantity}`);
        } else {
            showNotification(`${item.name} 數量減少到 ${newQuantity}`);
        }
    } else if (newQuantity < 1) {
        // 如果數量要減到0以下，提示是否刪除商品
        const item = cart[index];
        if (confirm(`確定要從購物車中移除 ${item.name} 嗎？`)) {
            removeCartItem(index);
        }
    } else {
        showNotification('數量不能超過99件');
    }
}

// 更新商品小計
function updateCartItemSubtotal(index) {
    const item = cart[index];
    const subtotal = item.price * item.quantity;
    const subtotalElement = document.querySelector(`.cart-item[data-index="${index}"] .item-subtotal`);
    
    if (subtotalElement) {
        subtotalElement.textContent = `NT$ ${subtotal.toLocaleString()}`;
        
        // 添加價格更新動畫
        subtotalElement.style.color = '#28a745';
        subtotalElement.style.fontWeight = 'bold';
        setTimeout(() => {
            subtotalElement.style.color = '';
            subtotalElement.style.fontWeight = '';
        }, 800);
    }
}

// 移除購物車商品
function removeCartItem(index) {
    const item = cart[index];
    const itemId = item.id;
    
    // 從購物車中移除商品
    cart.splice(index, 1);
    
    // 從選中項目中移除
    selectedItems = selectedItems.filter(id => id !== itemId);
    
    // 保存到本地存儲
    saveCart();
    
    // 重新渲染購物車
    renderCart();
    updateSummary();
    updateNavCartCount();
    
    // 顯示通知
    showNotification(`${item.name} 已從購物車中移除`);
}

// 處理刪除商品
function handleDeleteItem(e) {
    if (e.target.closest('.remove-item')) {
        const index = parseInt(e.target.closest('.remove-item').dataset.index);
        itemToDelete = index;
        openDeleteModal();
    }
}

// 打開刪除確認模態框
function openDeleteModal() {
    deleteModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 關閉刪除確認模態框
function closeDeleteModal() {
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    itemToDelete = null;
}

// 確認刪除商品
function confirmDelete() {
    if (itemToDelete !== null) {
        const item = cart[itemToDelete];
        const itemId = item.id;
        
        // 從購物車中移除商品
        cart.splice(itemToDelete, 1);
        
        // 從選中項目中移除
        selectedItems = selectedItems.filter(id => id !== itemId);
        
        // 保存到本地存儲
        saveCart();
        
        // 重新渲染購物車
        renderCart();
        updateSummary();
        
        // 更新導航欄購物車數量
        updateNavCartCount();
        
        // 顯示通知
        showNotification(`${item.name} 已從購物車中移除`);
        
        // 關閉模態框
        closeDeleteModal();
    }
}

// 保存購物車到本地存儲
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 更新摘要信息
function updateSummary() {
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
    const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // 計算購物車摘要信息
    
    // 計算運費（免運費條件：滿30000元或購物車為空）
    const freeShippingThreshold = 30000;
    const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 200;
    
    let discount = 0;
    if (appliedCoupon) {
        if (subtotal >= appliedCoupon.minAmount) {
            discount = appliedCoupon.discount;
        } else {
            // 如果不滿足優惠券條件，移除優惠券
            appliedCoupon = null;
            showNotification('不符合優惠券使用條件，已自動移除');
            updateCouponDisplay();
        }
    }
    
    const total = subtotal + shippingFee - discount;
    
    // 更新商品總價顯示
    if (subtotalAmount) {
        subtotalAmount.textContent = `NT$ ${subtotal.toLocaleString()}`;
        
        // 如果有變化，添加動畫效果
        if (subtotalAmount.dataset.lastValue !== subtotal.toString()) {
            subtotalAmount.style.color = '#28a745';
            setTimeout(() => {
                subtotalAmount.style.color = '';
            }, 1000);
            subtotalAmount.dataset.lastValue = subtotal.toString();
        }
    }
    
    // 更新運費顯示
    const shippingElement = document.querySelector('.shipping-fee');
    if (shippingElement) {
        if (shippingFee === 0) {
            shippingElement.textContent = '免運費';
            shippingElement.style.color = '#28a745';
        } else {
            shippingElement.textContent = `NT$ ${shippingFee.toLocaleString()}`;
            shippingElement.style.color = '';
        }
        
        // 顯示免運費進度
        if (subtotal > 0 && subtotal < freeShippingThreshold) {
            const remaining = freeShippingThreshold - subtotal;
            const progressElement = document.querySelector('.shipping-progress');
            if (!progressElement) {
                // 創建免運費進度提示
                const progressDiv = document.createElement('div');
                progressDiv.className = 'shipping-progress';
                progressDiv.style.cssText = `
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                    padding: 8px;
                    background: #f0f8ff;
                    border-radius: 4px;
                    border-left: 3px solid #007bff;
                `;
                progressDiv.textContent = `再購買 NT$ ${remaining.toLocaleString()} 即可享免運費`;
                shippingElement.parentNode.appendChild(progressDiv);
            } else {
                progressElement.textContent = `再購買 NT$ ${remaining.toLocaleString()} 即可享免運費`;
            }
        } else {
            // 移除免運費進度提示
            const progressElement = document.querySelector('.shipping-progress');
            if (progressElement) {
                progressElement.remove();
            }
        }
    }
    
    // 更新折扣顯示
    const discountElement = document.querySelector('.discount-amount');
    if (discountElement) {
        if (discount > 0) {
            discountElement.textContent = `-NT$ ${discount.toLocaleString()}`;
            discountElement.style.color = '#dc3545';
        } else {
            discountElement.textContent = 'NT$ 0';
            discountElement.style.color = '';
        }
    }
    
    // 更新總計顯示
    if (totalAmount) {
        totalAmount.textContent = `NT$ ${total.toLocaleString()}`;
        
        // 如果有變化，添加動畫效果
        if (totalAmount.dataset.lastValue !== total.toString()) {
            totalAmount.style.color = '#8b7355';
            totalAmount.style.fontWeight = 'bold';
            setTimeout(() => {
                totalAmount.style.color = '';
                totalAmount.style.fontWeight = '';
            }, 1000);
            totalAmount.dataset.lastValue = total.toString();
        }
    }
    
    // 更新結帳按鈕狀態
    if (checkoutBtn) {
        checkoutBtn.disabled = selectedCartItems.length === 0 || total <= 0;
        if (selectedCartItems.length === 0) {
            checkoutBtn.textContent = '請選擇商品';
            checkoutBtn.style.backgroundColor = '#ccc';
        } else {
            checkoutBtn.textContent = `結帳 (${totalItems}件商品)`;
            checkoutBtn.style.backgroundColor = '';
        }
    }
    
    // 更新統計信息顯示
    updateCartStatistics(selectedCartItems.length, totalItems, subtotal, total);
}

// 更新購物車統計信息
function updateCartStatistics(selectedCount, totalQuantity, subtotal, total) {
    // 在購物車標題旁顯示統計信息
    const cartHeader = document.querySelector('.cart-header h1');
    if (cartHeader) {
        const statsText = cart.length > 0 ? 
            `（共 ${cart.length} 種商品，已選 ${selectedCount} 種，${totalQuantity} 件）` : '';
        
        // 更新或創建統計信息元素
        let statsElement = document.querySelector('.cart-stats');
        if (!statsElement) {
            statsElement = document.createElement('span');
            statsElement.className = 'cart-stats';
            statsElement.style.cssText = `
                font-size: 14px;
                color: #666;
                font-weight: normal;
                margin-left: 10px;
            `;
            cartHeader.appendChild(statsElement);
        }
        statsElement.textContent = statsText;
    }
}

// 應用優惠券
function applyCoupon() {
    const couponCode = couponCodeInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('請輸入優惠券代碼');
        couponCodeInput.focus();
        return;
    }
    
    applyCouponByCode(couponCode);
}

// 根據優惠券代碼應用優惠券
function applyCouponByCode(couponCode) {
    const coupon = availableCoupons.find(c => c.code === couponCode);
    
    if (!coupon) {
        showNotification('無效的優惠券代碼');
        // 輸入框錯誤效果
        couponCodeInput.style.borderColor = '#dc3545';
        couponCodeInput.style.backgroundColor = '#ffe8e8';
        setTimeout(() => {
            couponCodeInput.style.borderColor = '';
            couponCodeInput.style.backgroundColor = '';
        }, 2000);
        return;
    }
    
    // 檢查是否已經使用過相同優惠券
    if (appliedCoupon && appliedCoupon.code === couponCode) {
        showNotification('此優惠券已經在使用中');
        return;
    }
    
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
    const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotal < coupon.minAmount) {
        showNotification(`購物滿NT$ ${coupon.minAmount.toLocaleString()}才能使用此優惠券，目前金額：NT$ ${subtotal.toLocaleString()}`);
        return;
    }
    
    appliedCoupon = coupon;
    couponCodeInput.value = '';
    
    // 成功效果
    couponCodeInput.style.borderColor = '#28a745';
    couponCodeInput.style.backgroundColor = '#e8f5e8';
    setTimeout(() => {
        couponCodeInput.style.borderColor = '';
        couponCodeInput.style.backgroundColor = '';
    }, 2000);
    
    updateSummary();
    updateCouponDisplay();
    showNotification(`✅ 優惠券 "${coupon.name}" 已應用，節省NT$ ${coupon.discount.toLocaleString()}`);
}

// 更新優惠券顯示狀態
function updateCouponDisplay() {
    // 更新可用優惠券的狀態
    const couponItems = document.querySelectorAll('.coupon-item');
    couponItems.forEach(item => {
        const couponTitle = item.querySelector('.coupon-title').textContent;
        const coupon = availableCoupons.find(c => c.name === couponTitle);
        const useBtn = item.querySelector('.use-coupon');
        
        if (coupon && appliedCoupon && appliedCoupon.code === coupon.code) {
            // 已使用狀態
            useBtn.textContent = '已使用';
            useBtn.disabled = true;
            useBtn.style.backgroundColor = '#6c757d';
            item.style.backgroundColor = '#f8f9fa';
            item.style.opacity = '0.7';
        } else {
            // 可用狀態
            useBtn.textContent = '使用';
            useBtn.disabled = false;
            useBtn.style.backgroundColor = '';
            item.style.backgroundColor = '';
            item.style.opacity = '';
        }
    });
    
    // 顯示已應用的優惠券信息
    updateAppliedCouponDisplay();
}

// 更新已應用優惠券的顯示
function updateAppliedCouponDisplay() {
    const summaryContainer = document.querySelector('.cart-summary');
    let appliedCouponElement = summaryContainer.querySelector('.applied-coupon-info');
    
    if (appliedCoupon) {
        if (!appliedCouponElement) {
            appliedCouponElement = document.createElement('div');
            appliedCouponElement.className = 'applied-coupon-info';
            appliedCouponElement.style.cssText = `
                background: #e8f5e8;
                border: 1px solid #28a745;
                border-radius: 4px;
                padding: 10px;
                margin: 10px 0;
                font-size: 14px;
            `;
            
            // 插入到折扣行之前
            const discountRow = summaryContainer.querySelector('.discount-row');
            summaryContainer.insertBefore(appliedCouponElement, discountRow);
        }
        
        appliedCouponElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>🎫 ${appliedCoupon.name}</strong><br>
                    <small>${appliedCoupon.description}</small>
                </div>
                <button class="remove-coupon-btn" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                " title="移除優惠券">✕</button>
            </div>
        `;
        
        // 添加移除優惠券事件
        const removeCouponBtn = appliedCouponElement.querySelector('.remove-coupon-btn');
        removeCouponBtn.addEventListener('click', removeCoupon);
        
    } else if (appliedCouponElement) {
        appliedCouponElement.remove();
    }
}

// 移除優惠券
function removeCoupon() {
    if (appliedCoupon) {
        const couponName = appliedCoupon.name;
        appliedCoupon = null;
        updateSummary();
        updateCouponDisplay();
        showNotification(`已移除優惠券 "${couponName}"`);
    }
}

// 處理結帳
function handleCheckout() {
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
    
    // 驗證選中商品
    if (selectedCartItems.length === 0) {
        showNotification('❌ 請選擇要結帳的商品');
        // 高亮顯示全選框
        if (selectAllCheckbox) {
            selectAllCheckbox.style.boxShadow = '0 0 10px #dc3545';
            setTimeout(() => {
                selectAllCheckbox.style.boxShadow = '';
            }, 2000);
        }
        return;
    }
    
    // 計算結帳詳情
    const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
    const shippingFee = subtotal >= 30000 ? 0 : 200;
    const discount = appliedCoupon && subtotal >= appliedCoupon.minAmount ? appliedCoupon.discount : 0;
    const finalTotal = subtotal + shippingFee - discount;
    
    // 驗證最小購買金額
    const minOrderAmount = 100;
    if (finalTotal < minOrderAmount) {
        showNotification(`❌ 最低消費金額為 NT$ ${minOrderAmount.toLocaleString()}`);
        return;
    }
    
    // 準備結帳數據
    const checkoutData = {
        items: selectedCartItems,
        summary: {
            subtotal: subtotal,
            shippingFee: shippingFee,
            discount: discount,
            total: finalTotal,
            totalQuantity: totalQuantity,
            itemCount: selectedCartItems.length
        },
        coupon: appliedCoupon,
        timestamp: new Date().toISOString()
    };
    
    // 顯示結帳確認
    if (confirmCheckout(checkoutData)) {
        // 保存結帳數據到 sessionStorage
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        
        // 結帳動畫和跳轉
        performCheckoutTransition();
    }
}

// 結帳確認對話框
function confirmCheckout(checkoutData) {
    const { summary, items } = checkoutData;
    
    let confirmMessage = `🛒 確認結帳信息：\n\n`;
    confirmMessage += `📦 商品：${summary.itemCount} 種，共 ${summary.totalQuantity} 件\n`;
    confirmMessage += `💰 商品總價：NT$ ${summary.subtotal.toLocaleString()}\n`;
    confirmMessage += `🚚 運費：${summary.shippingFee === 0 ? '免運費' : 'NT$ ' + summary.shippingFee.toLocaleString()}\n`;
    
    if (summary.discount > 0) {
        confirmMessage += `🎫 優惠折扣：-NT$ ${summary.discount.toLocaleString()}\n`;
    }
    
    confirmMessage += `\n💳 應付總額：NT$ ${summary.total.toLocaleString()}\n\n`;
    confirmMessage += `確定要繼續結帳嗎？`;
    
    return confirm(confirmMessage);
}

// 執行結帳轉場動畫
function performCheckoutTransition() {
    // 禁用結帳按鈕防止重複點擊
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = '處理中...';
        checkoutBtn.style.backgroundColor = '#ccc';
    }
    
    // 顯示處理中通知
    showNotification('✅ 正在跳轉到結帳頁面...');
    
    // 頁面淡出效果
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0.7';
    
    // 延遲跳轉以顯示動畫
    setTimeout(() => {
        // 如果結帳頁面不存在，創建模擬的結帳成功頁面
        if (!checkIfPageExists('checkout.html')) {
            createCheckoutSuccessPage();
        } else {
            window.location.href = 'checkout.html';
        }
    }, 1000);
}

// 檢查頁面是否存在（簡單實現）
function checkIfPageExists(url) {
    // 這裡可以實現更複雜的檢查邏輯
    // 暫時返回false，使用模擬頁面
    return false;
}

// 創建結帳成功模擬頁面
function createCheckoutSuccessPage() {
    const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData'));
    
    // 創建結帳成功頁面內容
    document.body.innerHTML = `
        <div style="
            max-width: 600px; 
            margin: 50px auto; 
            padding: 40px; 
            text-align: center;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            font-family: 'Inter', sans-serif;
        ">
            <div style="font-size: 64px; color: #28a745; margin-bottom: 20px;">✅</div>
            <h1 style="color: #333; margin-bottom: 10px;">訂單提交成功！</h1>
            <p style="color: #666; margin-bottom: 30px;">感謝您的購買，我們會盡快為您處理訂單</p>
            
            <div style="
                background: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px; 
                margin-bottom: 30px;
                text-align: left;
            ">
                <h3 style="margin-top: 0; color: #333;">訂單詳情</h3>
                <p><strong>訂單編號：</strong> CYY${Date.now()}</p>
                <p><strong>商品數量：</strong> ${checkoutData.summary.itemCount} 種，共 ${checkoutData.summary.totalQuantity} 件</p>
                <p><strong>訂單金額：</strong> NT$ ${checkoutData.summary.total.toLocaleString()}</p>
                <p><strong>預計送達：</strong> 3-5 個工作天</p>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="backToCart()" style="
                    padding: 12px 24px;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                ">返回購物車</button>
                <button onclick="goToHomepage()" style="
                    padding: 12px 24px;
                    background: #8b7355;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                ">繼續購物</button>
            </div>
        </div>
    `;
    
    // 清除已結帳的商品
    const purchasedItemIds = checkoutData.items.map(item => item.id);
    cart = cart.filter(item => !purchasedItemIds.includes(item.id));
    selectedItems = selectedItems.filter(id => !purchasedItemIds.includes(id));
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 清除優惠券
    appliedCoupon = null;
}

// 返回購物車
function backToCart() {
    window.location.href = 'cart.html';
}

// 回到首頁
function goToHomepage() {
    window.location.href = 'index.html';
}

// 處理添加推薦商品
function handleAddRecommended(e) {
    const recommendedItem = e.target.closest('.recommended-item');
    const name = recommendedItem.querySelector('h5').textContent;
    const priceText = recommendedItem.querySelector('.item-price').textContent;
    const price = parseInt(priceText.replace(/[^\d]/g, ''));
    const image = recommendedItem.querySelector('img').src;
    
    // 檢查商品是否已在購物車中
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        // 如果商品已存在，增加數量
        existingItem.quantity += 1;
        
        // 確保商品被選中
        if (!selectedItems.includes(existingItem.id)) {
            selectedItems.push(existingItem.id);
        }
        
        showNotification(`${name} 數量已增加到 ${existingItem.quantity} 件`);
    } else {
        // 添加新商品
        const product = {
            id: Date.now(), // 使用時間戳作為ID
            name: name,
            price: price,
            quantity: 1,
            image: image
        };
        
        // 添加到購物車
        cart.push(product);
        selectedItems.push(product.id);
        
        showNotification(`${name} 已加入購物車`);
    }
    
    // 保存到本地存儲
    saveCart();
    
    // 重新渲染購物車
    renderCart();
    updateSummary();
    updateNavCartCount();
    
    // 按鈕動畫和狀態變化
    const button = e.target;
    const originalText = button.textContent;
    const originalColor = button.style.backgroundColor;
    
    // 成功動畫
    button.style.transform = 'scale(0.95)';
    button.style.backgroundColor = '#28a745';
    button.textContent = '已加入';
    button.disabled = true;
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    // 2秒後恢復原狀
    setTimeout(() => {
        button.style.backgroundColor = originalColor;
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// 擴展推薦商品列表
function updateRecommendedProducts() {
    const recommendedContainer = document.querySelector('.recommended-products');
    if (!recommendedContainer) return;
    
    // 推薦商品數據（基於當前購物車內容智能推薦）
    const allRecommendations = [
        {
            name: '實木茶几',
            price: 12800,
            image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
            tags: ['客廳', '實木', '茶几']
        },
        {
            name: '現代地毯',
            price: 6800,
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
            tags: ['客廳', '地毯', '現代']
        },
        {
            name: '北歐檯燈',
            price: 3200,
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
            tags: ['照明', '北歐', '檯燈']
        },
        {
            name: '簡約書桌',
            price: 8900,
            image: 'https://images.unsplash.com/photo-1493147718276-59ec19746d28?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
            tags: ['辦公', '書桌', '簡約']
        }
    ];
    
    // 根據購物車內容選擇推薦商品（簡單邏輯：隨機選擇2個不在購物車中的商品）
    const cartProductNames = cart.map(item => item.name);
    const availableRecommendations = allRecommendations.filter(
        rec => !cartProductNames.includes(rec.name)
    );
    
    // 隨機選擇2個推薦商品
    const selectedRecommendations = availableRecommendations
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    
    // 更新推薦商品HTML
    recommendedContainer.innerHTML = selectedRecommendations.map(item => `
        <div class="recommended-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h5>${item.name}</h5>
                <div class="item-price">NT$ ${item.price.toLocaleString()}</div>
                <div class="item-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <button class="add-recommended">加入購物車</button>
        </div>
    `).join('');
    
    // 重新綁定事件
    const newAddRecommendedBtns = recommendedContainer.querySelectorAll('.add-recommended');
    newAddRecommendedBtns.forEach(btn => {
        btn.addEventListener('click', handleAddRecommended);
    });
}

// 更新導航欄購物車數量
function updateNavCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
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

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    // 等待一小段時間確保DOM完全加載
    setTimeout(() => {
        // 確保DOM元素存在才初始化
        if (document.querySelector('.cart-items-container')) {
            console.log('購物車頁面DOM載入完成，開始初始化');
            initCart();
            updateNavCartCount();
        } else {
            console.log('非購物車頁面，跳過購物車初始化');
        }
    }, 100);
});

// 監聽存儲變化（如果其他頁面修改了購物車）
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        loadCartData();
        renderCart();
        updateSummary();
        updateNavCartCount();
    }
});

// 監聽窗口大小變化，響應式重新渲染
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // 檢查是否從桌面端切換到移動端或反之
        const currentlyMobile = window.innerWidth <= 768;
        const wasRenderedForMobile = document.querySelector('.cart-item-mobile') !== null;
        
        if (currentlyMobile !== wasRenderedForMobile) {
            console.log('響應式佈局切換，重新渲染購物車');
            renderCart();
            updateSummary();
        }
    }, 250);
});

// 頁面卸載前保存狀態
window.addEventListener('beforeunload', () => {
    saveCart();
});

// 添加觸摸友好的滑動刪除功能（移動端）
function addSwipeToDelete() {
    if (window.innerWidth <= 768) {
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach((item, index) => {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            item.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            item.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                currentX = e.touches[0].clientX;
                const diffX = startX - currentX;
                
                if (diffX > 0) {
                    item.style.transform = `translateX(-${Math.min(diffX, 100)}px)`;
                    item.style.backgroundColor = diffX > 50 ? '#ffebee' : '';
                }
            });
            
            item.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const diffX = startX - currentX;
                
                if (diffX > 80) {
                    // 觸發刪除
                    const itemIndex = parseInt(item.dataset.index);
                    if (confirm('確定要刪除這個商品嗎？')) {
                        removeCartItem(itemIndex);
                    }
                }
                
                // 重置位置
                item.style.transform = '';
                item.style.backgroundColor = '';
                isDragging = false;
            });
        });
    }
} 