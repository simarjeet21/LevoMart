package com.payment.payment.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
     private String orderId;
    private String userId;
    private Long amount; // in paise
    private String currency; // INR or USD
}
