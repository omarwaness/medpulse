// services/OwnerService.ts

import api from "./api";
import { OwnerRequest, OwnerResponse } from "../types/owner";
import { PatientResponse } from "../types/patient";
import { BillingResponse } from "../types/billing";

const BASE_URL = "/owners";


class OwnerService {
  // Get owner by ID
  static async getOwner(id: number): Promise<OwnerResponse> {
    const { data } = await api.get<OwnerResponse>(`${BASE_URL}/${id}`);
    return data;
  }

  // Update owner by ID
  static async updateOwner(id: number, payload: OwnerRequest): Promise<OwnerResponse> {
    const { data } = await api.put<OwnerResponse>(`${BASE_URL}/${id}`, payload);
    return data;
  }

  // Delete owner by ID
  static async deleteOwner(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  }

  // Get all owners
  static async getAllOwners(): Promise<OwnerResponse[]> {
    const { data } = await api.get<OwnerResponse[]>(BASE_URL);
    return data;
  }

  // Create new owner
  static async createOwner(payload: OwnerRequest): Promise<OwnerResponse> {
    const { data } = await api.post<OwnerResponse>(`${BASE_URL}`, payload);
    return data;
  }

  // Get all patients of an owner
  static async getOwnerPatients(id: number): Promise<PatientResponse[]> {
    const { data } = await api.get<PatientResponse[]>(`${BASE_URL}/${id}/patients`);
    return data;
  }

  // Get all billings of an owner
  static async getOwnerBillings(id: number): Promise<BillingResponse[]> {
    const { data } = await api.get<BillingResponse[]>(`${BASE_URL}/${id}/billings`);
    return data;
  }

  // TODO: fix this
  // Search owner by email or phone
  static async searchOwner(query: string): Promise<OwnerResponse> {
    const { data } = await api.get<OwnerResponse>(`${BASE_URL}/search`, {
      params: { q: query },
    });
    return data;
  }
}

export default OwnerService;
