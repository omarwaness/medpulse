package com.backend.controller;

import com.backend.dto.BillingResponseDTO;
import com.backend.dto.OwnerRequestDTO;
import com.backend.dto.OwnerResponseDTO;
import com.backend.dto.PatientResponseDTO;
import com.backend.service.OwnerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owners")
@Tag(name = "Owner", description = "API for managing Owners")
public class OwnerController {
    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Owner by id")
    public ResponseEntity<OwnerResponseDTO> getOwner(@PathVariable Long id) {
        OwnerResponseDTO ownerResponseDTO = ownerService.getOwnerById(id);
        return ResponseEntity.ok().body(ownerResponseDTO);
    }

    @GetMapping
    @Operation(summary = "Get all Owners")
    public ResponseEntity<List<OwnerResponseDTO>> getAllOwners() {
        List<OwnerResponseDTO> owners = ownerService.getOwners();
        return ResponseEntity.ok().body(owners);
    }

    @PostMapping
    @Operation(summary = "Create a new Owner")
    public ResponseEntity<OwnerResponseDTO> createOwner(@Validated @RequestBody OwnerRequestDTO owner) {
        OwnerResponseDTO ownerResponseDTO = ownerService.createOwner(owner);
        return ResponseEntity.ok().body(ownerResponseDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a Owner")
    public ResponseEntity<OwnerResponseDTO> updateOwner(@PathVariable Long id, @Validated @RequestBody OwnerRequestDTO owner) {
        OwnerResponseDTO ownerResponseDTO = ownerService.updateOwner(id, owner);
        return ResponseEntity.ok().body(ownerResponseDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a Owner")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long id) {
        ownerService.deleteOwner(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search Owner by email or phone")
    public ResponseEntity<OwnerResponseDTO> searchOwner(
            @RequestParam(required = false) @Email String email,
            @RequestParam(required = false) String phone) {

        if (email != null) {
            return ResponseEntity.ok(ownerService.getOwnerByEmail(email));
        } else if (phone != null) {
            return ResponseEntity.ok(ownerService.getOwnerByPhone(phone));
        }
        throw new IllegalArgumentException("Either email or phone must be provided");
    }

    @GetMapping("/{id}/patients")
    @Operation(summary = "Get Patients related to Owner")
    public ResponseEntity<List<PatientResponseDTO>> getOwnerPatients(@PathVariable Long id) {
        List<PatientResponseDTO> patients = ownerService.getOwnerPatients(id);
        return ResponseEntity.ok().body(patients);
    }

    @GetMapping("/{id}/billings")
    @Operation(summary = "Get Owner's billings")
    public ResponseEntity<List<BillingResponseDTO>> getOwnerBillings(@PathVariable Long id) {
        List<BillingResponseDTO> billings = ownerService.getOwnerBillings(id);
        return ResponseEntity.ok().body(billings);
    }

}
