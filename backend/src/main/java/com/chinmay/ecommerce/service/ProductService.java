package com.chinmay.ecommerce.service;

import com.chinmay.ecommerce.dto.ProductRequest;
import com.chinmay.ecommerce.entity.Category;
import com.chinmay.ecommerce.entity.Product;
import com.chinmay.ecommerce.exception.ResourceNotFoundException;
import com.chinmay.ecommerce.repository.CategoryRepository;
import com.chinmay.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<Product> searchProducts(String name, Long categoryId, Pageable pageable) {
        boolean hasName = name != null && !name.isBlank();
        boolean hasCategory = categoryId != null;

        if (hasName && hasCategory) {
            return productRepository.findByNameContainingIgnoreCaseAndCategoryId(name, categoryId, pageable);
        } else if (hasName) {
            return productRepository.findByNameContainingIgnoreCase(name, pageable);
        } else if (hasCategory) {
            return productRepository.findByCategoryId(categoryId, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = getById(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product product = getById(id);
        productRepository.delete(product);
    }
}
