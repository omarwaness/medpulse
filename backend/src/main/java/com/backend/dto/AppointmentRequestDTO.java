package com.backend.dto;

import com.backend.model.enums.AppointmentStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentRequestDTO {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Appointment date and time is required")
    private LocalDateTime appointmentDateTime;

    @Size(max = 500)
    private String reasonForVisit;

    @NotNull(message = "Status is required")
    private AppointmentStatus status;
}
