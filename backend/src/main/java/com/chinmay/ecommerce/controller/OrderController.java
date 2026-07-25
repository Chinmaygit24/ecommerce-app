package com.chinmay.ecommerce.controller;

import com.chinmay.ecommerce.dto.OrderStatusUpdateRequest;
import com.chinmay.ecommerce.entity.Order;
import com.chinmay.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders/checkout")
    public ResponseEntity<Order> checkout(Authentication authentication) {
        return ResponseEntity.ok(orderService.placeOrder(authentication.getName()));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> myOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrdersForUser(authentication.getName()));
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<Order>> allOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/admin/orders/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }

    // Simulated payment confirmation endpoint.
    // In production this gets called after verifying the payment gateway's signature (Razorpay/Stripe webhook).
    @PostMapping("/orders/{id}/confirm-payment")
    public ResponseEntity<Order> confirmPayment(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.markAsPaid(id));
    }
}
