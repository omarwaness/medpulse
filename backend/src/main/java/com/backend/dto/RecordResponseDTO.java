package com.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordResponseDTO {

    private Long recordId;

    private Long patientId;
    private String patientName;

    private Long appointmentId;

    private LocalDate visitDate;
    private String diagnosis;
    private String treatmentPlan;
    private String notes;
}

