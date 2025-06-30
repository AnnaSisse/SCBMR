"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  ArrowLeft,
  Search,
  Edit,
  Trash2,
  FileImage,
} from "lucide-react"

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/patients")
      if (!res.ok) throw new Error("Failed to fetch patients")
      const data = await res.json()
      setPatients(data.data || [])
    } catch (err: any) {
      setError(err.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="mb-4 flex-1 md:mb-0">
          <h1 className="text-3xl font-semibold">Patients</h1>
          <p className="mt-2 text-gray-500">Manage your patients and their information.</p>
        </div>
        <div className="mt-3 flex flex-shrink-0 space-x-3">
          <Link href="/dashboard/patients/new">
            <Button>Add New Patient</Button>
          </Link>
          <Link href="/dashboard/patients/download">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-6">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : patients.length === 0 ? (
          <div>No patients found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.patient_id}>
                  <TableCell>{p.first_name} {p.last_name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phone_number}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/patients/${p.patient_id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
