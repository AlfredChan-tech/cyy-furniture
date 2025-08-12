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
import java.util.List;

/**
 * 產品實體類
 * 
 * @author CYY Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "products")
public class Product extends BaseEntity {
    
    @NotBlank(message = "產品名稱不能為空")
    @Size(max = 200, message = "產品名稱長度不能超過200字符")
    @Column(nullable = false)
    private String name;
    
    @Size(max = 1000, message = "產品描述長度不能超過1000字符")
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "價格必須大於0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @DecimalMin(value = "0.0", message = "原價格必須大於等於0")
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Min(value = 0, message = "庫存數量不能為負數")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;
    
    @Size(max = 100, message = "品牌長度不能超過100字符")
    private String brand;
    
    @Size(max = 100, message = "材質長度不能超過100字符")
    private String material;
    
    @Size(max = 100, message = "顏色長度不能超過100字符")
    private String color;
    
    @Size(max = 100, message = "尺寸長度不能超過100字符")
    private String size;
    
    @DecimalMin(value = "0.0", message = "重量必須大於等於0")
    @Column(precision = 8, scale = 2)
    private BigDecimal weight;
    
    @Size(max = 50, message = "SKU長度不能超過50字符")
    @Column(unique = true)
    private String sku;
    
    @Min(value = 0, message = "評分不能為負數")
    @Column(name = "rating_average", precision = 3, scale = 2)
    private BigDecimal ratingAverage = BigDecimal.ZERO;
    
    @Min(value = 0, message = "評價數量不能為負數")
    @Column(name = "rating_count")
    private Integer ratingCount = 0;
    
    @Min(value = 0, message = "銷售數量不能為負數")
    @Column(name = "sales_count")
    private Integer salesCount = 0;
    
    @Min(value = 0, message = "瀏覽次數不能為負數")
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    // 產品分類
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    // 產品圖片
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;
    
    // 產品規格/屬性
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductAttribute> attributes;
    
    /**
     * 產品狀態枚舉
     */
    public enum Status {
        ACTIVE("上架"),
        INACTIVE("下架"),
        OUT_OF_STOCK("缺貨"),
        DISCONTINUED("停產");
        
        private final String description;
        
        Status(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    /**
     * 檢查產品是否有庫存
     */
    public boolean hasStock() {
        return stockQuantity != null && stockQuantity > 0;
    }
    
    /**
     * 檢查產品是否可購買
     */
    public boolean isAvailable() {
        return isActive && status == Status.ACTIVE && hasStock();
    }
} 