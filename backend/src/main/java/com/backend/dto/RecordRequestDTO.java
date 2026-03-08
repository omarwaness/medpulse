package com.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordRequestDTO {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long appointmentId; // optional

    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;

    @NotBlank(message = "Diagnosis is required")
    @Size(max = 500)
    private String diagnosis;

    @Size(max = 1000)
    private String treatmentPlan;

    @Size(max = 2000)
    private String notes;
}