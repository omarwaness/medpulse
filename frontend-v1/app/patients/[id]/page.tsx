import PatientDetails from '@/components/patient-details'

export default async function PatientDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // In Next.js 15+, params is a Promise
  const { id } = await params

  return (
    <main className="container mx-auto py-10 px-4">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Patient
          </h1>
          <p className="text-slate-500">
            Viewing details for Patient ID: {id}
          </p>
        </div>
      </header>

      <PatientDetails patientId={id} />
    </main>
  )
}
