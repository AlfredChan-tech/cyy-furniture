package com.cyy.furniture.repository;

import com.cyy.furniture.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 分類數據訪問層接口
 * 
 * @author CYY Team
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * 查找所有活躍的分類
     */
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND c.deleted = false ORDER BY c.sortOrder ASC")
    List<Category> findAllActiveCategories();
    
    /**
     * 查找所有根分類（無父分類）
     */
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL AND c.isActive = true AND c.deleted = false ORDER BY c.sortOrder ASC")
    List<Category> findRootCategories();
    
    /**
     * 根據父分類查找子分類
     */
    @Query("SELECT c FROM Category c WHERE c.parent.id = :parentId AND c.isActive = true AND c.deleted = false ORDER BY c.sortOrder ASC")
    List<Category> findByParentId(Long parentId);
} 