package com.backend.controller;

import com.backend.dto.AppointmentResponseDTO;
import com.backend.dto.PatientRequestDTO;
import com.backend.dto.PatientResponseDTO;
import com.backend.dto.RecordResponseDTO;
import com.backend.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@Tag(name = "Patient", description = "API for managing Patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Patient by id")
    public ResponseEntity<PatientResponseDTO> getPatientById(@PathVariable Long id) {
        PatientResponseDTO patient = patientService.getPatientById(id);
        return ResponseEntity.ok().body(patient);
    }

    @GetMapping
    @Operation(summary = "Get all Patients")
    public ResponseEntity<List<PatientResponseDTO>> getPatients() {
        List<PatientResponseDTO> patients = patientService.getAllPatients();
        return ResponseEntity.ok().body(patients);
    }

    @PostMapping
    @Operation(summary = "Create a new Patients")
    public ResponseEntity<PatientResponseDTO> createPatient(@Validated @RequestBody PatientRequestDTO patientRequestDTO) {
        PatientResponseDTO patient = patientService.createPatient(patientRequestDTO);
        return ResponseEntity.ok().body(patient);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a Patients")
    public ResponseEntity<PatientResponseDTO> updatePatient(@PathVariable Long id, @Validated @RequestBody PatientRequestDTO patientRequestDTO) {
        PatientResponseDTO patient = patientService.updatePatient(id, patientRequestDTO);
        return ResponseEntity.ok().body(patient);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a Patients")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/appointments")
    @Operation(summary = "Get Patient's Appointments")
    public ResponseEntity<List<AppointmentResponseDTO>> getPatientAppointments(@PathVariable Long id) {
        List<AppointmentResponseDTO> appointments = patientService.getAppointmentsByPatientId(id);
        return ResponseEntity.ok().body(appointments);
    }

    @GetMapping("/{id}/records")
    @Operation(summary = "Get Patient's Records")
    public ResponseEntity<List<RecordResponseDTO>> getPatientRecords(@PathVariable Long id) {
        List<RecordResponseDTO> records = patientService.getRecordsByPatientId(id);
        return ResponseEntity.ok().body(records);
    }

}
