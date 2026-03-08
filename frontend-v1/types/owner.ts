
// =======================
// Owner Request DTO
// =======================
export interface OwnerRequest {
  firstName: string;   // 0 - 100 characters
  lastName: string;    // 0 - 100 characters
  phone: string;       // 0 - 20 characters
  email: string;       // email format, 0 - 100 characters
  address: string;     // 0 - 255 characters
}

// =======================
// Owner Response DTO
// =======================
export interface OwnerResponse {
  ownerId: number;     // int64 -> number
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}
