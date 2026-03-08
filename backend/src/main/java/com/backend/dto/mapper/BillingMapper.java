package com.backend.dto.mapper;

import com.backend.dto.BillingRequestDTO;
import com.backend.dto.BillingResponseDTO;
import com.backend.model.Billing;
import com.backend.model.Owner;

public class BillingMapper {

    public static Billing toEntity(
            BillingRequestDTO dto,
            Owner owner
    ) {
        return Billing.builder()
                .owner(owner)
                .totalAmount(dto.getTotalAmount())
                .paymentStatus(dto.getPaymentStatus())
                .paymentDate(dto.getPaymentDate())
                .paymentMethod(dto.getPaymentMethod())
                .build();
    }

    public static BillingResponseDTO toResponseDTO(Billing billing) {
        return BillingResponseDTO.builder()
                .billId(billing.getBillId())
                .ownerId(billing.getOwner().getOwnerId())
                .totalAmount(billing.getTotalAmount())
                .paymentStatus(billing.getPaymentStatus())
                .paymentDate(billing.getPaymentDate())
                .paymentMethod(billing.getPaymentMethod())
                .build();
    }
}


