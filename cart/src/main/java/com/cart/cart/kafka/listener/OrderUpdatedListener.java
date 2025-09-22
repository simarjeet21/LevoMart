// package com.payment.payment.kafka.listener;



// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.payment.payment.kafka.events.OrderCreatedEvent;
// import com.payment.payment.kafka.validator.JsonSchemaValidator;
// import com.payment.payment.service.PaymentService;
// import com.payment.payment.dtos.PaymentRequest;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.kafka.annotation.KafkaListener;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class OrderUpdatedListener {

//     private final ObjectMapper objectMapper;
//     private final PaymentService paymentService;

//     @Value("${kafka.orderUpdated.schema}")
//     private String orderCreatedSchemaPath;

//     @KafkaListener(topics = "order-updated", groupId = "payment-service")
//     public void listenOrderCreated(String message) {
//         try {
//             // ✅ Schema validation
//             JsonSchemaValidator.validate(message, orderCreatedSchemaPath);

//             // ✅ Parse JSON into object
//             OrderCreatedEvent event = objectMapper.readValue(message, OrderCreatedEvent.class);

//             double totalAmount = event.getOrderItems().stream()
//                 .mapToDouble(OrderCreatedEvent.OrderItem::getTotalPrice)
//                 .sum();

//             PaymentRequest paymentRequest = new PaymentRequest();
//             paymentRequest.setOrderId(event.getId());
//             paymentRequest.setUserId(event.getUserId());
//             paymentRequest.setAmount((long) (totalAmount * 100)); // Stripe in paise/cents
//             paymentRequest.setCurrency("INR");

//             String checkoutUrl = paymentService.createStripeCheckoutSession(paymentRequest);
//             log.info("✅ Stripe Checkout URL: {}", checkoutUrl);

//         } catch (Exception e) {
//             log.error("❌ Failed to process order-created event: ", e);
//         }
//     }
// }
