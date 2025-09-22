package com.payment.payment.kafka.events;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class OrderCreatedEvent {
    private String id;
    private String userId;
    private String status;
    private Instant expiresAt;
    private Instant createdAt;
    private Instant updatedAt;
    private int version;
    private List<OrderItem> orderItems;

    @Data
    public static class OrderItem {
        private String id;
        private String productId;
        private String productName;
        private double productPrice;
        private int quantity;
        private double totalPrice;
        private Instant createdAt;
        private Instant updatedAt;
        private int version;
        private String orderId;
        private String sellerId;
    }
}
