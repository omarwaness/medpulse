package com.backend.dto.mapper;

import com.backend.dto.AppointmentRequestDTO;
import com.backend.dto.AppointmentResponseDTO;
import com.backend.model.Appointment;
import com.backend.model.Patient;

public class AppointmentMapper {

    public static Appointment toEntity(AppointmentRequestDTO dto, Patient patient) {
        return Appointment.builder()
                .patient(patient)
                .appointmentDateTime(dto.getAppointmentDateTime())
                .reasonForVisit(dto.getReasonForVisit())
                .status(dto.getStatus())
                .build();
    }

    public static AppointmentResponseDTO toResponseDTO(Appointment appointment) {
        return AppointmentResponseDTO.builder()
                .appointmentId(appointment.getAppointmentId())
                .patientId(appointment.getPatient().getPatientId())
                .patientName(appointment.getPatient().getName())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .reasonForVisit(appointment.getReasonForVisit())
                .status(appointment.getStatus())
                .build();
    }
}

