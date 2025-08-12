package com.cyy.furniture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 產品圖片實體類
 * 
 * @author CYY Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "product_images")
public class ProductImage extends BaseEntity {
    
    @NotBlank(message = "圖片URL不能為空")
    @Size(max = 500, message = "圖片URL長度不能超過500字符")
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
    
    @Size(max = 200, message = "圖片描述長度不能超過200字符")
    @Column(name = "alt_text")
    private String altText;
    
    @Column(name = "sort_order")
    private Integer sortOrder = 0;
    
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;
    
    // 所屬產品
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
} 