package com.payment.payment.webhook;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.payment.payment.dao.PaymentRepository;
import com.payment.payment.kafka.KafkaEventPublisher;
import com.payment.payment.kafka.events.PaymentSucceededEvent;
import com.payment.payment.kafka.validator.JsonSchemaValidator;
import com.payment.payment.model.PaymentStatus;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;

import java.nio.file.Paths;
import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stripe.model.PaymentIntent;

@RestController
@RequestMapping("/api/internal/payment/webhooks")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final PaymentRepository repository;

    private final ObjectMapper objectMapper;

    @Autowired
    private KafkaEventPublisher eventPublisher;

    

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;
    @Value("${kafka.paymentSucceeded.schema}")
    private String paymentSucceededSchemaPath;
    @Value("${kafka.paymentFailed.schema}")
    private String paymentFailedSchemaPath;
    @Value("${kafka.paymentSucceeded.topic}")
    private String paymentSucceededEventTopic;
    @Value("${kafka.paymentFailed.topic}")
    private String paymentFailedEventTopic;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload,
                                                    @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        System.out.println("💥 Received Stripe webhook");

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (Exception e) {
            
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        // System.out.println("👉 Event Type: " + event.getType());

        switch (event.getType()) {
            case "checkout.session.completed":
                handleCheckoutSessionCompleted(event);
                break;
            case "payment_intent.succeeded":
            case "payment_intent.failed":
            case "checkout.session.expired":
            case "charge.failed":
                handlePaymentFailure(event);
                break;
            case "charge.succeeded":
                // Optional: log or extend handling if needed
                // System.out.println("ℹ️ Received event: " + event.getType() + " — handled elsewhere or ignored.");
                break;
            default:
                 System.out.println("ℹ️ Unhandled event type: " + event.getType());
                break;
        }

        return ResponseEntity.ok("Received");
    }
    

    private void handlePaymentFailure(Event event) {
    var optionalObject = event.getDataObjectDeserializer().getObject();
    if (optionalObject.isEmpty()) return;

    if (event.getType().startsWith("payment_intent")) {
        PaymentIntent intent = (PaymentIntent) optionalObject.get();
        String sessionId = intent.getMetadata().get("sessionId"); // if you store sessionId in metadata
        if (sessionId == null) {
            System.err.println("❌ No sessionId in metadata");
            return;
        }

        repository.findBySessionId(sessionId).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setUpdatedAt(Instant.now());

            repository.save(payment);

            Map<String, Object> payload = Map.of(
                "id", payment.getId(),
                "orderId", payment.getOrderId(),
                "userId", payment.getUserId(),
                "amount", payment.getAmount(),
                "currency", payment.getCurrency(),
                "status", "failed",
                "sessionId", payment.getSessionId(),
                "createdAt", payment.getCreatedAt().toString(),
                "failureReason", "Payment failed or expired"
            );

            try {
                String json = objectMapper.writeValueAsString(payload);


                // String schemaPath = Paths.get(System.getProperty("user.dir"))
                //          .resolve("${kafka.paymentSucceeded.schema}")
                //          .normalize()
                //          .toAbsolutePath()
                //          .toString();


                JsonSchemaValidator.validate(json, paymentFailedSchemaPath);
                eventPublisher.publish(paymentFailedEventTopic, payment.getId(), json);
            } catch (Exception e) {
                System.err.println("❌ Failed to publish payment-failed event: " + e.getMessage());
            }
        });

    } else if (event.getType().startsWith("checkout.session")) {
        Session session = (Session) optionalObject.get();
        String sessionId = session.getId();
        // handle as before
    } else {
        System.err.println("⚠️ Unsupported failure type: " + event.getType());
    }
    }




    private void handleCheckoutSessionCompleted(Event event) {
        var optionalObject = event.getDataObjectDeserializer().getObject();
        if (optionalObject.isEmpty()) {
            //System.err.println("❌ Failed to deserialize checkout.session.completed event");
            return;
        }

        Session session = (Session) optionalObject.get();
        String sessionId = session.getId();
        //System.out.println("✅ Session ID: " + sessionId);

        // repository.findBySessionId(sessionId).ifPresentOrElse(payment -> {
        //     payment.setStatus("SUCCESS");
        //     repository.save(payment);
        //     //System.out.println("✅ Payment updated in DB");
        // }, () -> {
        //     System.err.println("❌ No Payment found for session ID: " + sessionId);
        // });


        repository.findBySessionId(sessionId).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setUpdatedAt(Instant.now());

            repository.save(payment);
             // Prepare event payload
            PaymentSucceededEvent paymentSucceededEvent  = new PaymentSucceededEvent(
                payment.getId(),
                payment.getOrderId(),
                payment.getUserId(),
                payment.getAmount(),
                payment.getCurrency(),
                "success",
                payment.getSessionId(),
                payment.getCreatedAt()
            );

        try {
        String json = objectMapper.writeValueAsString(paymentSucceededEvent );
       

        // String schemaPath = Paths.get(System.getProperty("user.dir"))
        //                  .resolve("${kafka.paymentSucceeded.schema}")
        //                  .normalize()
        //                  .toAbsolutePath()
        //                  .toString();

        JsonSchemaValidator.validate(json, paymentSucceededSchemaPath);
        eventPublisher.publish(paymentSucceededEventTopic, payment.getId(), json);
        System.out.println("✅ Event sent to topic: payment-succeeded");
        } catch (Exception e) {
            System.err.println("❌ Event publish failed: " + e.getMessage());
        }

        });
    }
}