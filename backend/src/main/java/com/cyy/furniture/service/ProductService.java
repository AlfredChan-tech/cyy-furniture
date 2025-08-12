package com.cyy.furniture.service;

import com.cyy.furniture.dto.ProductDto;
import com.cyy.furniture.entity.Product;
import com.cyy.furniture.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 產品服務層
 * 
 * @author CYY Team
 */
@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * 獲取所有可用產品
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> getAllAvailableProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAvailableProducts(pageable);
        return products.map(this::convertToDto);
    }

    /**
     * 根據ID獲取產品
     */
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("產品不存在: " + id));
        return convertToDto(product);
    }

    /**
     * 根據分類獲取產品
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        return products.map(this::convertToDto);
    }

    /**
     * 搜索產品
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.searchByKeyword(keyword, pageable);
        return products.map(this::convertToDto);
    }

    /**
     * 根據價格範圍獲取產品
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        return products.map(this::convertToDto);
    }

    /**
     * 獲取精選產品
     */
    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts() {
        Pageable pageable = PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> products = productRepository.findFeaturedProducts(pageable);
        return products.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 獲取熱門產品
     */
    @Transactional(readOnly = true)
    public List<ProductDto> getPopularProducts() {
        Pageable pageable = PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "viewCount"));
        Page<Product> products = productRepository.findAvailableProducts(pageable);
        return products.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 獲取相關產品
     */
    @Transactional(readOnly = true)
    public List<ProductDto> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("產品不存在: " + productId));
        
        Pageable pageable = PageRequest.of(0, 4);
        Page<Product> relatedProducts = productRepository.findByCategoryId(product.getCategory().getId(), pageable);
        
        return relatedProducts.getContent().stream()
                .filter(p -> !p.getId().equals(productId))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 轉換為DTO
     */
    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setSku(product.getSku());
        dto.setStock(product.getStock());
        dto.setMainImage(product.getMainImage());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setViewCount(product.getViewCount());
        dto.setSalesCount(product.getSalesCount());
        dto.setIsFeatured(product.getIsFeatured());
        dto.setIsNew(product.getIsNew());
        dto.setIsHot(product.getIsHot());
        dto.setStatus(product.getStatus());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        // 設置產品圖片
        if (product.getImages() != null) {
            List<String> imageUrls = product.getImages().stream()
                    .map(img -> img.getImageUrl())
                    .collect(Collectors.toList());
            dto.setImages(imageUrls);
        }
        
        return dto;
    }
}
