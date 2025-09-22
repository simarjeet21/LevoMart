package com.cart.cart.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cart.cart.dao.CartRepository;
import com.cart.cart.dtos.AddToCartRequest;
import com.cart.cart.dtos.CartItemResponseDto;
import com.cart.cart.dtos.CartResponseDto;
import com.cart.cart.model.Cart;
import com.cart.cart.model.CartItem;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

   public void addToCart(String userId, AddToCartRequest request) {
        Cart cart = cartRepository.findByUserId(userId);
        if(cart==null) cart = new Cart(userId,new ArrayList<>());

        List<CartItem> items = cart.getItems();

        boolean updated = false;

        for (CartItem item : items) {
            if (item.getProductId().equals(request.getProductId())) {
                item.setQuantity(item.getQuantity() + request.getQuantity());
                item.setTotalPrice(item.getQuantity() * item.getProductPrice());
                updated = true;
                break;
            }
        }
        if (!updated) {
            items.add(new CartItem(
                request.getProductId(),
                request.getProductName(),
                request.getProductPrice(),
                request.getSellerId(),
                request.getProductPrice() * request.getQuantity(),
                request.getQuantity()
            ));
        }
        cartRepository.save(userId, cart);
    }

     
    public void removeFromCart(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) return;

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        cartRepository.save(userId, cart);
       
    }

    
    public CartResponseDto getCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) cart = new Cart(userId, new ArrayList<>());
        
        List<CartItemResponseDto> itemDtos = cart.getItems().stream().map(item -> CartItemResponseDto.builder()
            .productId(item.getProductId())
            .productName(item.getProductName())
            .sellerId(item.getSellerId())
            .price(item.getProductPrice())
            .quantity(item.getQuantity())
            .totalPrice(item.getTotalPrice())
            .build()
        ).toList();
        float total = itemDtos.stream().map(CartItemResponseDto::getTotalPrice).reduce(0f, Float::sum);
        return CartResponseDto.builder()
            .userId(userId)
            .items(itemDtos)
            .totalItems(itemDtos.size())
            .cartTotal(total)
            .build();
    }

    
    public void clearCart(String userId) {
        cartRepository.delete(userId);
    }
    public void updateQuantity(String userId, AddToCartRequest request) {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) return;

        for (CartItem item : cart.getItems()) {
            if (item.getProductId().equals(request.getProductId())) {
                item.setQuantity(request.getQuantity());
                item.setTotalPrice(item.getProductPrice() * request.getQuantity());
                break;
            }
        }

        cartRepository.save(userId, cart);
    }
}