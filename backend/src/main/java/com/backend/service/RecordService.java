package com.backend.service;

import com.backend.dto.RecordRequestDTO;
import com.backend.dto.RecordResponseDTO;
import com.backend.dto.mapper.RecordMapper;
import com.backend.exception.AppointmentNotFoundException;
import com.backend.exception.PatientNotFoundException;
import com.backend.exception.RecordNotFoundException;
import com.backend.model.Appointment;
import com.backend.model.Patient;
import com.backend.model.Record;
import com.backend.repository.AppointmentRepository;
import com.backend.repository.PatientRepository;
import com.backend.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordService {
    private final RecordRepository recordRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public RecordService(RecordRepository recordRepository, PatientRepository patientRepository, AppointmentRepository appointmentRepository) {
        this.recordRepository = recordRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public RecordResponseDTO getRecordById(Long id) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Record not found with ID: " + id));

        return RecordMapper.toResponseDTO(record);
    }

    public List<RecordResponseDTO> getAllRecords() {
        List<Record> records = recordRepository.findAll();
        return records.stream().map(RecordMapper::toResponseDTO).toList();
    }

    public RecordResponseDTO createRecord(RecordRequestDTO recordRequestDTO) {
        Patient patient = patientRepository.findById(recordRequestDTO.getPatientId())
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + recordRequestDTO.getPatientId()));

        Appointment appointment = appointmentRepository.findById(recordRequestDTO.getAppointmentId())
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with ID: " + recordRequestDTO.getAppointmentId()));

        Record record = recordRepository.save(
                RecordMapper.toEntity(recordRequestDTO, patient, appointment)
        );
        return RecordMapper.toResponseDTO(record);
    }

    public RecordResponseDTO updateRecordById(Long id, RecordRequestDTO recordRequestDTO) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Record not found with ID: " + id));

        record.setDiagnosis(recordRequestDTO.getDiagnosis());
        record.setNotes(recordRequestDTO.getNotes());
        record.setTreatmentPlan(recordRequestDTO.getTreatmentPlan());

        Record updatedRecord = recordRepository.save(record);
        return RecordMapper.toResponseDTO(updatedRecord);
    }

    public void deleteRecordById(Long id) {
        recordRepository.deleteById(id);
    }


    // ----------------------------- custom --------------------------------

    public List<RecordResponseDTO> getRecordsByPatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id));

        List<Record> records = patient.getRecords();
        return records.stream().map(RecordMapper::toResponseDTO).toList();
    }

}
