package com.backend.service;

import com.backend.dto.AppointmentResponseDTO;
import com.backend.dto.PatientRequestDTO;
import com.backend.dto.PatientResponseDTO;
import com.backend.dto.RecordResponseDTO;
import com.backend.dto.mapper.AppointmentMapper;
import com.backend.dto.mapper.PatientMapper;
import com.backend.dto.mapper.RecordMapper;
import com.backend.exception.OwnerNotFoundExecption;
import com.backend.exception.PatientNotFoundException;
import com.backend.model.Appointment;
import com.backend.model.Owner;
import com.backend.model.Patient;
import com.backend.model.Record;
import com.backend.repository.OwnerRepository;
import com.backend.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final OwnerRepository ownerRepository;

    public PatientService(PatientRepository patientRepository, OwnerRepository ownerRepository) {
        this.patientRepository = patientRepository;
        this.ownerRepository = ownerRepository;
    }

    public PatientResponseDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id));
        return PatientMapper.toResponseDTO(patient);
    }

    public List<PatientResponseDTO> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream().map(PatientMapper::toResponseDTO).toList();
    }

    public PatientResponseDTO createPatient(PatientRequestDTO patientRequestDTO) {
        Owner owner = ownerRepository.findById(patientRequestDTO.getOwnerId())
                .orElseThrow(() -> new OwnerNotFoundExecption("Owner not found with ID: " + patientRequestDTO.getOwnerId()));

        Patient patient = patientRepository.save(
                PatientMapper.toEntity(patientRequestDTO, owner)
        );
        return PatientMapper.toResponseDTO(patient);
    }

    public PatientResponseDTO updatePatient(Long id, PatientRequestDTO patientRequestDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id));

        patient.setName(patientRequestDTO.getName());
        patient.setSpecies(patientRequestDTO.getSpecies());
        patient.setBreed(patientRequestDTO.getBreed());
        patient.setGender(patientRequestDTO.getGender());

        Patient updatedPatient = patientRepository.save(patient);
        return PatientMapper.toResponseDTO(updatedPatient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }


    // --------------------------- custom --------------------------------

    public List<AppointmentResponseDTO> getAppointmentsByPatientId(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id));

        List<Appointment> appointments = patient.getAppointments();
        return appointments.stream().map(AppointmentMapper::toResponseDTO).toList();
    }

    public List<RecordResponseDTO> getRecordsByPatientId(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id));

        List<Record> records = patient.getRecords();
        return records.stream().map(RecordMapper::toResponseDTO).toList();
    }

}
