package com.backend.dto;

import com.backend.model.enums.PaymentMethod;
import com.backend.model.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingResponseDTO {

    private Long billId;

    private Long ownerId;

    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private LocalDate paymentDate;
    private PaymentMethod paymentMethod;
}

