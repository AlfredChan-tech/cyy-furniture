package com.cyy.furniture.repository;

import com.cyy.furniture.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 訂單數據訪問層接口
 * 
 * @author CYY Team
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * 根據訂單號查找訂單
     */
    Optional<Order> findByOrderNumber(String orderNumber);
    
    /**
     * 根據用戶ID查找訂單
     */
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.deleted = false ORDER BY o.createdAt DESC")
    Page<Order> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    /**
     * 根據用戶ID和訂單狀態查找訂單
     */
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status AND o.deleted = false ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Order.Status status, Pageable pageable);
    
    /**
     * 檢查訂單號是否存在
     */
    boolean existsByOrderNumber(String orderNumber);
} 