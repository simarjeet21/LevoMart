package com.cart.cart.kafka.listener;

import com.cart.cart.kafka.events.OrderCreatedEvent;
import com.cart.cart.kafka.validator.JsonSchemaValidator;
import com.cart.cart.service.CartService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderCreatedListener {

    private final ObjectMapper objectMapper;
    private final CartService cartService;
    //@Value("${spring.kafka.consumer.group-id}")
    //private String groupID;


    @Value("${kafka.orderCreated.schema}")
    private String orderCreatedSchemaPath;

    @KafkaListener(topics = "order-created",  groupId = "${spring.kafka.consumer.group-id}")
    public void listenOrderCreated(String message) {
        try {
            // ✅ Schema validation
            JsonSchemaValidator.validate(message, orderCreatedSchemaPath);

            // ✅ Parse JSON into object
            OrderCreatedEvent event = objectMapper.readValue(message, OrderCreatedEvent.class);
            String userId = event.getUserId();
            cartService.clearCart(userId);
            

        } catch (Exception e) {
            log.error("❌ Failed to process order-created event: ", e);
        }
    }
}
