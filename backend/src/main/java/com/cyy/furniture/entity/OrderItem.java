package com.cyy.furniture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 訂單項目實體類 - 存儲訂單中的具體商品信息
 * 
 * @author CYY Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {
    
    @NotBlank(message = "商品名稱不能為空")
    @Size(max = 200, message = "商品名稱長度不能超過200字符")
    @Column(name = "product_name", nullable = false)
    private String productName;
    
    @Size(max = 50, message = "商品SKU長度不能超過50字符")
    @Column(name = "product_sku")
    private String productSku;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "商品單價必須大於0")
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Min(value = 1, message = "商品數量必須大於0")
    @Column(nullable = false)
    private Integer quantity;
    
    @DecimalMin(value = "0.0", message = "小計金額不能為負數")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Size(max = 500, message = "商品圖片URL長度不能超過500字符")
    @Column(name = "product_image")
    private String productImage;
    
    @Size(max = 200, message = "商品規格長度不能超過200字符")
    @Column(name = "product_specs")
    private String productSpecs;
    
    // 所屬訂單
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    // 對應的商品 (可能為空，因為商品可能被刪除)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    /**
     * 計算小計金額
     */
    public BigDecimal calculateSubtotal() {
        if (unitPrice != null && quantity != null) {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }
} 