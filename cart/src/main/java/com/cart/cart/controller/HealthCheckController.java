package com.cart.cart.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart/public/health")
@RequiredArgsConstructor
public class HealthCheckController {
    @Autowired
    @Qualifier("genericRedisTemplate")
    private final RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/redis")
    public ResponseEntity<String> checkRedisConnection() {
        System.out.println("hello i am healthchjeck controller ");
        try {
            redisTemplate.opsForValue().set("ping", "pong");
            return ResponseEntity.ok("✅ Redis connected successfully — hello");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Redis connection failed: " + e.getMessage());
        }
    }
}
