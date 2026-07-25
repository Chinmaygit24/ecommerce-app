package com.chinmay.ecommerce.dto;

import com.chinmay.ecommerce.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OrderStatusUpdateRequest {
    @NotNull
    private OrderStatus status;
}
