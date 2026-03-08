import { AppointmentStatus } from "./enums/appointment-status";

// =======================
// Appointment Request DTO
// =======================
export interface AppointmentRequest {
  patientId: number;            // int64 -> number
  appointmentDateTime: string;  // ISO date-time string (e.g., 2026-02-15T10:30:00)
  reasonForVisit: string;       // 0 - 500 characters
  status: AppointmentStatus;               // enum/string from backend
}

// =======================
// Appointment Response DTO
// =======================
export interface AppointmentResponse {
  appointmentId: number;        // int64 -> number
  patientId: number;
  patientName: string;
  appointmentDateTime: string;  // ISO date-time string
  reasonForVisit: string;
  status: AppointmentStatus;
}
