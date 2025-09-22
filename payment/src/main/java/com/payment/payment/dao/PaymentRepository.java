package com.payment.payment.dao;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.payment.payment.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment,String> {
    Optional<Payment> findBySessionId(String sessionId);
}
