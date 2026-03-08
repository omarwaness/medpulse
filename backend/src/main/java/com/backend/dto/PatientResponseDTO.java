package com.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponseDTO {

    private Long patientId;
    private Long ownerId;
    private String ownerName;

    private String name;
    private String species;
    private String breed;
    private LocalDate dateOfBirth;
    private String gender;
}
