"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Search, Activity, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AssignedPatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [filteredPatients, setFilteredPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    if (currentUser.role !== "Nurse") {
      router.push("/dashboard")
      return
    }

    loadAssignedPatients()
  }, [router])

  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.room?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(patients)
    }
  }, [searchTerm, patients])

  const loadAssignedPatients = () => {
    // In a real application, this would fetch from an API
    // For now, we'll use localStorage
    const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
    // Filter patients assigned to this nurse
    const assignedPatients = storedPatients.filter((patient: any) => 
      patient.assignedNurse === user?.id || patient.assignedNurse === user?.name
    )
    setPatients(assignedPatients)
    setFilteredPatients(assignedPatients)
  }

  const getPatientStatus = (patient: any) => {
    if (patient.discharged) return "Discharged"
    if (patient.admitted) return "Admitted"
    return "Outpatient"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Admitted":
        return "bg-blue-100 text-blue-800"
      case "Discharged":
        return "bg-gray-100 text-gray-800"
      case "Outpatient":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              Assigned Patients
            </h1>
            <p className="text-gray-600">View and manage your assigned patients</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>View all patients assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.patientId}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.room || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(getPatientStatus(patient))}>
                            {getPatientStatus(patient)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/nurse/care-plans?patientId=${patient.id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Care Plan
                              </Button>
                            </Link>
                            <Link href={`/dashboard/monitoring?patientId=${patient.id}`}>
                              <Button variant="outline" size="sm">
                                <Activity className="h-4 w-4 mr-1" />
                                Vitals
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPatients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No patients assigned
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 