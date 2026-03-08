package com.backend.repository;

import com.backend.model.Billing;
import com.backend.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {
//    List<Billing> findByPaymentStatus(PaymentStatus paymentStatus);

//    @Query("""
//           SELECT COALESCE(SUM(b.totalAmount), 0)
//           FROM Billing b
//           WHERE b.paymentStatus = 'PAID'
//           AND b.paymentDate BETWEEN :from AND :to
//           """)
//    BigDecimal calculateRevenue(
//            @Param("from") LocalDateTime from,
//            @Param("to") LocalDateTime to
//    );
}
