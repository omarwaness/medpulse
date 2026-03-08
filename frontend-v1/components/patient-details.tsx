'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { PawPrint, CalendarClock, ClipboardList, User, Plus } from 'lucide-react'
import { format, parseISO } from 'date-fns'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import PatientService from '@/services/PatientService'
import AppointmentService from '@/services/AppointmentService'
import RecordService from '@/services/RecordService'
import { PatientResponse } from '@/types/patient'
import { AppointmentRequest, AppointmentResponse } from '@/types/appointment'
import { RecordRequest, RecordResponse } from '@/types/record'
import { AppointmentStatus } from '@/types/enums/appointment-status'

interface PatientDetailsProps {
  patientId: string
}

const getStatusVariant = (status: AppointmentStatus | string) => {
  const value = typeof status === 'string' ? status.toUpperCase() : status

  switch (value) {
    case AppointmentStatus.COMPLETED:
      return 'default'
    case AppointmentStatus.SCHEDULED:
      return 'secondary'
    case AppointmentStatus.CANCELLED:
    case AppointmentStatus.NO_SHOW:
      return 'destructive'
    default:
      return 'outline'
  }
}

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const id = parseInt(patientId)

  const [patient, setPatient] = useState<PatientResponse | null>(null)
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([])
  const [records, setRecords] = useState<RecordResponse[]>([])
  const [loading, setLoading] = useState(true)

  const [addApptOpen, setAddApptOpen] = useState(false)
  const [addApptDateTime, setAddApptDateTime] = useState('')
  const [addApptReason, setAddApptReason] = useState('')
  const [addingAppt, setAddingAppt] = useState(false)
  const [addApptError, setAddApptError] = useState('')

  const [recordDialogOpen, setRecordDialogOpen] = useState(false)
  const [recordDialogMode, setRecordDialogMode] = useState<'create' | 'edit'>(
    'create'
  )
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null)
  const [recordAppointmentId, setRecordAppointmentId] = useState<number | null>(
    null
  )
  const [recordVisitDate, setRecordVisitDate] = useState('')
  const [recordDiagnosis, setRecordDiagnosis] = useState('')
  const [recordTreatmentPlan, setRecordTreatmentPlan] = useState('')
  const [recordNotes, setRecordNotes] = useState('')
  const [savingRecord, setSavingRecord] = useState(false)
  const [recordDialogError, setRecordDialogError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [patientData, appointmentsData, recordsData] =
          await Promise.all([
            PatientService.getPatient(id),
            PatientService.getPatientAppointments(id),
            PatientService.getPatientRecords(id)
          ])

        setPatient(patientData)
        setAppointments(appointmentsData)
        setRecords(recordsData)
      } catch (error) {
        console.error('Failed to load patient details', error)
      } finally {
        setLoading(false)
      }
    }

    if (!Number.isNaN(id)) {
      loadData()
    }
  }, [id])

  const appointmentMap = useMemo(() => {
    const map = new Map<number, AppointmentResponse>()
    appointments.forEach(a => {
      map.set(a.appointmentId, a)
    })
    return map
  }, [appointments])

  const openAddRecordForAppointment = (appointmentId: number) => {
    const appt = appointmentMap.get(appointmentId)
    setRecordDialogMode('create')
    setEditingRecordId(null)
    setRecordAppointmentId(appointmentId)
    if (appt) {
      // default visitDate from appointment date
      const d = parseISO(appt.appointmentDateTime)
      setRecordVisitDate(format(d, 'yyyy-MM-dd'))
    } else {
      setRecordVisitDate('')
    }
    setRecordDiagnosis('')
    setRecordTreatmentPlan('')
    setRecordNotes('')
    setRecordDialogError('')
    setRecordDialogOpen(true)
  }

  const openEditRecord = (record: RecordResponse) => {
    setRecordDialogMode('edit')
    setEditingRecordId(record.recordId)
    setRecordAppointmentId(record.appointmentId)
    setRecordVisitDate(record.visitDate?.slice(0, 10) ?? '')
    setRecordDiagnosis(record.diagnosis || '')
    setRecordTreatmentPlan(record.treatmentPlan || '')
    setRecordNotes(record.notes || '')
    setRecordDialogError('')
    setRecordDialogOpen(true)
  }

  const handleAddAppointment = async () => {
    setAddingAppt(true)
    setAddApptError('')

    try {
      if (!addApptDateTime) {
        setAddApptError('Please select date and time')
        setAddingAppt(false)
        return
      }

      if (!addApptReason.trim()) {
        setAddApptError('Please enter a reason for visit')
        setAddingAppt(false)
        return
      }

      const parsed = new Date(addApptDateTime)
      if (Number.isNaN(parsed.getTime())) {
        setAddApptError('Invalid date and time format')
        setAddingAppt(false)
        return
      }

      const payload: AppointmentRequest = {
        patientId: id,
        appointmentDateTime: format(parsed, "yyyy-MM-dd'T'HH:mm:ss"),
        reasonForVisit: addApptReason.trim(),
        status: AppointmentStatus.SCHEDULED
      }

      const created = await AppointmentService.createAppointment(payload)
      setAppointments(prev => [...prev, created])

      setAddApptDateTime('')
      setAddApptReason('')
      setAddApptOpen(false)
    } catch (error) {
      console.error('Failed to create appointment', error)
      setAddApptError('Failed to create appointment')
    } finally {
      setAddingAppt(false)
    }
  }

  const handleSaveRecord = async () => {
    setSavingRecord(true)
    setRecordDialogError('')

    try {
      if (!recordAppointmentId) {
        setRecordDialogError('Missing appointment')
        setSavingRecord(false)
        return
      }

      if (!recordVisitDate) {
        setRecordDialogError('Please select a visit date')
        setSavingRecord(false)
        return
      }

      if (!recordDiagnosis.trim()) {
        setRecordDialogError('Please enter a diagnosis')
        setSavingRecord(false)
        return
      }

      const payload: RecordRequest = {
        patientId: id,
        appointmentId: recordAppointmentId,
        visitDate: recordVisitDate,
        diagnosis: recordDiagnosis.trim(),
        treatmentPlan: recordTreatmentPlan.trim(),
        notes: recordNotes.trim()
      }

      if (recordDialogMode === 'edit' && editingRecordId) {
        const updated = await RecordService.updateRecord(
          editingRecordId,
          payload
        )
        setRecords(prev =>
          prev.map(r => (r.recordId === updated.recordId ? updated : r))
        )
      } else {
        const created = await RecordService.createRecord(payload)
        setRecords(prev => [...prev, created])
      }

      setRecordDialogOpen(false)
      setEditingRecordId(null)
      setRecordAppointmentId(null)
      setRecordVisitDate('')
      setRecordDiagnosis('')
      setRecordTreatmentPlan('')
      setRecordNotes('')
    } catch (error) {
      console.error('Failed to save record', error)
      setRecordDialogError('Failed to save record')
    } finally {
      setSavingRecord(false)
    }
  }

  if (loading) {
    return <div>Loading patient details...</div>
  }

  if (!patient) {
    return <div>Patient not found.</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* TOP: Patient Info */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <PawPrint className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {patient.name}
              </CardTitle>
              <p className="text-sm text-slate-500">
                Patient ID #{patient.patientId} • Owner: {patient.ownerName}
              </p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Species / Breed
              </p>
              <p className="text-sm font-medium">
                {patient.species} • {patient.breed}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PawPrint className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Gender
              </p>
              <p className="text-sm font-medium">{patient.gender}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarClock className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Date of Birth
              </p>
              <p className="text-sm font-medium">
                {patient.dateOfBirth
                  ? format(parseISO(patient.dateOfBirth), 'PPP')
                  : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Summary
              </p>
              <p className="text-sm font-medium text-slate-600">
                {appointments.length} appointments • {records.length} records
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BOTTOM: Appointments with linked records */}
      <Card className="w-full border-slate-200 bg-slate-50/60">
        <CardHeader className="flex flex-col gap-2 border-b border-dashed border-slate-200 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Appointments &amp; medical records
              </CardTitle>
              <p className="text-xs text-slate-500">
                Manage this patient&apos;s appointments and open their linked records from the list.
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={addApptOpen} onOpenChange={setAddApptOpen}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddApptOpen(true)}
                >
                  <Plus className="mr-1 h-3 w-3" /> New appointment
                </Button>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>New appointment</DialogTitle>
                    <DialogDescription>
                      Schedule a new appointment for this patient.
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="appt-datetime">
                        Date &amp; time
                      </FieldLabel>
                      <Input
                        id="appt-datetime"
                        type="datetime-local"
                        value={addApptDateTime}
                        onChange={e => setAddApptDateTime(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="appt-reason">
                        Reason for visit
                      </FieldLabel>
                      <Textarea
                        id="appt-reason"
                        rows={3}
                        value={addApptReason}
                        onChange={e => setAddApptReason(e.target.value)}
                        placeholder="Describe the reason for the appointment"
                      />
                    </Field>
                  </FieldGroup>
                  {addApptError && (
                    <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {addApptError}
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose
                      render={
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      }
                    />
                    <Button
                      type="button"
                      onClick={handleAddAppointment}
                      disabled={addingAppt}
                    >
                      {addingAppt ? 'Creating...' : 'Create appointment'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRecordDialogMode('create')
                    setEditingRecordId(null)
                    setRecordAppointmentId(null)
                    setRecordVisitDate('')
                    setRecordDiagnosis('')
                    setRecordTreatmentPlan('')
                    setRecordNotes('')
                    setRecordDialogError('')
                    setRecordDialogOpen(true)
                  }}
                >
                  <Plus className="mr-1 h-3 w-3" /> New record
                </Button>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {recordDialogMode === 'edit'
                        ? 'Edit medical record'
                        : 'New medical record'}
                    </DialogTitle>
                    <DialogDescription>
                      {recordDialogMode === 'edit'
                        ? 'Update the medical record details for this appointment.'
                        : 'Create a record and link it to an appointment.'}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <Field>
                        <FieldLabel htmlFor="record-appointment-id">
                          Appointment ID
                        </FieldLabel>
                        <Input
                          id="record-appointment-id"
                          type="number"
                          value={recordAppointmentId ?? ''}
                          onChange={e =>
                            setRecordAppointmentId(
                              e.target.value
                                ? parseInt(e.target.value, 10)
                                : null
                            )
                          }
                          placeholder="Link to appointment ID"
                        />
                        <FieldDescription>
                          You can copy the ID from the appointments list.
                        </FieldDescription>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="record-visit-date">
                          Visit date
                        </FieldLabel>
                        <Input
                          id="record-visit-date"
                          type="date"
                          value={recordVisitDate}
                          onChange={e => setRecordVisitDate(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="record-diagnosis">
                          Diagnosis
                        </FieldLabel>
                        <Textarea
                          id="record-diagnosis"
                          rows={4}
                          value={recordDiagnosis}
                          onChange={e => setRecordDiagnosis(e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="space-y-4">
                      <Field>
                        <FieldLabel htmlFor="record-treatment">
                          Treatment plan
                        </FieldLabel>
                        <Textarea
                          id="record-treatment"
                          rows={5}
                          value={recordTreatmentPlan}
                          onChange={e =>
                            setRecordTreatmentPlan(e.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="record-notes">
                          Notes
                        </FieldLabel>
                        <Textarea
                          id="record-notes"
                          rows={5}
                          value={recordNotes}
                          onChange={e => setRecordNotes(e.target.value)}
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                  {recordDialogError && (
                    <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {recordDialogError}
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose
                      render={
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      }
                    />
                    <Button
                      type="button"
                      onClick={handleSaveRecord}
                      disabled={savingRecord}
                    >
                      {savingRecord
                        ? 'Saving...'
                        : recordDialogMode === 'edit'
                        ? 'Save changes'
                        : 'Create record'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-white shadow-xs">
            <ScrollArea className="h-[320px] w-full">
              {appointments.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 border-b bg-slate-50">
                    <tr className="text-left text-xs uppercase text-slate-500">
                      <th className="p-3">Date &amp; Time</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Record</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appointment => {
                      const relatedRecord = records.find(
                        record =>
                          record.appointmentId === appointment.appointmentId
                      )

                      return (
                        <tr
                          key={appointment.appointmentId}
                          className="border-t transition-colors hover:bg-slate-50"
                        >
                          <td className="p-3 text-slate-700">
                            {format(
                              parseISO(appointment.appointmentDateTime),
                              'PPP p'
                            )}
                          </td>
                          <td className="p-3 text-slate-700">
                            {appointment.reasonForVisit}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={getStatusVariant(appointment.status)}
                            >
                              {appointment.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-600">
                            {relatedRecord ? (
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                className="border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                onClick={() => openEditRecord(relatedRecord)}
                              >
                                Linked record #{relatedRecord.recordId}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                onClick={() =>
                                  openAddRecordForAppointment(
                                    appointment.appointmentId
                                  )
                                }
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                Add record
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center py-10 text-slate-400">
                  <CalendarClock className="mb-2 h-8 w-8 opacity-30" />
                  <p>No appointments found for this patient.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

