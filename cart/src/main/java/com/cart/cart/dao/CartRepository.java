package com.cart.cart.dao;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.cart.cart.model.Cart;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CartRepository {
    private final RedisTemplate<String, Cart> redisTemplate;
    private final String CART_KEY_PREFIX = "cart:";
    
    public void save(String userId, Cart cart) {
        redisTemplate.opsForValue().set(CART_KEY_PREFIX + userId, cart);
    }

    public Cart findByUserId(String userId) {
        return (Cart) redisTemplate.opsForValue().get(CART_KEY_PREFIX + userId);
    }

    public void delete(String userId) {
        redisTemplate.delete(CART_KEY_PREFIX + userId);
    }
}
