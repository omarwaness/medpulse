'use client'

import { useEffect, useState } from 'react'
import { Loader2, Search, Settings2, UserX } from 'lucide-react'

import AppointmentService from '@/services/AppointmentService'
import { AppointmentStatus } from '../types/enums/appointment-status'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface AppointmentResponse {
  appointmentId: number
  patientId: number
  patientName: string
  appointmentDateTime: string
  reasonForVisit: string
  status: AppointmentStatus
}

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | null>(
    null
  )

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const data = await AppointmentService.getAllAppointments()
      setAppointments(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load appointments.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  // 🔎 Filtering
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patientName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getVariant = (status: string) => {
    if (status === 'COMPLETED') return 'outline'
    if (status === 'CANCELLED') return 'destructive'
    return 'secondary'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500">Loading appointment history...</p>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <div className="space-y-6">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by patient name..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dialog */}
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="outline">
                <Settings2 className="mr-2 h-4 w-4" />
                Filters
              </Button>
            }
          />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Appointments</DialogTitle>
              <DialogDescription>
                Filter appointment history by status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <p className="font-medium text-sm">Appointment Status</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(AppointmentStatus).map(status => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </Button>
                ))}
                <Button variant="ghost" onClick={() => setStatusFilter(null)}>
                  Clear
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table List */}
      {filteredAppointments.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="p-4">Appointment ID</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map(app => (
                <tr
                  key={app.appointmentId}
                  className="border-t hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium">{app.appointmentId}</td>
                  <td className="p-4">{app.patientName}</td>
                  <td className="p-4">
                    {new Date(app.appointmentDateTime).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <Badge variant={getVariant(app.status)}>{app.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <UserX className="h-12 w-12 text-slate-300 mb-2" />
          <p className="text-slate-500 font-medium">
            No appointment history found
          </p>
        </div>
      )}
    </div>
  )
}
