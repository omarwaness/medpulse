'use client'

import { useEffect, useState } from 'react'
import { Loader2, Search, Settings2, UserX } from 'lucide-react'

import BillingService from '@/services/BillingService'
import { BillingResponse } from '../types/billing'
import { PaymentStatus } from '../types/enums/payment-status'
import { PaymentMethod } from '../types/enums/payment-method'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export default function BillingsList() {
  const [bills, setBills] = useState<BillingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')

  const [statusFilter, setStatusFilter] = useState<PaymentStatus | null>(null)
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | null>(null)
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)

  const loadBills = async () => {
    try {
      setLoading(true)
      const data = await BillingService.getAllBillings()
      setBills(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load billings.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBills()
  }, [])

  // 🔎 Filtering Logic
  const filteredBills = bills.filter(bill => {
    const searchLower = searchQuery.toLowerCase()

    const matchesSearch =
      bill.billId.toString().includes(searchLower) ||
      bill.ownerId.toString().includes(searchLower)

    const matchesStatus = !statusFilter || bill.paymentStatus === statusFilter

    const matchesMethod = !methodFilter || bill.paymentMethod === methodFilter

    const matchesDate =
      !dateFilter || bill.paymentDate === dateFilter.toISOString().split('T')[0]

    return matchesSearch && matchesStatus && matchesMethod && matchesDate
  })

  const getVariant = (status: string) => {
    if (status === 'PAID') return 'outline'
    if (status === 'PENDING') return 'destructive'
    return 'secondary'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500">Loading billings...</p>
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
            placeholder="Search by Bill ID or Owner ID..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

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
              <DialogTitle>Filter Bills</DialogTitle>
              <DialogDescription>
                Filter by status, method, or payment date.
              </DialogDescription>
            </DialogHeader>

            {/* Payment Status */}
            <div className="space-y-2">
              <p className="font-medium text-sm">Payment Status</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(PaymentStatus).map(status => (
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

            <Separator />

            {/* Payment Method */}
            <div className="space-y-2">
              <p className="font-medium text-sm">Payment Method</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(PaymentMethod).map(method => (
                  <Button
                    key={method}
                    variant={methodFilter === method ? 'default' : 'outline'}
                    onClick={() => setMethodFilter(method)}
                  >
                    {method}
                  </Button>
                ))}
                <Button variant="ghost" onClick={() => setMethodFilter(null)}>
                  Clear
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter(null)
                  setMethodFilter(null)
                  setDateFilter(undefined)
                }}
              >
                Reset All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table List */}
      {filteredBills.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="p-4">Bill ID</th>
                <th className="p-4">Owner ID</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Payment Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.map(bill => (
                <tr
                  key={bill.billId}
                  className="border-t hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium">{bill.billId}</td>
                  <td className="p-4">{bill.ownerId}</td>
                  <td className="p-4">${bill.totalAmount}</td>
                  <td className="p-4">
                    <Badge variant={getVariant(bill.paymentStatus)}>
                      {bill.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4">{bill.paymentMethod}</td>
                  <td className="p-4">{bill.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <UserX className="h-12 w-12 text-slate-300 mb-2" />
          <p className="text-slate-500 font-medium">No results found</p>
        </div>
      )}
    </div>
  )
}
