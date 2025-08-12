package com.cyy.furniture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 產品屬性實體類 - 用於存儲產品的規格參數
 * 
 * @author CYY Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "product_attributes")
public class ProductAttribute extends BaseEntity {
    
    @NotBlank(message = "屬性名稱不能為空")
    @Size(max = 100, message = "屬性名稱長度不能超過100字符")
    @Column(name = "attribute_name", nullable = false)
    private String attributeName;
    
    @NotBlank(message = "屬性值不能為空")
    @Size(max = 500, message = "屬性值長度不能超過500字符")
    @Column(name = "attribute_value", nullable = false)
    private String attributeValue;
    
    @Size(max = 50, message = "屬性單位長度不能超過50字符")
    private String unit;
    
    @Column(name = "sort_order")
    private Integer sortOrder = 0;
    
    // 所屬產品
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
} 