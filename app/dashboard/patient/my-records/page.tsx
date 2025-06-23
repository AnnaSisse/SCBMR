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
  User,
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

export default function MyRecordsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [healthData, setHealthData] = useState<any[]>([])
  const [appointedPatients, setAppointedPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Doctor" && user.role !== "Patient") {
      router.push("/dashboard")
      return
    }

    try {
      const recordsData = JSON.parse(localStorage.getItem("patientRecords") || "[]")
      const prescriptionsData = JSON.parse(localStorage.getItem("prescriptions") || "[]")
      
      if (user.role === "Doctor") {
        // For doctors, show records of their appointed patients
        const doctorAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
          .filter((appointment: any) => appointment.doctorId === user.id)
        
        const patientIds = [...new Set(doctorAppointments.map((app: any) => app.patientId))]
        const patients = JSON.parse(localStorage.getItem("patients") || "[]")
          .filter((patient: any) => patientIds.includes(patient.id))
        
        setAppointedPatients(patients)
        setRecords(recordsData.filter((record: any) => patientIds.includes(record.patientId)))
        setPrescriptions(prescriptionsData.filter((prescription: any) => prescription.doctorId === user.id))
      } else {
        // For patients, show their own records
      setRecords(recordsData.filter((record: any) => record.patientId === user.id))
        setPrescriptions(prescriptionsData.filter((prescription: any) => prescription.patientId === user.id))
      }
    } catch (error) {
      console.error("Error loading records:", error)
      setRecords([])
      setPrescriptions([])
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleDownloadRecord = (record: any) => {
    const recordData = {
      title: record.title,
      type: record.type,
      date: record.date,
      doctor: record.doctor,
      status: record.status,
    }
    
    const blob = new Blob([JSON.stringify(recordData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${record.title.toLowerCase().replace(/\s+/g, '-')}-${record.date}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleDownloadPrescription = (prescription: any) => {
    const prescriptionData = {
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      status: prescription.status,
      prescribedBy: prescription.prescribedBy,
      prescribedAt: prescription.prescribedAt,
    }
    
    const blob = new Blob([JSON.stringify(prescriptionData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prescription.medication.toLowerCase().replace(/\s+/g, '-')}-${prescription.prescribedAt.split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || record.type === filterType

    return matchesSearch && matchesFilter
  })

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              {currentUser.role === "Doctor" ? "Patient Records" : "My Medical Records"}
            </h1>
            <p className="text-gray-600">
              {currentUser.role === "Doctor" 
                ? "View and manage your patients' medical records" 
                : "View your complete medical history"}
            </p>
          </div>
          <div className="flex gap-4">
            {currentUser.role === "Doctor" && (
              <Link href="/dashboard/patient/new-record">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Record
                </Button>
              </Link>
            )}
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          </div>
        </div>

        {currentUser.role === "Doctor" && (
          <div className="mb-6">
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Appointed Patients
                </CardTitle>
                <CardDescription>View your current patients</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appointedPatients.map((patient) => (
                    <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{patient.name}</h3>
                            <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                          </div>
                          <Badge variant="outline">{patient.gender}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Age: {patient.age}</p>
                          <p>Blood Type: {patient.bloodType || "Not specified"}</p>
              </div>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/dashboard/patient/records/${patient.id}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              View Records
                            </Button>
                          </Link>
              </div>
            </CardContent>
          </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="health">Health Data</TabsTrigger>
          </TabsList>

          <TabsContent value="records">
        <Card>
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
                <CardDescription>View and manage medical records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="lab">Lab Result</SelectItem>
                        <SelectItem value="imaging">Imaging</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                        <p className="text-gray-600">
                          {currentUser.role === "Doctor" 
                            ? "Create a new record for your patient" 
                            : "Your medical records will appear here"}
                        </p>
                  </div>
                ) : (
                  filteredRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{record.title}</h3>
                              <p className="text-sm text-gray-500">
                                {currentUser.role === "Doctor" 
                                  ? `Patient: ${record.patientName}` 
                                  : `Provider: ${record.provider}`}
                              </p>
                        </div>
                        <Badge
                          variant={
                                record.status === "Active"
                              ? "default"
                                  : record.status === "Completed"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                              {record.status}
                        </Badge>
                      </div>
                          <div className="text-sm text-gray-600 mb-4">
                            <p>{record.description}</p>
                          </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadRecord(record)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>View and manage your prescriptions</CardDescription>
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
                  </div>
                  <div className="grid gap-4">
                    {prescriptions.map((prescription) => (
                      <Card key={prescription.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{prescription.medication}</h3>
                              <p className="text-sm text-gray-500">
                                Prescribed by: {prescription.prescribedBy}
                              </p>
                              <p className="text-sm text-gray-500">
                                Date: {new Date(prescription.prescribedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadPrescription(prescription)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Dosage</p>
                              <p className="text-gray-600">{prescription.dosage}</p>
                            </div>
                            <div>
                              <p className="font-medium">Frequency</p>
                              <p className="text-gray-600">{prescription.frequency}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Health Tracking</CardTitle>
                <CardDescription>Monitor your health metrics and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {healthData.map((data) => (
                      <Card key={data.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{data.metric}</h3>
                              <p className="text-sm text-gray-500">
                                Last updated: {new Date(data.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant={data.status === "normal" ? "success" : "warning"}>
                              {data.status}
                            </Badge>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">{data.value}</p>
                            {data.notes && (
                              <p className="text-sm text-gray-500 mt-2">{data.notes}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
