package com.backend.dto;

import com.backend.model.enums.AppointmentStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponseDTO {

    private Long appointmentId;

    private Long patientId;
    private String patientName;

    private LocalDateTime appointmentDateTime;
    private String reasonForVisit;
    private AppointmentStatus status;
}
