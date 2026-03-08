import { PaymentStatus } from "./enums/payment-status";
import { PaymentMethod } from "./enums/payment-method";

// =======================
// Billing Request DTO
// =======================
export interface BillingRequest {
  ownerId: number;          // int64 -> number
  totalAmount: number;      // must be >= 0
  paymentStatus: PaymentStatus;    // enum/string from backend
  paymentDate: string;      // ISO date string (YYYY-MM-DD)
  paymentMethod: PaymentMethod;    // enum/string from backend
}

// =======================
// Billing Response DTO
// =======================
export interface BillingResponse {
  billId: number;           // int64 -> number
  ownerId: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentDate: string;      // ISO date string
  paymentMethod: PaymentMethod;
}
