package com.cyy.furniture.repository;

import com.cyy.furniture.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 購物車項目數據訪問層接口
 * 
 * @author CYY Team
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    /**
     * 根據用戶ID查找購物車項目
     */
    @Query("SELECT c FROM CartItem c WHERE c.user.id = :userId AND c.deleted = false")
    List<CartItem> findByUserId(@Param("userId") Long userId);
    
    /**
     * 根據用戶ID和產品ID查找購物車項目
     */
    @Query("SELECT c FROM CartItem c WHERE c.user.id = :userId AND c.product.id = :productId AND c.deleted = false")
    Optional<CartItem> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);
    
    /**
     * 清空用戶購物車
     */
    @Query("DELETE FROM CartItem c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
} 