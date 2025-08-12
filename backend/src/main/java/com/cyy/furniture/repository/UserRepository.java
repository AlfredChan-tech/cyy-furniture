package com.cyy.furniture.repository;

import com.cyy.furniture.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用戶數據訪問層接口
 * 
 * @author CYY Team
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 根據用戶名查找用戶
     */
    Optional<User> findByUsername(String username);
    
    /**
     * 根據郵箱查找用戶
     */
    Optional<User> findByEmail(String email);
    
    /**
     * 根據用戶名或郵箱查找用戶
     */
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    /**
     * 檢查用戶名是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 檢查郵箱是否存在
     */
    boolean existsByEmail(String email);
    
    /**
     * 查找活躍用戶
     */
    @Query("SELECT u FROM User u WHERE u.accountEnabled = true AND u.deleted = false")
    Optional<User> findActiveUser(@Param("id") Long id);
} 