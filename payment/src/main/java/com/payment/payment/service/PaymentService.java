package com.payment.payment.service;

import com.payment.payment.dtos.PaymentRequest;
import com.stripe.exception.StripeException;

public interface  PaymentService {
    String createStripeCheckoutSession(PaymentRequest request) throws StripeException;
    
}
