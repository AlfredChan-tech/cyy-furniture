package com.cyy.furniture.controller;

import com.cyy.furniture.dto.CategoryDto;
import com.cyy.furniture.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分類控制器
 * 
 * @author CYY Team
 */
@RestController
@RequestMapping("/categories")
@Tag(name = "分類管理", description = "產品分類相關API")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Operation(summary = "獲取所有分類", description = "獲取所有活躍的分類")
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllActiveCategories();
        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "獲取根分類", description = "獲取所有根分類（無父分類）")
    @GetMapping("/root")
    public ResponseEntity<List<CategoryDto>> getRootCategories() {
        List<CategoryDto> categories = categoryService.getRootCategories();
        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "根據ID獲取分類", description = "根據分類ID獲取分類詳情")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(
            @Parameter(description = "分類ID") @PathVariable Long id) {
        CategoryDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @Operation(summary = "獲取子分類", description = "根據父分類ID獲取子分類")
    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<CategoryDto>> getChildCategories(
            @Parameter(description = "父分類ID") @PathVariable Long parentId) {
        List<CategoryDto> categories = categoryService.getChildCategories(parentId);
        return ResponseEntity.ok(categories);
    }
}
