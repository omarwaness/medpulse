// services/BillingService.ts

import api from "./api";
import { BillingRequest, BillingResponse } from "../types/billing";

// Base URL for all billing endpoints
const BASE_URL = "/billings";

class BillingService {
  // Get billing by ID
  static async getBilling(id: number): Promise<BillingResponse> {
    const { data } = await api.get<BillingResponse>(`${BASE_URL}/${id}`);
    return data;
  }

  // Update billing by ID
  static async updateBilling(id: number, payload: BillingRequest): Promise<BillingResponse> {
    const { data } = await api.put<BillingResponse>(`${BASE_URL}/${id}`, payload);
    return data;
  }

  // Delete billing by ID
  static async deleteBilling(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  }

  // Get all billings
  static async getAllBillings(): Promise<BillingResponse[]> {
    const { data } = await api.get<BillingResponse[]>(BASE_URL);
    return data;
  }

  // Create new billing
  static async createBilling(payload: BillingRequest): Promise<BillingResponse> {
    const { data } = await api.post<BillingResponse>(BASE_URL, payload);
    return data;
  }
}

export default BillingService;
