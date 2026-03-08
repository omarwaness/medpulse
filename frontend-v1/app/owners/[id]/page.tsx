import OwnerDetails  from '@/components/owner-details'

export default async function OwnerDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // In Next.js 15+, params is a Promise
  const { id } = await params

  return (
    <main className="container mx-auto py-10 px-4">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Owner
          </h1>
          <p className="text-slate-500">Viewing details for Owner ID: {id}</p>
        </div>
      </header>

      <OwnerDetails ownerId={id} />
    </main>
  )
}
