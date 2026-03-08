package com.backend.dto;

import com.backend.model.enums.PaymentMethod;
import com.backend.model.enums.PaymentStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingRequestDTO {

    @NotNull(message = "Medical owner ID is required")
    private Long ownerId;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    private BigDecimal totalAmount;

    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;

    private LocalDate paymentDate;
    private PaymentMethod paymentMethod;
}

