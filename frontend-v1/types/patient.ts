
// =======================
// Patient Request DTO
// =======================
export interface PatientRequest {
  ownerId: number;        // int64 -> number
  name: string;           // 0 - 100 characters
  species: string;
  breed: string;
  dateOfBirth: string;    // ISO date string (YYYY-MM-DD)
  gender: string;
}

// =======================
// Patient Response DTO
// =======================
export interface PatientResponse {
  patientId: number;      // int64 -> number
  ownerId: number;
  ownerName: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;    // ISO date string
  gender: string;
}
