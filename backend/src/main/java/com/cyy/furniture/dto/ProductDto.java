package com.cyy.furniture.dto;

import com.cyy.furniture.entity.Product;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 產品數據傳輸對象
 * 
 * @author CYY Team
 */
@Schema(description = "產品信息")
public class ProductDto {
    
    @Schema(description = "產品ID", example = "1")
    private Long id;
    
    @Schema(description = "產品名稱", example = "現代簡約沙發")
    private String name;
    
    @Schema(description = "產品描述")
    private String description;
    
    @Schema(description = "產品價格", example = "29999.00")
    private BigDecimal price;
    
    @Schema(description = "原價", example = "35999.00")
    private BigDecimal originalPrice;
    
    @Schema(description = "產品SKU", example = "SF001")
    private String sku;
    
    @Schema(description = "庫存數量", example = "100")
    private Integer stock;
    
    @Schema(description = "主圖片URL")
    private String mainImage;
    
    @Schema(description = "產品圖片列表")
    private List<String> images;
    
    @Schema(description = "評分", example = "4.5")
    private Double rating;
    
    @Schema(description = "評論數量", example = "128")
    private Integer reviewCount;
    
    @Schema(description = "瀏覽次數", example = "1500")
    private Integer viewCount;
    
    @Schema(description = "銷售數量", example = "85")
    private Integer salesCount;
    
    @Schema(description = "是否精選", example = "true")
    private Boolean isFeatured;
    
    @Schema(description = "是否新品", example = "false")
    private Boolean isNew;
    
    @Schema(description = "是否熱門", example = "true")
    private Boolean isHot;
    
    @Schema(description = "產品狀態")
    private Product.Status status;
    
    @Schema(description = "分類ID", example = "1")
    private Long categoryId;
    
    @Schema(description = "分類名稱", example = "客廳家具")
    private String categoryName;
    
    @Schema(description = "創建時間")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @Schema(description = "更新時間")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // 構造函數
    public ProductDto() {}

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getMainImage() {
        return mainImage;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getSalesCount() {
        return salesCount;
    }

    public void setSalesCount(Integer salesCount) {
        this.salesCount = salesCount;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public Boolean getIsNew() {
        return isNew;
    }

    public void setIsNew(Boolean isNew) {
        this.isNew = isNew;
    }

    public Boolean getIsHot() {
        return isHot;
    }

    public void setIsHot(Boolean isHot) {
        this.isHot = isHot;
    }

    public Product.Status getStatus() {
        return status;
    }

    public void setStatus(Product.Status status) {
        this.status = status;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
