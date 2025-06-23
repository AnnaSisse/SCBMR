"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Activity,
  Pill,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ArrowLeft,
  Download,
  Eye,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PrescriptionsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Doctor" && user.role !== "Admin") {
      router.push("/dashboard")
      return
    }

    const prescriptionsData = JSON.parse(localStorage.getItem("prescriptions") || "[]")
    // For doctors, show prescriptions they've prescribed
    const filteredPrescriptions = user.role === "Doctor" 
      ? prescriptionsData.filter((prescription: any) => prescription.doctorId === user.id)
      : prescriptionsData
    setPrescriptions(filteredPrescriptions)
  }, [router])

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch = prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || prescription.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleDownloadPrescription = (prescription: any) => {
    // In a real application, this would generate a PDF
    alert(`Downloading prescription for ${prescription.medication}`)
  }

  const handleStatusChange = (prescriptionId: string, newStatus: string) => {
    const updatedPrescriptions = prescriptions.map((prescription) => {
      if (prescription.id === prescriptionId) {
        return {
          ...prescription,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }
      }
      return prescription
    })
    setPrescriptions(updatedPrescriptions)
    localStorage.setItem("prescriptions", JSON.stringify(updatedPrescriptions))
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Pill className="h-8 w-8 text-blue-600" />
              {currentUser.role === "Doctor" ? "My Prescriptions" : "All Prescriptions"}
            </h1>
            <p className="text-gray-600">View and manage prescriptions</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/prescriptions/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prescriptions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {prescriptions.filter((prescription) => prescription.status === "Active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Prescriptions</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {prescriptions.filter((prescription) => prescription.status === "Completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
            <CardDescription>View and manage prescription history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search prescriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredPrescriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
                    <p className="text-gray-600">Create a new prescription to get started</p>
                  </div>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{prescription.medication}</h3>
                          <p className="text-sm text-gray-500">Patient: {prescription.patientName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <Badge
                          variant={
                              prescription.status === "Active"
                              ? "default"
                                : prescription.status === "Completed"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {prescription.status}
                        </Badge>
                          {currentUser.role === "Doctor" && prescription.status === "Active" && (
                            <Select
                              value={prescription.status}
                              onValueChange={(value) => handleStatusChange(prescription.id, value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Completed">Complete</SelectItem>
                                <SelectItem value="Cancelled">Cancel</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-600">Dosage: {prescription.dosage}</p>
                          <p className="text-sm text-gray-600">Frequency: {prescription.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration: {prescription.duration}</p>
                          <p className="text-sm text-gray-600">
                            Prescribed: {new Date(prescription.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadPrescription(prescription)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          {currentUser.role === "Doctor" && prescription.status === "Active" && (
                            <Link href={`/dashboard/prescriptions/edit/${prescription.id}`}>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
