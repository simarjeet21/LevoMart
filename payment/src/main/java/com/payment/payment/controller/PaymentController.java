package com.payment.payment.controller;

import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.payment.payment.dtos.PaymentRequest;
import com.payment.payment.service.PaymentService;
import com.stripe.exception.StripeException;

import lombok.AllArgsConstructor;


@AllArgsConstructor

@RestController
@RequestMapping("/api/payment")
public class PaymentController {


private final PaymentService paymentService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckout(@RequestBody PaymentRequest request) throws StripeException {
        request.setAmount(request.getAmount() * 100); // Convert amount to cents
        String url = paymentService.createStripeCheckoutSession(request);
        return ResponseEntity.ok(Map.of("checkoutUrl", url));
    }
}
