import PatientList from '@/components/patient-list'

export default function PatientsPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Patients Directory
          </h1>
          <p className="text-slate-500">
            Manage and view all registered patients.
          </p>
        </div>
      </header>

      {/* This component handles its own loading and error states */}
      <PatientList />
    </main>
  )
}