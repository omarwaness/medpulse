// services/AppointmentService.ts

import api from './api'
import { AppointmentRequest, AppointmentResponse } from '../types/appointment'

// Base URL for all appointment endpoints
const BASE_URL = '/appointments'

class AppointmentService {
  // Get appointment by ID
  static async getAppointment(id: number): Promise<AppointmentResponse> {
    const { data } = await api.get<AppointmentResponse>(`${BASE_URL}/${id}`)
    return data
  }

  // Update appointment by ID
  static async updateAppointment(
    id: number,
    payload: AppointmentRequest
  ): Promise<AppointmentResponse> {
    const { data } = await api.put<AppointmentResponse>(
      `${BASE_URL}/${id}`,
      payload
    )
    return data
  }

  // Delete appointment by ID
  static async deleteAppointment(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`)
  }

  // Get all appointments
  static async getAllAppointments(): Promise<AppointmentResponse[]> {
    const { data } = await api.get<AppointmentResponse[]>(BASE_URL)
    return data
  }

  // Create new appointment
  static async createAppointment(
    payload: AppointmentRequest
  ): Promise<AppointmentResponse> {
    const { data } = await api.post<AppointmentResponse>(BASE_URL, payload)
    return data
  }

  // Get upcoming appointments
  static async getUpcomingAppointments(): Promise<AppointmentResponse[]> {
    const { data } = await api.get<AppointmentResponse[]>(
      `${BASE_URL}/upcoming`
    )
    return data
  }

  // Get today's appointments
  static async getTodayAppointments(): Promise<AppointmentResponse[]> {
    const { data } = await api.get<AppointmentResponse[]>(`${BASE_URL}/today`)
    return data
  }

  // Get this week's appointments (Sunday → Saturday)
  static async getWeekAppointments(): Promise<AppointmentResponse[]> {
    const { data } = await api.get<AppointmentResponse[]>(`${BASE_URL}/week`)
    return data
  }
}

export default AppointmentService
