// services/PatientService.ts

import api from "./api";
import { PatientRequest, PatientResponse } from "../types/patient";
import { RecordResponse } from "../types/record";
import { AppointmentResponse } from "../types/appointment";

// Base URL for all patient endpoints
const BASE_URL = "/patients";

class PatientService {
  // Get patient by ID
  static async getPatient(id: number): Promise<PatientResponse> {
    const { data } = await api.get<PatientResponse>(`${BASE_URL}/${id}`);
    return data;
  }

  // Update patient by ID
  static async updatePatient(id: number, payload: PatientRequest): Promise<PatientResponse> {
    const { data } = await api.put<PatientResponse>(`${BASE_URL}/${id}`, payload);
    return data;
  }

  // Delete patient by ID
  static async deletePatient(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  }

  // Get all patients
  static async getAllPatients(): Promise<PatientResponse[]> {
    const { data } = await api.get<PatientResponse[]>(BASE_URL);
    return data;
  }

  // Create new patient
  static async createPatient(payload: PatientRequest): Promise<PatientResponse> {
    const { data } = await api.post<PatientResponse>(BASE_URL, payload);
    return data;
  }

  // Get all records of a patient
  static async getPatientRecords(id: number): Promise<RecordResponse[]> {
    const { data } = await api.get<RecordResponse[]>(`${BASE_URL}/${id}/records`);
    return data;
  }

  // Get all appointments of a patient
  static async getPatientAppointments(id: number): Promise<AppointmentResponse[]> {
    const { data } = await api.get<AppointmentResponse[]>(`${BASE_URL}/${id}/appointments`);
    return data;
  }
}

export default PatientService;
