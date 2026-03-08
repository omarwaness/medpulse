'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  PawPrint,
  VenusAndMars,
  Loader2,
  Search,
  UserX,
  Settings2
} from 'lucide-react'

import PatientService from '@/services/PatientService'
import { PatientResponse } from '@/types/patient'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export function PatientCard({ patient }: { patient: PatientResponse }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">{patient.name}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
          {patient.name[0]}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-2">
        <div className="text-sm text-slate-500">
          Owner: <span className="font-medium">{patient.ownerName}</span>
        </div>

        <div className="flex items-center gap-2">
          <PawPrint className="h-4 w-4 text-green-500" />
          <span>
            {patient.species} - {patient.breed}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <VenusAndMars className="h-4 w-4 text-green-500" />
          <span>{patient.gender}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-green-500" />
          <span>{patient.dateOfBirth}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/patients/${patient.patientId}`} className="w-full">
        <Button variant="secondary" className="w-full cursor-pointer">
          View Profile
        </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function PatientList() {
  const [patients, setPatients] = useState<PatientResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState<string | null>(null)

  const loadPatients = async () => {
    try {
      setLoading(true)
      const data = await PatientService.getAllPatients()
      setPatients(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load patients.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  // 🔍 Search by patient name + optional gender filter
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    const matchesGender = !genderFilter || p.gender === genderFilter

    return matchesSearch && matchesGender
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="text-slate-500">Loading patients...</p>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <div className="space-y-6">
      {/* Search + Filter + Add */}
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

        <div className="flex gap-2 w-full sm:w-auto">
          {/* ⚙️ Filter Button */}
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              }
            />

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Patients</DialogTitle>
                <DialogDescription>
                  Filter patients by gender.
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-2">
                <Button
                  variant={genderFilter === 'Male' ? 'default' : 'outline'}
                  onClick={() => setGenderFilter('Male')}
                >
                  Male
                </Button>
                <Button
                  variant={genderFilter === 'Female' ? 'default' : 'outline'}
                  onClick={() => setGenderFilter('Female')}
                >
                  Female
                </Button>
                <Button variant="ghost" onClick={() => setGenderFilter(null)}>
                  Clear
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Results Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard key={patient.patientId} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <UserX className="h-12 w-12 text-slate-300 mb-2" />
          <p className="text-slate-500 font-medium">
            No results for {searchQuery}
          </p>
        </div>
      )}
    </div>
  )
}
