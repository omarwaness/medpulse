
// =======================
// Record Request DTO
// =======================
export interface RecordRequest {
  patientId: number;          // int64 -> number
  appointmentId: number;      // int64 -> number
  visitDate: string;          // ISO date string (YYYY-MM-DD)
  diagnosis: string;          // 0 - 500 characters
  treatmentPlan: string;      // 0 - 1000 characters
  notes: string;              // 0 - 2000 characters
}

// =======================
// Record Response DTO
// =======================
export interface RecordResponse {
  recordId: number;           // int64 -> number
  patientId: number;
  patientName: string;
  appointmentId: number;
  visitDate: string;          // ISO date string
  diagnosis: string;
  treatmentPlan: string;
  notes: string;
}
