package com.backend.service;

import com.backend.dto.*;
import com.backend.dto.mapper.BillingMapper;
import com.backend.dto.mapper.OwnerMapper;
import com.backend.dto.mapper.PatientMapper;
import com.backend.exception.EmailAlreadyExistsException;
import com.backend.exception.OwnerNotFoundExecption;
import com.backend.exception.PhoneAlreadyExistsException;
import com.backend.model.Billing;
import com.backend.model.Owner;
import com.backend.model.Patient;
import com.backend.repository.OwnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerService {
    private final OwnerRepository ownerRepository;

    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public OwnerResponseDTO getOwnerById(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundExecption("Owner not found with ID: " + id));

        return OwnerMapper.toResponseDTO(owner);
    }

    public List<OwnerResponseDTO> getOwners() {
        List<Owner> owners = ownerRepository.findAll();
        return owners.stream().map(OwnerMapper::toResponseDTO).toList();
    }

    public OwnerResponseDTO createOwner(OwnerRequestDTO ownerRequestDTO) {
        if (ownerRepository.existsByEmail(ownerRequestDTO.getEmail())) {
            throw new EmailAlreadyExistsException("A owner with this email already exists: " + ownerRequestDTO.getEmail());
        }

        if (ownerRepository.existsByPhone(ownerRequestDTO.getPhone())) {
            throw new PhoneAlreadyExistsException("This phone number already exists: " + ownerRequestDTO.getPhone());
        }

        Owner owner = ownerRepository.save(
                OwnerMapper.toEntity(ownerRequestDTO)
        );
        return OwnerMapper.toResponseDTO(owner);
    }

    public OwnerResponseDTO updateOwner(Long id, OwnerRequestDTO ownerRequestDTO) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundExecption("Owner not found with ID: " + id));

        if (ownerRepository.existsByEmailAndOwnerIdNot(ownerRequestDTO.getEmail(), id)) {
            throw new EmailAlreadyExistsException("A owner with this email already exists: " + ownerRequestDTO.getEmail());
        }

        if (ownerRepository.existsByPhoneAndOwnerIdNot(ownerRequestDTO.getPhone(), id)) {
            throw new PhoneAlreadyExistsException("This phone number already exists: " + ownerRequestDTO.getPhone());
        }

        owner.setFirstName(ownerRequestDTO.getFirstName());
        owner.setLastName(ownerRequestDTO.getLastName());
        owner.setEmail(ownerRequestDTO.getEmail());
        owner.setAddress(ownerRequestDTO.getAddress());
        owner.setPhone(ownerRequestDTO.getPhone());

        Owner updatedOwner = ownerRepository.save(owner);
        return OwnerMapper.toResponseDTO(updatedOwner);
    }

    public void deleteOwner(Long id) {
        ownerRepository.deleteById(id);
    }

    // -------------------------------- custom --------------------------------------

    public OwnerResponseDTO getOwnerByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email must not be empty");
        }

        Owner owner = ownerRepository.findByEmail(email);
        if (owner == null) {
            throw new OwnerNotFoundExecption("Owner not found with email: " + email);
        }
        return OwnerMapper.toResponseDTO(owner);
    }

    public OwnerResponseDTO getOwnerByPhone(String phone) {
        if (phone == null || phone.isBlank()) {
            throw new IllegalArgumentException("Phone must not be empty");
        }

        Owner owner = ownerRepository.findByPhone(phone);
        if (owner == null) {
            throw new OwnerNotFoundExecption("Owner not found with phone number: " + phone);
        }
        return OwnerMapper.toResponseDTO(owner);
    }

    public List<PatientResponseDTO> getOwnerPatients(Long ownerId) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new OwnerNotFoundExecption("Owner not found with ID: " + ownerId));

        List<Patient> patients = owner.getPatients();
        return patients.stream().map(PatientMapper::toResponseDTO).toList();
    }

    public List<BillingResponseDTO> getOwnerBillings(Long ownerId) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new OwnerNotFoundExecption("Owner not found with ID: " + ownerId));

        List<Billing> billings = owner.getBillings();
        return billings.stream().map(BillingMapper::toResponseDTO).toList();
    }

}
