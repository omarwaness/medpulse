package com.backend.dto.mapper;

import com.backend.dto.PatientRequestDTO;
import com.backend.dto.PatientResponseDTO;
import com.backend.model.Owner;
import com.backend.model.Patient;

public class PatientMapper {

    public static Patient toEntity(PatientRequestDTO dto, Owner owner) {
        return Patient.builder()
                .owner(owner)
                .name(dto.getName())
                .species(dto.getSpecies())
                .breed(dto.getBreed())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .build();
    }

    public static PatientResponseDTO toResponseDTO(Patient patient) {
        return PatientResponseDTO.builder()
                .patientId(patient.getPatientId())
                .ownerId(patient.getOwner().getOwnerId())
                .ownerName(patient.getOwner().getFirstName() + " " + patient.getOwner().getLastName())
                .name(patient.getName())
                .species(patient.getSpecies())
                .breed(patient.getBreed())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .build();
    }
}

