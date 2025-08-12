package com.cyy.furniture.service;

import com.cyy.furniture.dto.CategoryDto;
import com.cyy.furniture.entity.Category;
import com.cyy.furniture.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 分類服務層
 * 
 * @author CYY Team
 */
@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * 獲取所有活躍分類
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllActiveCategories() {
        List<Category> categories = categoryRepository.findAllActiveCategories();
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 獲取根分類
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getRootCategories() {
        List<Category> categories = categoryRepository.findRootCategories();
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 根據ID獲取分類
     */
    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("分類不存在: " + id));
        return convertToDto(category);
    }

    /**
     * 獲取子分類
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getChildCategories(Long parentId) {
        List<Category> categories = categoryRepository.findByParentId(parentId);
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 轉換為DTO
     */
    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setIcon(category.getIcon());
        dto.setImage(category.getImage());
        dto.setSortOrder(category.getSortOrder());
        dto.setParentId(category.getParent() != null ? category.getParent().getId() : null);
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());
        return dto;
    }
}
