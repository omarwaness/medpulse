// services/RecordService.ts

import api from "./api";
import { RecordRequest, RecordResponse } from "../types/record";

// Base URL for all record endpoints
const BASE_URL = "/records";

class RecordService {
  // Get record by ID
  static async getRecord(id: number): Promise<RecordResponse> {
    const { data } = await api.get<RecordResponse>(`${BASE_URL}/${id}`);
    return data;
  }

  // Update record by ID
  static async updateRecord(id: number, payload: RecordRequest): Promise<RecordResponse> {
    const { data } = await api.put<RecordResponse>(`${BASE_URL}/${id}`, payload);
    return data;
  }

  // Delete record by ID
  static async deleteRecord(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  }

  // Get all records
  static async getAllRecords(): Promise<RecordResponse[]> {
    const { data } = await api.get<RecordResponse[]>(BASE_URL);
    return data;
  }

  // Create new record
  static async createRecord(payload: RecordRequest): Promise<RecordResponse> {
    const { data } = await api.post<RecordResponse>(BASE_URL, payload);
    return data;
  }

  // Get all records of a specific patient
  static async getRecordsByPatient(patientId: number): Promise<RecordResponse[]> {
    const { data } = await api.get<RecordResponse[]>(`${BASE_URL}/patient/${patientId}`);
    return data;
  }
}

export default RecordService;
