package com.payment.payment.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.Instant;

@Data
@AllArgsConstructor
public class PaymentFailedEvent {
    private String id;
    private String orderId;
    private String userId;
    private Long amount;
    private String currency;
    private String status; // should always be "failed"
    private String sessionId;
    private Instant createdAt;
    private String failureReason;
}
