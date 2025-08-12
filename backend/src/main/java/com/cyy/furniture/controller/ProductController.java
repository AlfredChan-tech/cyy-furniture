package com.cyy.furniture.controller;

import com.cyy.furniture.dto.ProductDto;
import com.cyy.furniture.entity.Product;
import com.cyy.furniture.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 產品控制器
 * 
 * @author CYY Team
 */
@RestController
@RequestMapping("/products")
@Tag(name = "產品管理", description = "產品相關API")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductService productService;

    @Operation(summary = "獲取所有產品", description = "分頁獲取所有可用產品")
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @Parameter(description = "分頁參數") Pageable pageable) {
        Page<ProductDto> products = productService.getAllAvailableProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "根據ID獲取產品", description = "根據產品ID獲取產品詳情")
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(
            @Parameter(description = "產品ID") @PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @Operation(summary = "根據分類獲取產品", description = "根據分類ID分頁獲取產品")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductDto>> getProductsByCategory(
            @Parameter(description = "分類ID") @PathVariable Long categoryId,
            @Parameter(description = "分頁參數") Pageable pageable) {
        Page<ProductDto> products = productService.getProductsByCategory(categoryId, pageable);
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "搜索產品", description = "根據關鍵詞搜索產品")
    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto>> searchProducts(
            @Parameter(description = "搜索關鍵詞") @RequestParam String keyword,
            @Parameter(description = "分頁參數") Pageable pageable) {
        Page<ProductDto> products = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "根據價格範圍獲取產品", description = "根據價格範圍篩選產品")
    @GetMapping("/price-range")
    public ResponseEntity<Page<ProductDto>> getProductsByPriceRange(
            @Parameter(description = "最低價格") @RequestParam BigDecimal minPrice,
            @Parameter(description = "最高價格") @RequestParam BigDecimal maxPrice,
            @Parameter(description = "分頁參數") Pageable pageable) {
        Page<ProductDto> products = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "獲取精選產品", description = "獲取精選推薦產品")
    @GetMapping("/featured")
    public ResponseEntity<List<ProductDto>> getFeaturedProducts() {
        List<ProductDto> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "獲取熱門產品", description = "獲取熱門產品")
    @GetMapping("/popular")
    public ResponseEntity<List<ProductDto>> getPopularProducts() {
        List<ProductDto> products = productService.getPopularProducts();
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "獲取相關產品", description = "根據產品ID獲取相關推薦產品")
    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductDto>> getRelatedProducts(
            @Parameter(description = "產品ID") @PathVariable Long id) {
        List<ProductDto> products = productService.getRelatedProducts(id);
        return ResponseEntity.ok(products);
    }
}
