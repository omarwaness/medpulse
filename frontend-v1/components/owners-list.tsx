'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  MapPin,
  Plus,
  Loader2,
  UserX,
  Search,
  UserPlus
} from 'lucide-react'

import OwnerService from '@/services/OwnerService'
import { OwnerResponse, OwnerRequest } from '@/types/owner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Field, FieldGroup } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

// --- The Card Component ---
export function OwnerCard({ owner }: { owner: OwnerResponse }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          {owner.lastName} {owner.firstName}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
          {owner.firstName[0]}
          {owner.lastName[0]}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-500" />
          <span className="truncate">{owner.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span>{owner.address}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/owners/${owner.ownerId}`} className='w-full'>
          <Button variant="secondary" className="w-full cursor-pointer">
            View Profile <Plus className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// --- The Main List Component ---
export default function OwnerList() {
  const [owners, setOwners] = useState<OwnerResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const [newOwner, setNewOwner] = useState<OwnerRequest>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  })

  const [addError, setAddError] = useState<string | null>(null)
  const [adding, setAdding] = useState<boolean>(false)

  const handleAddOwner = async () => {
    try {
      setAdding(true)
      setAddError(null)

      const createdOwner = await OwnerService.createOwner(newOwner)

      // Update list immediately
      setOwners(prev => [...prev, createdOwner])

      // Reset form
      setNewOwner({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: ''
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAddError(err.message)
      } else {
        setAddError('Failed to add owner.')
      }
    } finally {
      setAdding(false)
    }
  }

  const loadOwners = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await OwnerService.getAllOwners()
      setOwners(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Filtering Logic: Name or Phone
  const filteredOwners = owners.filter(owner => {
    const searchTerm = searchQuery.toLowerCase()
    const fullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
    return fullName.includes(searchTerm) || owner.phone.includes(searchTerm)
  })

  useEffect(() => {
    loadOwners()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500">Loading owners...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
        <p className="font-bold">Error loading data</p>
        <p className="text-sm">{error}</p>
        <Button
          onClick={loadOwners}
          variant="outline"
          className="mt-4 border-red-300"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Add Owner Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or phone..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" /> Add New Owner
              </Button>
            }
          />
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Add New Owner</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new owner to the directory.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <div className="flex flex-row gap-2">
                <Field>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newOwner.firstName}
                    onChange={e =>
                      setNewOwner(prev => ({
                        ...prev,
                        firstName: e.target.value
                      }))
                    }
                  />
                </Field>
                <Field>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newOwner.lastName}
                    onChange={e =>
                      setNewOwner(prev => ({
                        ...prev,
                        lastName: e.target.value
                      }))
                    }
                  />
                </Field>
              </div>
              <Field>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newOwner.phone}
                  onChange={e =>
                    setNewOwner(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))
                  }
                />
              </Field>
              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={newOwner.email}
                  onChange={e =>
                    setNewOwner(prev => ({
                      ...prev,
                      email: e.target.value
                    }))
                  }
                />
              </Field>
              <Field>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newOwner.address}
                  onChange={e =>
                    setNewOwner(prev => ({
                      ...prev,
                      address: e.target.value
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
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="button" onClick={handleAddOwner} disabled={adding}>
                {adding ? 'Adding...' : 'Add'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Results */}
      {filteredOwners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOwners.map(owner => (
            <OwnerCard key={owner.ownerId} owner={owner} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <UserX className="h-12 w-12 text-slate-300 mb-2" />
          <p className="text-slate-500 font-medium">
            No results for {searchQuery}
          </p>
          <Button
            variant="ghost"
            className="mt-2 text-blue-600"
            onClick={() => setSearchQuery('')}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
