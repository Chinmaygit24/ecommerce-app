package com.chinmay.ecommerce.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;

    @NotNull @Min(0)
    private Integer stockQuantity;

    private String imageUrl;

    private Long categoryId;
}
