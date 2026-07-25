package com.chinmay.ecommerce.service;

import com.chinmay.ecommerce.dto.CartItemRequest;
import com.chinmay.ecommerce.entity.CartItem;
import com.chinmay.ecommerce.entity.Product;
import com.chinmay.ecommerce.entity.User;
import com.chinmay.ecommerce.exception.BadRequestException;
import com.chinmay.ecommerce.exception.ResourceNotFoundException;
import com.chinmay.ecommerce.repository.CartItemRepository;
import com.chinmay.ecommerce.repository.ProductRepository;
import com.chinmay.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<CartItem> getCart(String userEmail) {
        User user = getUser(userEmail);
        return cartItemRepository.findByUserId(user.getId());
    }

    public CartItem addToCart(String userEmail, CartItemRequest request) {
        User user = getUser(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Not enough stock available for " + product.getName());
        }

        CartItem existing = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId()).orElse(null);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            return cartItemRepository.save(existing);
        }

        CartItem item = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .build();
        return cartItemRepository.save(item);
    }

    public CartItem updateQuantity(String userEmail, Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        validateOwnership(item, userEmail);

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeFromCart(String userEmail, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        validateOwnership(item, userEmail);
        cartItemRepository.delete(item);
    }

    public void clearCart(String userEmail) {
        User user = getUser(userEmail);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private void validateOwnership(CartItem item, String userEmail) {
        if (!item.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("This cart item does not belong to you");
        }
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
