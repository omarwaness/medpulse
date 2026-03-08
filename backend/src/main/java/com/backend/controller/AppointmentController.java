package com.backend.controller;

import com.backend.dto.AppointmentRequestDTO;
import com.backend.dto.AppointmentResponseDTO;
import com.backend.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@Tag(name = "Appointment", description = "API for managing Appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Appointment by id")
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(@PathVariable Long id) {
        AppointmentResponseDTO appointmentResponseDTO = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok().body(appointmentResponseDTO);
    }

    @GetMapping
    @Operation(summary = "Get all Appointments")
    public ResponseEntity<List<AppointmentResponseDTO>> getAllAppointments() {
        List<AppointmentResponseDTO> appointmentResponseDTOs = appointmentService.getAllAppointments();
        return ResponseEntity.ok().body(appointmentResponseDTOs);
    }

    @PostMapping
    @Operation(summary = "Create a new Appointment")
    public ResponseEntity<AppointmentResponseDTO> createAppointment(@Validated @RequestBody AppointmentRequestDTO appointmentRequestDTO) {
        AppointmentResponseDTO appointmentResponseDTO = appointmentService.createAppointment(appointmentRequestDTO);
        return ResponseEntity.ok().body(appointmentResponseDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a Appointment")
    public ResponseEntity<AppointmentResponseDTO> updateAppointment(@PathVariable Long id, @Validated @RequestBody AppointmentRequestDTO appointmentDTO) {
        AppointmentResponseDTO appointmentResponseDTO = appointmentService.updateAppointment(id, appointmentDTO);
        return ResponseEntity.ok().body(appointmentResponseDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a Appointment")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/today")
    @Operation(summary = "Get today's Appointments")
    public ResponseEntity<List<AppointmentResponseDTO>> getTodayAppointments() {
        List<AppointmentResponseDTO> appointmentResponseDTOs = appointmentService.getTodayAppointments();
        return ResponseEntity.ok().body(appointmentResponseDTOs);
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming Appointments")
    public ResponseEntity<List<AppointmentResponseDTO>> getUpcomingAppointments() {
        List<AppointmentResponseDTO> appointmentResponseDTOs = appointmentService.getUpcomingAppointments();
        return ResponseEntity.ok().body(appointmentResponseDTOs);
    }

    @GetMapping("/week")
    @Operation(summary = "Get this week's Appointments (Sunday to Saturday)")
    public ResponseEntity<List<AppointmentResponseDTO>> getWeekAppointments() {
        List<AppointmentResponseDTO> appointmentResponseDTOs = appointmentService.getWeekAppointments();
        return ResponseEntity.ok().body(appointmentResponseDTOs);
    }

}
