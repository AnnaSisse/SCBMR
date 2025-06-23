"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  UserPlus,
  Search,
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ReceptionCheckInPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isNewPatient, setIsNewPatient] = useState(false)
  const router = useRouter()

  // New patient form data
  const [newPatientData, setNewPatientData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    insuranceProvider: "",
    insuranceNumber: "",
    reasonForVisit: "",
  })

  // Check-in data
  const [checkInData, setCheckInData] = useState({
    appointmentType: "",
    department: "",
    doctor: "",
    urgency: "routine",
    notes: "",
  })

  // Sample patients for demonstration
  const [patients, setPatients] = useState([
    {
      id: "P001",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1985-06-15",
      gender: "Male",
      phone: "+1-555-0001",
      email: "john.doe@email.com",
      lastVisit: "2024-06-15",
      status: "Active"
    },
    {
      id: "P002", 
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1990-03-22",
      gender: "Female",
      phone: "+1-555-0002",
      email: "jane.smith@email.com",
      lastVisit: "2024-06-10",
      status: "Active"
    },
    {
      id: "P003",
      firstName: "Robert",
      lastName: "Johnson",
      dateOfBirth: "1975-11-08",
      gender: "Male",
      phone: "+1-555-0003",
      email: "robert.johnson@email.com",
      lastVisit: "2024-06-12",
      status: "Active"
    }
  ])

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Receptionist") {
      router.push("/dashboard")
      return
    }

    setIsLoading(false)
  }, [router])

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    return fullName.includes(searchLower) || 
           patient.id.toLowerCase().includes(searchLower) ||
           patient.phone.includes(searchLower)
  })

  const handleNewPatientSubmit = () => {
    if (!newPatientData.firstName || !newPatientData.lastName || !newPatientData.dateOfBirth) {
      toast.error("Please fill in all required fields")
      return
    }

    const newPatient = {
      id: `P${Date.now()}`,
      ...newPatientData,
      lastVisit: new Date().toISOString().split('T')[0],
      status: "Active"
    }

    setPatients([...patients, newPatient])
    setSelectedPatient(newPatient)
    setIsNewPatient(false)
    setNewPatientData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      insuranceProvider: "",
      insuranceNumber: "",
      reasonForVisit: "",
    })
    toast.success("New patient registered successfully")
  }

  const handleCheckIn = () => {
    if (!selectedPatient) {
      toast.error("Please select a patient first")
      return
    }

    if (!checkInData.appointmentType || !checkInData.department) {
      toast.error("Please fill in appointment details")
      return
    }

    const checkInRecord = {
      id: `CI${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      checkInTime: new Date().toISOString(),
      ...checkInData,
      status: "Checked In",
      checkedInBy: currentUser.name
    }

    // Save to localStorage (in a real app, this would go to database)
    const existingCheckIns = JSON.parse(localStorage.getItem("checkIns") || "[]")
    localStorage.setItem("checkIns", JSON.stringify([...existingCheckIns, checkInRecord]))

    toast.success("Patient checked in successfully")
    
    // Reset form
    setSelectedPatient(null)
    setCheckInData({
      appointmentType: "",
      department: "",
      doctor: "",
      urgency: "routine",
      notes: "",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading check-in system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="h-8 w-8 text-blue-600" />
              Patient Check-In
            </h1>
            <p className="text-gray-600">Register new patients and manage check-ins</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Search/Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Selection</CardTitle>
              <CardDescription>Search existing patients or register new ones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients by name, ID, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsNewPatient(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Patient
                </Button>
              </div>

              {isNewPatient ? (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800">New Patient Registration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={newPatientData.firstName}
                          onChange={(e) => setNewPatientData({ ...newPatientData, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={newPatientData.lastName}
                          onChange={(e) => setNewPatientData({ ...newPatientData, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newPatientData.dateOfBirth}
                          onChange={(e) => setNewPatientData({ ...newPatientData, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={newPatientData.gender} onValueChange={(value) => setNewPatientData({ ...newPatientData, gender: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newPatientData.phone}
                          onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newPatientData.email}
                          onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleNewPatientSubmit} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Register Patient
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsNewPatient(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPatient?.id === patient.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{patient.firstName} {patient.lastName}</h4>
                          <p className="text-sm text-gray-500">ID: {patient.id}</p>
                        </div>
                        <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                          {patient.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Last: {patient.lastVisit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Check-In Form */}
          <Card>
            <CardHeader>
              <CardTitle>Check-In Details</CardTitle>
              <CardDescription>Complete the check-in process for selected patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPatient ? (
                <>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Selected Patient</h4>
                    </div>
                    <p className="text-green-700">
                      {selectedPatient.firstName} {selectedPatient.lastName} (ID: {selectedPatient.id})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appointmentType">Appointment Type *</Label>
                      <Select value={checkInData.appointmentType} onValueChange={(value) => setCheckInData({ ...checkInData, appointmentType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                          <SelectItem value="Follow-up">Follow-up</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Routine Check">Routine Check</SelectItem>
                          <SelectItem value="Lab Test">Lab Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select value={checkInData.department} onValueChange={(value) => setCheckInData({ ...checkInData, department: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Laboratory">Laboratory</SelectItem>
                          <SelectItem value="General Medicine">General Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor">Assigned Doctor</Label>
                      <Select value={checkInData.doctor} onValueChange={(value) => setCheckInData({ ...checkInData, doctor: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                          <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                          <SelectItem value="Dr. Emily Davis">Dr. Emily Davis</SelectItem>
                          <SelectItem value="Dr. Robert Wilson">Dr. Robert Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select value={checkInData.urgency} onValueChange={(value) => setCheckInData({ ...checkInData, urgency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes or special instructions..."
                      value={checkInData.notes}
                      onChange={(e) => setCheckInData({ ...checkInData, notes: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleCheckIn} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check In Patient
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Selected</h3>
                  <p className="text-gray-600">Please search and select a patient to begin check-in</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 