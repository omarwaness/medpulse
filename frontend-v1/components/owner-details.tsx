'use client'

import React, { useState, useEffect } from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  PawPrint,
  History,
  ReceiptText,
  Plus
} from 'lucide-react'

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Field, FieldGroup } from './ui/field'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { PatientCard } from './patient-list'

// Types & Services
import OwnerService from '@/services/OwnerService'
import PatientService from '@/services/PatientService'
import BillingService from '@/services/BillingService'
import { OwnerResponse } from '@/types/owner'
import { BillingResponse } from '@/types/billing'
import { PatientResponse } from '@/types/patient'
import { PaymentStatus } from '@/types/enums/payment-status'
import { PaymentMethod } from '@/types/enums/payment-method'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'

interface OwnerDetailsProps {
  ownerId: string
}

export default function OwnerDetails({ ownerId }: OwnerDetailsProps) {
  const id = parseInt(ownerId)

  const [owner, setOwner] = useState<OwnerResponse>({} as OwnerResponse)
  const [patients, setPatients] = useState<PatientResponse[]>([])
  const [billings, setBillings] = useState<BillingResponse[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Initialize the pet state
  const [newPet, setNewPet] = useState({
    name: '',
    species: '',
    breed: '',
    dateOfBirth: null as Date | null,
    gender: ''
  })
  const [adding, setAdding] = useState(false)
  const [open, setOpen] = useState(false)
  const [addError, setAddError] = useState('')

  const [newBilling, setNewBilling] = useState({
    totalAmount: '',
    paymentStatus: PaymentStatus.PENDING,
    paymentDate: null as Date | null,
    paymentMethod: PaymentMethod.CASH
  })
  const [billingAdding, setBillingAdding] = useState(false)
  const [billingOpen, setBillingOpen] = useState(false)
  const [billingError, setBillingError] = useState('')

  // 2. The submission handler
  const handleAddPet = async () => {
    setAdding(true)
    setAddError('')

    try {
      if (!newPet.dateOfBirth) {
        setAddError('Please select a date of birth')
        setAdding(false)
        return
      }

      const createdPatient = await PatientService.createPatient({
        ...newPet,
        ownerId: id,
        dateOfBirth: newPet.dateOfBirth.toISOString()
      })

      // ✅ Add new pet to UI immediately
      setPatients(prev => [...prev, createdPatient])

      // ✅ Reset form fields
      setNewPet({
        name: '',
        species: '',
        breed: '',
        dateOfBirth: null,
        gender: ''
      })

      // ✅ Close dialog
      setOpen(false)
    } catch (error) {
      setAddError(
        'Failed to add pet ' + (error instanceof Error ? error.message : '')
      )
    } finally {
      setAdding(false)
    }
  }

  const paymentStatusOptions = [
    { value: PaymentStatus.PENDING, label: 'Pending' },
    { value: PaymentStatus.PAID, label: 'Paid' },
    { value: PaymentStatus.CANCELLED, label: 'Cancelled' },
    { value: PaymentStatus.REFUNDED, label: 'Refunded' }
  ]

  const paymentMethodOptions = [
    { value: PaymentMethod.CASH, label: 'Cash' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Credit card' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Debit card' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Bank transfer' },
    { value: PaymentMethod.ONLINE_PAYMENT, label: 'Online payment' }
  ]

  const handleAddBilling = async () => {
    setBillingAdding(true)
    setBillingError('')

    try {
      const amount = parseFloat(newBilling.totalAmount)

      if (Number.isNaN(amount) || amount < 0) {
        setBillingError('Please enter a valid total amount')
        setBillingAdding(false)
        return
      }

      if (!newBilling.paymentDate) {
        setBillingError('Please select a payment date')
        setBillingAdding(false)
        return
      }

      const createdBilling = await BillingService.createBilling({
        ownerId: id,
        totalAmount: amount,
        paymentStatus: newBilling.paymentStatus,
        paymentDate: format(newBilling.paymentDate, 'yyyy-MM-dd'),
        paymentMethod: newBilling.paymentMethod
      })

      setBillings(prev => [...prev, createdBilling])

      setNewBilling({
        totalAmount: '',
        paymentStatus: PaymentStatus.PENDING,
        paymentDate: null,
        paymentMethod: PaymentMethod.CASH
      })

      setBillingOpen(false)
    } catch (error) {
      setBillingError(
        'Failed to add billing ' +
          (error instanceof Error ? error.message : '')
      )
    } finally {
      setBillingAdding(false)
    }
  }

  // Helper for Badge colors
  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'overdue':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true)
        const [ownerData, patientsData, billingsData] = await Promise.all([
          OwnerService.getOwner(id),
          OwnerService.getOwnerPatients(id),
          OwnerService.getOwnerBillings(id)
        ])

        setOwner(ownerData)
        setPatients(patientsData)
        setBillings(billingsData)
      } catch (error) {
        console.error('Failed to fetch data', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [id]) // Only refetch if the ID changes

  if (loading) return <div>Loading details...</div>

  return (
    <div className="flex flex-col gap-6">
      {/* 1. TOP: Owner Info (Full Width) */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <User className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {owner.firstName} {owner.lastName}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Email Address
              </p>
              <p className="text-sm font-medium">{owner.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Phone Number
              </p>
              <p className="text-sm font-medium">{owner.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Address
              </p>
              <p className="text-sm font-medium">{owner.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BOTTOM SECTION: Pets and Billing */}
      {/* items-stretch so both columns grow to the same height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* PETS CAROUSEL (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mr-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              Pets {patients.length}
            </h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Pet
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add New Pet</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new pet to the owners
                    profile.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <div className="flex flex-row gap-2">
                    <Field>
                      <Label htmlFor="firstName">Name</Label>
                      <Input
                        id="firstName"
                        value={newPet.name}
                        onChange={e =>
                          setNewPet(prev => ({
                            ...prev,
                            name: e.target.value
                          }))
                        }
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="lastName">Species</Label>
                      <Input
                        id="lastName"
                        value={newPet.species}
                        onChange={e =>
                          setNewPet(prev => ({
                            ...prev,
                            species: e.target.value
                          }))
                        }
                      />
                    </Field>
                  </div>
                  <Field>
                    <Label htmlFor="phone">Breed</Label>
                    <Input
                      id="phone"
                      value={newPet.breed}
                      onChange={e =>
                        setNewPet(prev => ({
                          ...prev,
                          breed: e.target.value
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="email">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={'outline'}
                            data-empty={!newPet.dateOfBirth}
                            className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
                          >
                            {newPet.dateOfBirth ? (
                              format(newPet.dateOfBirth, 'PPP')
                            ) : (
                              <span>Pick date of birth</span>
                            )}
                            <ChevronDownIcon data-icon="inline-end" />
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newPet.dateOfBirth ?? undefined}
                          onSelect={date =>
                            setNewPet(prev => ({
                              ...prev,
                              dateOfBirth: date ?? null
                            }))
                          }
                          defaultMonth={newPet.dateOfBirth ?? undefined}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <Field>
                    <Label htmlFor="address">Gender</Label>
                    <Input
                      id="address"
                      value={newPet.gender}
                      onChange={e =>
                        setNewPet(prev => ({
                          ...prev,
                          gender: e.target.value
                        }))
                      }
                    />
                  </Field>
                </FieldGroup>
                {addError && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {addError}
                  </p>
                )}
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                  />
                  <Button
                    type="button"
                    onClick={handleAddPet}
                    disabled={adding}
                  >
                    {adding ? 'Adding...' : 'Add'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {patients.length > 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {patients.map(patient => (
                    <CarouselItem key={patient.patientId}>
                      <div className="p-0.5">
                        <PatientCard patient={patient} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ) : (
            <div className="text-center text-slate-400">
              <PawPrint className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>No pets found</p>
            </div>
          )}
        </div>

        {/* BILLING LIST SCROLL AREA (Col 8) */}
        {/* flex flex-col + flex-1 on Card makes it fill the column height */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between mr-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Billing History
            </h3>
            <Dialog open={billingOpen} onOpenChange={setBillingOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Billing
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add New Billing</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to create a new billing record.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="billing-amount">Total Amount</Label>
                    <Input
                      id="billing-amount"
                      type="number"
                      min={0}
                      step="0.01"
                      value={newBilling.totalAmount}
                      onChange={e =>
                        setNewBilling(prev => ({
                          ...prev,
                          totalAmount: e.target.value
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="billing-status">Payment Status</Label>
                    <Select
                      value={newBilling.paymentStatus}
                      onValueChange={value =>
                        setNewBilling(prev => ({
                          ...prev,
                          paymentStatus: value as PaymentStatus
                        }))
                      }
                    >
                      <SelectTrigger id="billing-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          {paymentStatusOptions.map(option => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="billing-date">Payment Date</Label>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={'outline'}
                            data-empty={!newBilling.paymentDate}
                            className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
                          >
                            {newBilling.paymentDate ? (
                              format(newBilling.paymentDate, 'PPP')
                            ) : (
                              <span>Pick payment date</span>
                            )}
                            <ChevronDownIcon data-icon="inline-end" />
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newBilling.paymentDate ?? undefined}
                          onSelect={date =>
                            setNewBilling(prev => ({
                              ...prev,
                              paymentDate: date ?? null
                            }))
                          }
                          defaultMonth={newBilling.paymentDate ?? undefined}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <Field>
                    <Label htmlFor="billing-method">Payment Method</Label>
                    <Select
                      value={newBilling.paymentMethod}
                      onValueChange={value =>
                        setNewBilling(prev => ({
                          ...prev,
                          paymentMethod: value as PaymentMethod
                        }))
                      }
                    >
                      <SelectTrigger id="billing-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Method</SelectLabel>
                          {paymentMethodOptions.map(option => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                {billingError && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {billingError}
                  </p>
                )}
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                  />
                  <Button
                    type="button"
                    onClick={handleAddBilling}
                    disabled={billingAdding}
                  >
                    {billingAdding ? 'Adding...' : 'Add'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Card className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              {billings.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0 z-10 border-b">
                    <tr className="text-left">
                      <th className="p-4">Bill ID</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billings.map(bill => (
                      <tr
                        key={bill.billId}
                        className="border-t hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4 font-medium">{bill.billId}</td>
                        <td className="p-4">${bill.totalAmount}</td>
                        <td className="p-4">
                          <Badge variant={getVariant(bill.paymentStatus)}>
                            {bill.paymentStatus}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-500">
                          {bill.paymentMethod}
                        </td>
                        <td className="p-4 text-slate-500">
                          {bill.paymentDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
                  <ReceiptText className="h-12 w-12 mb-2 opacity-20" />
                  <p>No billing records found</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  )
}
