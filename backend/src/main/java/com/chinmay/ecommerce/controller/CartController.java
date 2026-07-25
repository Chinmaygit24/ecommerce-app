package com.chinmay.ecommerce.controller;

import com.chinmay.ecommerce.dto.CartItemRequest;
import com.chinmay.ecommerce.entity.CartItem;
import com.chinmay.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<CartItem> addToCart(Authentication authentication, @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), request));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> updateQuantity(Authentication authentication,
                                                     @PathVariable Long cartItemId,
                                                     @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(authentication.getName(), cartItemId, quantity));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> remove(Authentication authentication, @PathVariable Long cartItemId) {
        cartService.removeFromCart(authentication.getName(), cartItemId);
        return ResponseEntity.noContent().build();
    }
}
