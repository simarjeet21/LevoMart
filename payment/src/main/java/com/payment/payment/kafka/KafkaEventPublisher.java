package com.payment.payment.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void publish(String topic, String key, String payload) {
    // kafkaTemplate.send(topic, key, payload).addCallback(
    //     result -> System.out.println("📤 Event sent to topic: " + topic),
    //     ex -> System.err.println("❌ Failed to send event to topic " + topic + ": " + ex.getMessage())
    // );
    kafkaTemplate.send(topic, key, payload)
    .thenAccept(result -> System.out.println(" Event sent to topic: " + topic))
    .exceptionally(ex -> {
        System.err.println(" Failed to send event to topic " + topic + ": " + ex.getMessage());
        return null;
    });
}
}
// kafka-topics.sh --create --topic payment-succeeded --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

// kafka-topics.sh --create --topic payment-failed --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
