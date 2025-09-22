package com.payment.payment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.payment.payment.dao.PaymentRepository;
import com.payment.payment.dtos.PaymentRequest;
import com.payment.payment.model.Payment;
import com.payment.payment.model.PaymentStatus;
import com.payment.payment.security.UserContext;
import com.stripe.exception.StripeException;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;


import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository repository;

    private final UserContext userContext;
    @Value("${CHECKOUT_SUCCESS_URL}")
private String checkoutSuccessUrl;

@Value("${CHECKOUT_CANCEL_URL}")
private String checkoutCancelUrl;

    @Override
    public String createStripeCheckoutSession(PaymentRequest request) throws StripeException {
        // System.out.println(userContext.getUserId());
        // System.out.println(request.getUserId());
        // if(!request.getUserId().equals(userContext.getUserId())) throw new RuntimeException("Unauthorized");
        List<SessionCreateParams.LineItem> lineItems = List.of(
            SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                .setPriceData(
                    SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(request.getCurrency())
                        .setUnitAmount(request.getAmount())
                        .setProductData(
                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName("Order: " + request.getOrderId())
                                .build()
                        )
                        .build()
                )
                .build()
        );

        SessionCreateParams params = SessionCreateParams.builder()
            .addAllLineItem(lineItems)
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(checkoutSuccessUrl)
            .setCancelUrl(checkoutCancelUrl)
            .build();

        Session session = Session.create(params);

        Payment payment = new Payment();
        payment.setId(UUID.randomUUID().toString());
        payment.setSessionId(session.getId());
        payment.setOrderId(request.getOrderId());
        payment.setUserId(request.getUserId());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setStatus(PaymentStatus.PENDING);

        repository.save(payment);

        return session.getUrl();
    }
}

