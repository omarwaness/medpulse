package com.backend.controller;

import com.backend.dto.BillingRequestDTO;
import com.backend.dto.BillingResponseDTO;
import com.backend.model.enums.PaymentStatus;
import com.backend.service.BillingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/billings")
@Tag(name = "Billing", description = "API for managing Billings")
public class BillingController {
    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Billing by id")
    public ResponseEntity<BillingResponseDTO> getBilling(@PathVariable Long id) {
        BillingResponseDTO billingResponseDTO = billingService.getBilling(id);
        return ResponseEntity.ok().body(billingResponseDTO);
    }

    @GetMapping
    @Operation(summary = "Get all Billings")
    public ResponseEntity<List<BillingResponseDTO>> getAllBillings() {
        List<BillingResponseDTO> billings = billingService.getAllBilling();
        return ResponseEntity.ok().body(billings);
    }

    @PostMapping
    @Operation(summary = "Create a new Billing")
    public ResponseEntity<BillingResponseDTO> createBilling(@Validated @RequestBody BillingRequestDTO billingRequestDTO) {
        BillingResponseDTO billing = billingService.createBilling(billingRequestDTO);
        return ResponseEntity.ok().body(billing);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a Billing")
    public ResponseEntity<BillingResponseDTO> updateBilling(@PathVariable Long id, @Validated @RequestBody BillingRequestDTO billingRequestDTO) {
        BillingResponseDTO billing = billingService.updateBilling(id, billingRequestDTO);
        return ResponseEntity.ok().body(billing);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a Billing")
    public ResponseEntity<Void> deleteBilling(@PathVariable Long id) {
        billingService.deleteBilling(id);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping
//    @Operation(summary = "Get Billings by status")
//    public ResponseEntity<List<BillingResponseDTO>> getBillingsByStatus(@RequestParam PaymentStatus status) {
//        List<BillingResponseDTO> billings = billingService.getBillingByStatus(status);
//        return ResponseEntity.ok().body(billings);
//    }

//    @GetMapping("/revenue")
//    @Operation(summary = "Total Revenue from to")
//    public ResponseEntity<BigDecimal> getRevenue(
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
//    ) {
//        return ResponseEntity.ok(
//                billingService.getRevenue(from, to)
//        );
//    }


}
