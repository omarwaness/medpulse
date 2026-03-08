package com.backend.service;

import com.backend.dto.BillingRequestDTO;
import com.backend.dto.BillingResponseDTO;
import com.backend.dto.mapper.BillingMapper;
import com.backend.exception.BillingNotFoundException;
import com.backend.exception.OwnerNotFoundExecption;
import com.backend.model.Billing;
import com.backend.model.Owner;
import com.backend.model.enums.PaymentStatus;
import com.backend.repository.BillingRepository;
import com.backend.repository.OwnerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BillingService {
    private final BillingRepository billingRepository;
    private final OwnerRepository ownerRepository;

    public BillingService(BillingRepository billingRepository, OwnerRepository ownerRepository) {
        this.billingRepository = billingRepository;
        this.ownerRepository = ownerRepository;
    }

    public BillingResponseDTO getBilling(Long billingId) {
        Billing billing = billingRepository.findById(billingId)
                .orElseThrow(() -> new BillingNotFoundException("Billing not found with ID: " + billingId));
        return BillingMapper.toResponseDTO(billing);
    }

    public List<BillingResponseDTO> getAllBilling() {
        List<Billing> billings = billingRepository.findAll();
        return billings.stream().map(BillingMapper::toResponseDTO).toList();
    }

    public BillingResponseDTO createBilling(BillingRequestDTO billingRequestDTO) {
        Owner owner = ownerRepository.findById(billingRequestDTO.getOwnerId())
                .orElseThrow(() -> new OwnerNotFoundExecption("Owner not found with ID: " + billingRequestDTO.getOwnerId()));

        Billing billing = billingRepository.save(
                BillingMapper.toEntity(billingRequestDTO, owner)
        );
        return BillingMapper.toResponseDTO(billing);
    }

    public BillingResponseDTO updateBilling(Long id, BillingRequestDTO billingRequestDTO) {
        Billing billing = billingRepository.findById(id)
                .orElseThrow(() -> new BillingNotFoundException("Billing not found with ID: " + id));

        billing.setPaymentDate(billingRequestDTO.getPaymentDate());
        billing.setPaymentMethod(billingRequestDTO.getPaymentMethod());
        billing.setPaymentStatus(billingRequestDTO.getPaymentStatus());

        Billing updatedBilling = billingRepository.save(billing);
        return BillingMapper.toResponseDTO(updatedBilling);
    }

    public void deleteBilling(Long id) {
        billingRepository.deleteById(id);
    }


    // --------------------------- custom ---------------------------------

//    public List<BillingResponseDTO> getBillingByStatus(PaymentStatus status) {
//        List<Billing> billings = billingRepository.findByPaymentStatus(status);
//        return billings.stream().map(BillingMapper::toResponseDTO).toList();
//    }

//    public BigDecimal getRevenue(LocalDate from, LocalDate to) {
//
//        LocalDateTime start = from.atStartOfDay();
//        LocalDateTime end = to.atTime(LocalTime.MAX);
//
//        return billingRepository.calculateRevenue(start, end);
//    }


}
