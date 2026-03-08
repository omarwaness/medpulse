package com.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRequestDTO {

    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    @NotBlank(message = "Patient name is required")
    @Size(max = 100)
    private String name;

    // Optional fields
    private String species;
    private String breed;
    private LocalDate dateOfBirth;
    private String gender;
}
