package com.cyy.furniture.repository;

import com.cyy.furniture.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * 產品數據訪問層接口
 * 
 * @author CYY Team
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * 根據SKU查找產品
     */
    Optional<Product> findBySku(String sku);
    
    /**
     * 查找可用的產品
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false")
    Page<Product> findAvailableProducts(Pageable pageable);
    
    /**
     * 根據分類查找產品
     */
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    /**
     * 根據名稱模糊搜索產品
     */
    @Query("SELECT p FROM Product p WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    /**
     * 根據價格範圍查找產品
     */
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice AND p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);
    
    /**
     * 查找精選產品
     */
    @Query("SELECT p FROM Product p WHERE p.isFeatured = true AND p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false")
    Page<Product> findFeaturedProducts(Pageable pageable);
    
    /**
     * 查找熱銷產品
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false ORDER BY p.salesCount DESC")
    Page<Product> findTopSellingProducts(Pageable pageable);
    
    /**
     * 查找最新產品
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false ORDER BY p.createdAt DESC")
    Page<Product> findLatestProducts(Pageable pageable);
    
    /**
     * 根據品牌查找產品
     */
    @Query("SELECT p FROM Product p WHERE p.brand = :brand AND p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false")
    Page<Product> findByBrand(@Param("brand") String brand, Pageable pageable);
    
    /**
     * 查找相關產品（同分類）
     */
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.id != :excludeId AND p.isActive = true AND p.status = 'ACTIVE' AND p.deleted = false")
    List<Product> findRelatedProducts(@Param("categoryId") Long categoryId, @Param("excludeId") Long excludeId, Pageable pageable);
    
    /**
     * 更新產品瀏覽次數
     */
    @Query("UPDATE Product p SET p.viewCount = p.viewCount + 1 WHERE p.id = :productId")
    void incrementViewCount(@Param("productId") Long productId);
    
    /**
     * 檢查SKU是否存在
     */
    boolean existsBySku(String sku);
} 