package com.backend.dto.mapper;

import com.backend.dto.RecordRequestDTO;
import com.backend.dto.RecordResponseDTO;
import com.backend.model.Appointment;
import com.backend.model.Patient;
import com.backend.model.Record;

public class RecordMapper {

    public static Record toEntity(
            RecordRequestDTO dto,
            Patient patient,
            Appointment appointment
    ) {
        return Record.builder()
                .patient(patient)
                .appointment(appointment)
                .visitDate(dto.getVisitDate())
                .diagnosis(dto.getDiagnosis())
                .treatmentPlan(dto.getTreatmentPlan())
                .notes(dto.getNotes())
                .build();
    }

    public static RecordResponseDTO toResponseDTO(Record record) {
        return RecordResponseDTO.builder()
                .recordId(record.getRecordId())
                .patientId(record.getPatient().getPatientId())
                .patientName(record.getPatient().getName())
                .appointmentId(
                        record.getAppointment() != null
                                ? record.getAppointment().getAppointmentId()
                                : null
                )
                .visitDate(record.getVisitDate())
                .diagnosis(record.getDiagnosis())
                .treatmentPlan(record.getTreatmentPlan())
                .notes(record.getNotes())
                .build();
    }
}


