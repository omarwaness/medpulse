import BillingsList from "@/components/billings-list"

export default function BillingsPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Billings List
          </h1>
          <p className="text-slate-500">
            Manage and view all billings.
          </p>
        </div>
      </header>

      {/* This component handles its own loading and error states */}
      <BillingsList />
    </main>
  )
}