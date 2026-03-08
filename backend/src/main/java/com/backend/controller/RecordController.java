package com.backend.controller;

import com.backend.dto.RecordRequestDTO;
import com.backend.dto.RecordResponseDTO;
import com.backend.service.RecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/records")
@Tag(name = "Record", description = "API for managing Records")
public class RecordController {
    private final RecordService recordService;

    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Record by id")
    public ResponseEntity<RecordResponseDTO> getRecordById(@PathVariable Long id) {
        RecordResponseDTO record = recordService.getRecordById(id);
        return ResponseEntity.ok().body(record);
    }

    @GetMapping
    @Operation(summary = "Get all Records")
    public ResponseEntity<List<RecordResponseDTO>> getAllRecords() {
        List<RecordResponseDTO> records = recordService.getAllRecords();
        return ResponseEntity.ok().body(records);
    }

    @PostMapping
    @Operation(summary = "Create a new Record")
    public ResponseEntity<RecordResponseDTO> createRecord(@Validated @RequestBody RecordRequestDTO record) {
        RecordResponseDTO recordCreated = recordService.createRecord(record);
        return ResponseEntity.ok().body(recordCreated);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a Record")
    public ResponseEntity<RecordResponseDTO> updateRecord(@PathVariable Long id, @Validated @RequestBody RecordRequestDTO record) {
        RecordResponseDTO recordResponseDTO = recordService.updateRecordById(id, record);
        return ResponseEntity.ok().body(recordResponseDTO);
    }


    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a Record")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        recordService.deleteRecordById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "get all Records related to patient")
    public ResponseEntity<List<RecordResponseDTO>> getPatientRecords(@PathVariable Long patientId) {
        List<RecordResponseDTO> records = recordService.getRecordsByPatient(patientId);
        return ResponseEntity.ok().body(records);
    }

}
