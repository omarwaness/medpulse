"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  format,
  parseISO,
  startOfWeek,
  addDays,
  setHours,
  setMinutes,
} from "date-fns";
import { CalendarDays, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import AppointmentService from "@/services/AppointmentService";
import { AppointmentResponse, AppointmentRequest } from "@/types/appointment";
import { AppointmentStatus } from "@/types/enums/appointment-status";

type TimeSlot = {
  label: string;
  startMinutes: number;
};

const START_HOUR = 8;
const END_HOUR = 18;
const SLOT_DURATION_MINUTES = 30;

function buildTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (
    let minutes = START_HOUR * 60;
    minutes < END_HOUR * 60;
    minutes += SLOT_DURATION_MINUTES
  ) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const label = `${String(hours).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0",
    )}`;
    slots.push({ label, startMinutes: minutes });
  }
  return slots;
}

const TIME_SLOTS = buildTimeSlots();

export default function CalendarSchedule() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [patientId, setPatientId] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");

  const weekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    [],
  );

  const daysOfWeek = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AppointmentService.getWeekAppointments();
        setAppointments(data);
      } catch (e) {
        console.error("Failed to load appointments", e);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const appointmentsBySlot = useMemo(() => {
    const map = new Map<string, AppointmentResponse[]>();

    for (const appt of appointments) {
      const date = parseISO(appt.appointmentDateTime);
      const key = format(date, "yyyy-MM-dd-HH-mm");
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(appt);
    }

    return map;
  }, [appointments]);

  const handleSlotClick = (day: Date, slot: TimeSlot) => {
    const slotDate = setMinutes(
      setHours(day, Math.floor(slot.startMinutes / 60)),
      slot.startMinutes % 60,
    );
    setSelectedSlot(slotDate);
    setPatientId("");
    setReasonForVisit("");
    setCreateError(null);
    setCreateOpen(true);
  };

  const handleCreateAppointment = async () => {
    if (!selectedSlot) return;

    setCreating(true);
    setCreateError(null);

    try {
      const parsedPatientId = parseInt(patientId, 10);
      if (Number.isNaN(parsedPatientId) || parsedPatientId <= 0) {
        setCreateError("Please enter a valid patient ID");
        setCreating(false);
        return;
      }

      if (!reasonForVisit.trim()) {
        setCreateError("Please provide a reason for visit");
        setCreating(false);
        return;
      }

      const payload: AppointmentRequest = {
        patientId: parsedPatientId,
        appointmentDateTime: format(selectedSlot, "yyyy-MM-dd'T'HH:mm:ss"),
        reasonForVisit: reasonForVisit.trim(),
        status: AppointmentStatus.SCHEDULED,
      };

      const created = await AppointmentService.createAppointment(payload);
      setAppointments((prev) => [...prev, created]);
      setCreateOpen(false);
      setSelectedSlot(null);
      setPatientId("");
      setReasonForVisit("");
    } catch (e) {
      console.error("Failed to create appointment", e);
      setCreateError("Failed to create appointment");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-slate-500" />
          <CardTitle className="text-lg font-semibold">
            Weekly Schedule
          </CardTitle>
        </div>
        <div className="text-sm text-slate-500">
          {format(weekStart, "MMM d")} –{" "}
          {format(addDays(weekStart, 6), "MMM d, yyyy")}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <ScrollArea className="h-[600px] w-full">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b bg-slate-50 text-xs font-medium text-slate-600">
              <div className="p-2 text-right pr-3">Time</div>
              {daysOfWeek.map((day) => (
                <div
                  key={day.toISOString()}
                  className="border-l p-2 text-center"
                >
                  <div>{format(day, "EEE")}</div>
                  <div className="text-[11px] text-slate-400">
                    {format(day, "MMM d")}
                  </div>
                </div>
              ))}
            </div>
            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                Loading appointments...
              </div>
            ) : (
              <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] text-xs">
                {TIME_SLOTS.map((slot) => (
                  <React.Fragment key={slot.label}>
                    <div className="border-b p-2 pr-3 text-right text-slate-400">
                      {slot.label}
                    </div>
                    {daysOfWeek.map((day) => {
                      const slotDate = setMinutes(
                        setHours(day, Math.floor(slot.startMinutes / 60)),
                        slot.startMinutes % 60,
                      );
                      const key = format(slotDate, "yyyy-MM-dd-HH-mm");
                      const slotAppointments =
                        appointmentsBySlot.get(key) ?? [];

                      return (
                        <button
                          key={day.toISOString() + slot.label}
                          type="button"
                          onClick={() => handleSlotClick(day, slot)}
                          className="group relative flex min-h-[40px] w-full items-start justify-start border-l border-b bg-white px-1 py-1 text-left hover:bg-slate-50"
                        >
                          {slotAppointments.length === 0 ? (
                            <span className="flex items-center gap-1 text-[10px] text-slate-300 opacity-0 group-hover:opacity-100">
                              <Plus className="h-3 w-3" />
                              New
                            </span>
                          ) : (
                            <div className="flex w-full flex-col gap-1">
                              {slotAppointments.map((appt) => (
                                <div
                                  key={appt.appointmentId}
                                  className="rounded-md bg-emerald-50 px-1.5 py-1 text-[11px] text-emerald-900 ring-1 ring-emerald-200"
                                >
                                  <div className="font-medium">
                                    {appt.patientName}
                                  </div>
                                  <div className="text-[10px] text-emerald-800">
                                    {appt.reasonForVisit}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>
              Create a new 30-minute appointment in the selected time slot.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="appointment-slot">Selected time</FieldLabel>
              <div className="text-sm text-slate-600">
                {selectedSlot
                  ? `${format(selectedSlot, "EEEE, MMM d, yyyy 'at' HH:mm")}`
                  : "No slot selected"}
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="appointment-patient-id">
                Patient ID
              </FieldLabel>
              <Input
                id="appointment-patient-id"
                type="number"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
              />
              <FieldDescription>
                Use the numeric ID of an existing patient.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="appointment-reason">
                Reason for visit
              </FieldLabel>
              <Textarea
                id="appointment-reason"
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                placeholder="Describe the reason for the appointment"
                rows={3}
              />
            </Field>
          </FieldGroup>
          {createError && (
            <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createError}
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="button"
              onClick={handleCreateAppointment}
              disabled={creating || !selectedSlot}
            >
              {creating ? "Creating..." : "Create appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
