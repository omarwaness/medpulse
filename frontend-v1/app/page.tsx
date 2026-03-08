"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format, isSameDay, isSameMonth, parseISO } from "date-fns";
import {
  Cat,
  Clock,
  CreditCard,
  History,
  Sparkles,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import OwnerService from "@/services/OwnerService";
import PatientService from "@/services/PatientService";
import AppointmentService from "@/services/AppointmentService";
import BillingService from "@/services/BillingService";
import RecordService from "@/services/RecordService";

import { OwnerResponse } from "@/types/owner";
import { PatientResponse } from "@/types/patient";
import { AppointmentResponse } from "@/types/appointment";
import { BillingResponse } from "@/types/billing";
import { RecordResponse } from "@/types/record";
import { PaymentStatus } from "@/types/enums/payment-status";

export default function Page() {
  const [owners, setOwners] = useState<OwnerResponse[]>([]);
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<
    AppointmentResponse[]
  >([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    AppointmentResponse[]
  >([]);
  const [billings, setBillings] = useState<BillingResponse[]>([]);
  const [records, setRecords] = useState<RecordResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          ownerData,
          patientData,
          todayData,
          upcomingData,
          billingData,
          recordData,
        ] = await Promise.all([
          OwnerService.getAllOwners(),
          PatientService.getAllPatients(),
          AppointmentService.getTodayAppointments(),
          AppointmentService.getUpcomingAppointments(),
          BillingService.getAllBillings(),
          RecordService.getAllRecords(),
        ]);

        setOwners(ownerData);
        setPatients(patientData);
        setTodayAppointments(todayData);
        setUpcomingAppointments(upcomingData);
        setBillings(billingData);
        setRecords(recordData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
        setError("Something went wrong while loading your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const today = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    const totalOwners = owners.length;
    const totalPatients = patients.length;
    const todaysCount = todayAppointments.length;

    let monthRevenue = 0;
    let outstanding = 0;

    for (const bill of billings) {
      const date = parseISO(bill.paymentDate);
      if (
        isSameMonth(date, today) &&
        bill.paymentStatus === PaymentStatus.PAID
      ) {
        monthRevenue += bill.totalAmount;
      }
      if (bill.paymentStatus === PaymentStatus.PENDING) {
        outstanding += bill.totalAmount;
      }
    }

    const recentRecords = [...records]
      .sort(
        (a, b) =>
          parseISO(b.visitDate).getTime() - parseISO(a.visitDate).getTime(),
      )
      .slice(0, 4);

    return {
      totalOwners,
      totalPatients,
      todaysCount,
      monthRevenue,
      outstanding,
      recentRecords,
    };
  }, [owners, patients, todayAppointments, billings, records, today]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Friendly header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-r from-sky-50 via-indigo-50 to-emerald-50 px-6 py-6 md:px-8 md:py-8">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 translate-x-10 bg-[radial-gradient(circle_at_top,#38bdf8_0,transparent_55%),radial-gradient(circle_at_bottom,#4ade80_0,transparent_55%)] opacity-70 md:block" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-sky-700 shadow-sm ring-1 ring-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>MedPulse overview</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Good to have you back in the clinic.
            </h1>
            <p className="max-w-xl text-sm text-slate-600">
              Here&apos;s a quick look at today&apos;s workload, how your
              patients are doing, and what might need your attention next.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 md:mt-0 md:justify-end">
            <Link href="/schedule">
              <Button variant="default" className="gap-2">
                <Clock className="h-4 w-4" />
                Today&apos;s schedule
              </Button>
            </Link>
            <Link href="/patients">
              <Button variant="outline" className="gap-2 bg-white/70">
                <Cat className="h-4 w-4" />
                View patients
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product-style navigation row */}
      <section className="grid gap-4 md:grid-cols-5">
        {/* Owners */}
        <Link
          href="/owners"
          className="group flex flex-col items-center gap-3 text-center text-sm"
        >
          <div className="relative w-full max-w-[180px] aspect-4/3 rounded-2xl bg-slate-50 shadow-xs ring-1 ring-slate-100 transition duration-200">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#38bdf8_0,transparent_55%),radial-gradient(circle_at_bottom_left,#a855f7_0,transparent_55%)] opacity-70" />
            <div className="relative flex h-full items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm transition-transform duration-200 group-hover:scale-110">
                <User className="h-6 w-6 text-sky-600 transition-colors duration-200 group-hover:text-sky-800" />
              </div>
            </div>
          </div>
          <span className="font-medium text-slate-900">Owners</span>
        </Link>

        {/* Patients */}
        <Link
          href="/patients"
          className="group flex flex-col items-center gap-3 text-center text-sm"
        >
          <div className="relative w-full max-w-[180px] aspect-4/3 rounded-2xl bg-slate-50 shadow-xs ring-1 ring-slate-100 transition duration-200">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#22c55e_0,transparent_55%),radial-gradient(circle_at_bottom_right,#0ea5e9_0,transparent_55%)] opacity-70" />
            <div className="relative flex h-full items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm transition-transform duration-200 group-hover:scale-110">
                <Cat className="h-6 w-6 text-emerald-600 transition-colors duration-200 group-hover:text-emerald-800" />
              </div>
            </div>
          </div>
          <span className="font-medium text-slate-900">Patients</span>
        </Link>

        {/* Schedule */}
        <Link
          href="/schedule"
          className="group flex flex-col items-center gap-3 text-center text-sm"
        >
          <div className="relative w-full max-w-[180px] aspect-4/3 rounded-2xl bg-slate-50 shadow-xs ring-1 ring-slate-100 transition duration-200">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#818cf8_0,transparent_55%),radial-gradient(circle_at_bottom,#22d3ee_0,transparent_55%)] opacity-70" />
            <div className="relative flex h-full items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm transition-transform duration-200 group-hover:scale-110">
                <Clock className="h-6 w-6 text-indigo-600 transition-colors duration-200 group-hover:text-indigo-800" />
              </div>
            </div>
          </div>
          <span className="font-medium text-slate-900">Schedule</span>
        </Link>

        {/* Billings */}
        <Link
          href="/billings"
          className="group flex flex-col items-center gap-3 text-center text-sm"
        >
          <div className="relative w-full max-w-[180px] aspect-4/3 rounded-2xl bg-slate-50 shadow-xs ring-1 ring-slate-100 transition duration-200">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#f97316_0,transparent_55%),radial-gradient(circle_at_bottom_left,#22c55e_0,transparent_55%)] opacity-70" />
            <div className="relative flex h-full items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm transition-transform duration-200 group-hover:scale-110">
                <CreditCard className="h-6 w-6 text-amber-600 transition-colors duration-200 group-hover:text-amber-800" />
              </div>
            </div>
          </div>
          <span className="font-medium text-slate-900">Billings</span>
        </Link>

        {/* History */}
        <Link
          href="/history"
          className="group flex flex-col items-center gap-3 text-center text-sm"
        >
          <div className="relative w-full max-w-[180px] aspect-4/3 rounded-2xl bg-slate-50 shadow-xs ring-1 ring-slate-100 transition duration-200">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#f97316_0,transparent_55%),radial-gradient(circle_at_bottom_right,#6366f1_0,transparent_55%)] opacity-70" />
            <div className="relative flex h-full items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm transition-transform duration-200 group-hover:scale-110">
                <History className="h-6 w-6 text-slate-700 transition-colors duration-200 group-hover:text-slate-950" />
              </div>
            </div>
          </div>
          <span className="font-medium text-slate-900">History</span>
        </Link>
      </section>

      {/* Main content: schedule + records + quick links */}
      <section className="grid gap-6 lg:grid-cols-[2fr,1.4fr] pt-4">
        {/* --- LEFT COLUMN: Appointments & Overview --- */}
        <div className="grid gap-14 md:grid-cols-2">
          {/* Left Sub-Column: Next 5 appointments */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Coming up next
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your next appointments across the schedule.
            </p>

            <div className="mt-5">
              {loading ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-slate-400">
                  Loading upcoming visits…
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center text-sm text-slate-400">
                  <History className="mb-2 h-7 w-7 opacity-30" />
                  <p>No upcoming appointments on file.</p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {upcomingAppointments.slice(0, 5).map((appt, idx) => {
                    const colors = [
                      "bg-emerald-500",
                      "bg-sky-500",
                      "bg-amber-500",
                      "bg-violet-500",
                      "bg-rose-500",
                    ];
                    return (
                      <li
                        key={appt.appointmentId}
                        className="group flex items-start gap-4 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-slate-50"
                      >
                        <div
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${colors[idx % colors.length]}`}
                        />
                        <div className="flex flex-1 flex-col gap-0.5">
                          <span className="text-sm font-semibold text-slate-900">
                            {appt.patientName}
                          </span>
                          <span className="text-xs leading-relaxed text-slate-500">
                            {appt.reasonForVisit} ·{" "}
                            {isSameDay(
                              parseISO(appt.appointmentDateTime),
                              today,
                            )
                              ? "Today"
                              : format(
                                  parseISO(appt.appointmentDateTime),
                                  "EEE, MMM d",
                                )}{" "}
                            at {format(parseISO(appt.appointmentDateTime), "p")}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="mt-0.5 shrink-0 text-[11px] font-medium opacity-70 transition-opacity group-hover:opacity-100"
                        >
                          {appt.status}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Right Sub-Column: Clinic overview cards */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Clinic overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Key numbers at a glance.
            </p>

            <div className="mt-5 flex flex-col gap-4">
              {/* Registered Owners */}
              <Link
                href="/owners"
                className="group flex items-center gap-5 rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-xs transition-all duration-200 hover:border-slate-200"
              >
                {/* Added group-hover:bg-gray-200 here */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 ring-1 ring-gray-200 transition-all duration-200 group-hover:scale-105 group-hover:bg-gray-200">
                  <User className="h-6 w-6 text-sky-600" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-slate-900">
                    {loading ? "—" : stats.totalOwners} Registered Owners
                  </span>
                  <span className="text-sm text-slate-500">
                    Total pet owners in your clinic
                  </span>
                </div>
              </Link>

              {/* Registered Patients */}
              <Link
                href="/patients"
                className="group flex items-center gap-5 rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-xs transition-all duration-200 hover:border-slate-200"
              >
                {/* Added group-hover:bg-gray-200 here */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 ring-1 ring-gray-200 transition-all duration-200 group-hover:scale-105 group-hover:bg-gray-200">
                  <Cat className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-slate-900">
                    {loading ? "—" : stats.totalPatients} Registered Patients
                  </span>
                  <span className="text-sm text-slate-500">
                    Animals currently under care
                  </span>
                </div>
              </Link>

              {/* Month Revenue */}
              <Link
                href="/billings"
                className="group flex items-center gap-5 rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-xs transition-all duration-200 hover:border-slate-200"
              >
                {/* Added group-hover:bg-gray-200 here */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 ring-1 ring-gray-200 transition-all duration-200 group-hover:scale-105 group-hover:bg-gray-200">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-slate-900">
                    {loading ? "—" : `$${stats.monthRevenue.toFixed(2)}`} Month
                    Revenue
                  </span>
                  <span className="text-sm text-slate-500">
                    Paid invoices this month
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Billing & Quick Actions --- */}
        <div className="flex flex-col gap-4 pt-4">
          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CreditCard className="h-4 w-4 text-amber-600" />
                Billing snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Outstanding balance</span>
                <span className="font-semibold text-slate-900">
                  {loading ? "—" : `$${stats.outstanding.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Paid this month</span>
                <span className="font-semibold text-emerald-700">
                  {loading ? "—" : `$${stats.monthRevenue.toFixed(2)}`}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                  Keep an eye on pending invoices to avoid surprises.
                </span>
                <Link href="/billings">
                  <Button variant="outline" size="sm">
                    Open billings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <p className="text-base font-semibold text-slate-800">
              Quick actions
            </p>
            <Separator className="my-2 mb-4" />
            <div className="grid grid-cols-2 gap-2 pt-0 text-sm">
              <Link href="/owners">
                <Button
                  variant="outline"
                  className="flex h-10 w-full items-center justify-start gap-2 text-left"
                >
                  <User className="h-4 w-4 text-sky-600" />
                  <span>Owners</span>
                </Button>
              </Link>
              <Link href="/patients">
                <Button
                  variant="outline"
                  className="flex h-10 w-full items-center justify-start gap-2 text-left"
                >
                  <Cat className="h-4 w-4 text-emerald-600" />
                  <span>Patients</span>
                </Button>
              </Link>
              <Link href="/schedule">
                <Button
                  variant="outline"
                  className="flex h-10 w-full items-center justify-start gap-2 text-left"
                >
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <span>Schedule</span>
                </Button>
              </Link>
              <Link href="/history">
                <Button
                  variant="outline"
                  className="flex h-10 w-full items-center justify-start gap-2 text-left"
                >
                  <History className="h-4 w-4 text-slate-700" />
                  <span>History</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
