package com.payment.payment.model;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
// import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
// import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    //@GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private String id;
    private String orderId;
    private String userId;
    private Long amount;
    private String currency;
     @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    private String sessionId;
    private Instant createdAt ;
    private Instant updatedAt;

    @PrePersist
public void onCreate() {
    this.createdAt = Instant.now();
    this.updatedAt = Instant.now();
}

@PreUpdate
public void onUpdate() {
    this.updatedAt = Instant.now();
}



    
}
