package com.backend.service;

import com.backend.dto.AppointmentRequestDTO;
import com.backend.dto.AppointmentResponseDTO;
import com.backend.dto.mapper.AppointmentMapper;
import com.backend.exception.AppointmentNotFoundException;
import com.backend.exception.PatientNotFoundException;
import com.backend.model.Appointment;
import com.backend.model.Patient;
import com.backend.repository.AppointmentRepository;
import com.backend.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    public AppointmentResponseDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with ID: " + id));

        return AppointmentMapper.toResponseDTO(appointment);
    }

    public List<AppointmentResponseDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream().map(AppointmentMapper::toResponseDTO).toList();
    }

    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO appointmentRequestDTO) {
        Patient patient = patientRepository.findById(appointmentRequestDTO.getPatientId())
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + appointmentRequestDTO.getPatientId()));

        Appointment appointment = appointmentRepository.save(
                AppointmentMapper.toEntity(appointmentRequestDTO, patient)
        );
        return AppointmentMapper.toResponseDTO(appointment);
    }

    public AppointmentResponseDTO updateAppointment(Long id, AppointmentRequestDTO appointmentRequestDTO) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with ID: " + id));

        appointment.setStatus(appointmentRequestDTO.getStatus());
        appointment.setReasonForVisit(appointmentRequestDTO.getReasonForVisit());
        appointment.setAppointmentDateTime(appointmentRequestDTO.getAppointmentDateTime());

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return AppointmentMapper.toResponseDTO(updatedAppointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }


    // ------------------------------ custom ------------------------------------

    public List<AppointmentResponseDTO> getTodayAppointments() {
        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        List<Appointment> todayAppointments = appointmentRepository.findByAppointmentDateTimeBetween(startOfDay, endOfDay);
        return todayAppointments.stream().map(AppointmentMapper::toResponseDTO).toList();
    }

    public List<AppointmentResponseDTO> getUpcomingAppointments() {
        LocalDateTime now = LocalDateTime.now();

        List<Appointment> upcomingAppointments = appointmentRepository.findByAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(now);
        return upcomingAppointments.stream().map(AppointmentMapper::toResponseDTO).toList();
    }

    public List<AppointmentResponseDTO> getWeekAppointments() {

        LocalDate today = LocalDate.now();

        // Get previous or same Sunday
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));

        // Get next or same Saturday
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));

        LocalDateTime startDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endDateTime = endOfWeek.atTime(LocalTime.MAX);

        List<Appointment> weekAppointments =
                appointmentRepository.findByAppointmentDateTimeBetween(startDateTime, endDateTime);

        return weekAppointments.stream()
                .map(AppointmentMapper::toResponseDTO)
                .toList();
    }

}
