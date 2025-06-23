"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Baby, Activity, Calendar, TrendingUp, Plus, Save, Users, Shield, ArrowLeft, Scale, Ruler } from "lucide-react"
import Link from "next/link"

export default function PediatricsPage() {
  const [user, setUser] = useState<any>(null)
  const [pediatricPatients, setPediatricPatients] = useState<any[]>([])
  const [vaccinations, setVaccinations] = useState<any[]>([])
  const [growthData, setGrowthData] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [newVaccination, setNewVaccination] = useState({
    patientId: "",
    vaccine: "",
    dateGiven: "",
    nextDue: "",
    batchNumber: "",
    notes: "",
  })
  const [newGrowthRecord, setNewGrowthRecord] = useState({
    patientId: "",
    weight: "",
    height: "",
    headCircumference: "",
    notes: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    // Check if user has permission to access pediatrics
    if (!["Admin", "Doctor", "Nurse"].includes(currentUser.role)) {
      router.push("/dashboard")
      return
    }

    loadPediatricData()
  }, [router])

  const loadPediatricData = () => {
    const allPatients = JSON.parse(localStorage.getItem("patients") || "[]")
    // Filter patients under 18 years old
    const children = allPatients.filter((patient: any) => patient.age < 18)
    setPediatricPatients(children)

    const storedVaccinations = JSON.parse(localStorage.getItem("vaccinations") || "[]")
    setVaccinations(storedVaccinations)

    const storedGrowthData = JSON.parse(localStorage.getItem("growthData") || "[]")
    setGrowthData(storedGrowthData)
  }

  const addVaccination = () => {
    if (!newVaccination.patientId || !newVaccination.vaccine || !newVaccination.dateGiven) {
      alert("Please fill in required fields")
      return
    }

    const vaccination = {
      id: `VAC${Date.now()}`,
      ...newVaccination,
      administeredBy: user.name,
      createdAt: new Date().toISOString(),
    }

    const existingVaccinations = JSON.parse(localStorage.getItem("vaccinations") || "[]")
    const updatedVaccinations = [...existingVaccinations, vaccination]
    localStorage.setItem("vaccinations", JSON.stringify(updatedVaccinations))
    setVaccinations(updatedVaccinations)

    setNewVaccination({
      patientId: "",
      vaccine: "",
      dateGiven: "",
      nextDue: "",
      batchNumber: "",
      notes: "",
    })

    alert("Vaccination record added successfully!")
  }

  const addGrowthRecord = () => {
    if (!newGrowthRecord.patientId || !newGrowthRecord.weight || !newGrowthRecord.height) {
      alert("Please fill in required fields")
      return
    }

    const growthRecord = {
      id: `GR${Date.now()}`,
      ...newGrowthRecord,
      date: new Date().toISOString().split("T")[0],
      recordedBy: user.name,
      createdAt: new Date().toISOString(),
    }

    const existingGrowthData = JSON.parse(localStorage.getItem("growthData") || "[]")
    const updatedGrowthData = [...existingGrowthData, growthRecord]
    localStorage.setItem("growthData", JSON.stringify(updatedGrowthData))
    setGrowthData(updatedGrowthData)

    setNewGrowthRecord({
      patientId: "",
      weight: "",
      height: "",
      headCircumference: "",
      notes: "",
    })

    alert("Growth record added successfully!")
  }

  const getVaccinationStatus = (patientId: string) => {
    const patientVaccinations = vaccinations.filter((vac) => vac.patientId === patientId)
    const requiredVaccines = [
      "BCG",
      "Hepatitis B",
      "DPT",
      "Polio",
      "Measles",
      "Yellow Fever",
      "Meningitis",
      "Pneumococcal",
    ]
    const completedVaccines = patientVaccinations.map((vac) => vac.vaccine)
    const completionRate = (completedVaccines.length / requiredVaccines.length) * 100

    return {
      completed: completedVaccines.length,
      total: requiredVaccines.length,
      percentage: Math.round(completionRate),
    }
  }

  const getGrowthTrend = (patientId: string) => {
    const patientGrowth = growthData
      .filter((growth) => growth.patientId === patientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (patientGrowth.length < 2) return "Insufficient data"

    const latest = patientGrowth[patientGrowth.length - 1]
    const previous = patientGrowth[patientGrowth.length - 2]

    const weightTrend = Number.parseFloat(latest.weight) > Number.parseFloat(previous.weight) ? "↗" : "↘"
    const heightTrend = Number.parseFloat(latest.height) > Number.parseFloat(previous.height) ? "↗" : "↘"

    return `Weight ${weightTrend} Height ${heightTrend}`
  }

  // Cameroon-specific vaccination schedule
  const cameroonVaccineSchedule = [
    { vaccine: "BCG", ageMonths: 0, description: "Tuberculosis protection" },
    { vaccine: "Hepatitis B", ageMonths: 0, description: "Birth dose" },
    { vaccine: "DPT-HepB-Hib", ageMonths: 6, description: "First dose" },
    { vaccine: "Polio (OPV)", ageMonths: 6, description: "First dose" },
    { vaccine: "Pneumococcal", ageMonths: 6, description: "First dose" },
    { vaccine: "DPT-HepB-Hib", ageMonths: 10, description: "Second dose" },
    { vaccine: "Polio (OPV)", ageMonths: 10, description: "Second dose" },
    { vaccine: "Pneumococcal", ageMonths: 10, description: "Second dose" },
    { vaccine: "DPT-HepB-Hib", ageMonths: 14, description: "Third dose" },
    { vaccine: "Polio (OPV)", ageMonths: 14, description: "Third dose" },
    { vaccine: "Pneumococcal", ageMonths: 14, description: "Third dose" },
    { vaccine: "Measles", ageMonths: 9, description: "First dose" },
    { vaccine: "Yellow Fever", ageMonths: 9, description: "Single dose" },
    { vaccine: "Measles", ageMonths: 15, description: "Second dose" },
    { vaccine: "Meningitis A", ageMonths: 15, description: "Single dose" },
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Baby className="h-8 w-8 text-pink-600" />
            Pediatrics Department
          </h1>
          <p className="text-gray-600">Specialized care for children and adolescents</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-pink-200 bg-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-800">Pediatric Patients</CardTitle>
            <Baby className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">{pediatricPatients.length}</div>
            <p className="text-xs text-pink-600">Under 18 years</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Vaccinations Given</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{vaccinations.length}</div>
            <p className="text-xs text-blue-600">This month</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Growth Records</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{growthData.length}</div>
            <p className="text-xs text-green-600">Total measurements</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Avg Vaccination Rate</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {pediatricPatients.length > 0
                ? Math.round(
                    pediatricPatients.reduce((sum, patient) => sum + getVaccinationStatus(patient.id).percentage, 0) /
                      pediatricPatients.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-orange-600">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients">Pediatric Patients</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccination Management</TabsTrigger>
          <TabsTrigger value="growth">Growth Tracking</TabsTrigger>
          <TabsTrigger value="schedule">Vaccination Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pediatric Patients Overview
              </CardTitle>
              <CardDescription>Children and adolescents under 18 years old</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pediatricPatients.length === 0 ? (
                  <div className="text-center py-8">
                    <Baby className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pediatric patients found</h3>
                    <p className="text-gray-600">Pediatric patients will appear here when registered</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pediatricPatients.map((patient) => {
                      const vaccinationStatus = getVaccinationStatus(patient.id)
                      const growthTrend = getGrowthTrend(patient.id)

                      return (
                        <Card key={patient.id} className="border-l-4 border-l-pink-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Baby className="h-5 w-5 text-pink-600" />
                                  <h3 className="font-semibold">{patient.name}</h3>
                                  <Badge variant="outline">{patient.age} years old</Badge>
                                  <Badge variant="outline">{patient.gender}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">Patient ID: {patient.patientId}</p>
                                <p className="text-sm text-gray-600">
                                  Guardian: {patient.emergencyContact} ({patient.emergencyPhone})
                                </p>
                              </div>
                              <div className="text-right space-y-2">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm">
                                    Vaccinations: {vaccinationStatus.completed}/{vaccinationStatus.total} (
                                    {vaccinationStatus.percentage}%)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">Growth: {growthTrend}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    View Records
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Add Vaccination
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Add New Vaccination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Record Vaccination
                </CardTitle>
                <CardDescription>Add a new vaccination record for a pediatric patient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vacPatient">Patient</Label>
                  <Select
                    value={newVaccination.patientId}
                    onValueChange={(value) => setNewVaccination({ ...newVaccination, patientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {pediatricPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} ({patient.age} years)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccine">Vaccine</Label>
                  <Select
                    value={newVaccination.vaccine}
                    onValueChange={(value) => setNewVaccination({ ...newVaccination, vaccine: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BCG">BCG (Tuberculosis)</SelectItem>
                      <SelectItem value="Hepatitis B">Hepatitis B</SelectItem>
                      <SelectItem value="DPT-HepB-Hib">DPT-HepB-Hib</SelectItem>
                      <SelectItem value="Polio (OPV)">Polio (OPV)</SelectItem>
                      <SelectItem value="Pneumococcal">Pneumococcal</SelectItem>
                      <SelectItem value="Measles">Measles</SelectItem>
                      <SelectItem value="Yellow Fever">Yellow Fever</SelectItem>
                      <SelectItem value="Meningitis A">Meningitis A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateGiven">Date Given</Label>
                    <Input
                      id="dateGiven"
                      type="date"
                      value={newVaccination.dateGiven}
                      onChange={(e) => setNewVaccination({ ...newVaccination, dateGiven: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextDue">Next Due Date</Label>
                    <Input
                      id="nextDue"
                      type="date"
                      value={newVaccination.nextDue}
                      onChange={(e) => setNewVaccination({ ...newVaccination, nextDue: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={newVaccination.batchNumber}
                    onChange={(e) => setNewVaccination({ ...newVaccination, batchNumber: e.target.value })}
                    placeholder="Vaccine batch number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vacNotes">Notes</Label>
                  <Textarea
                    id="vacNotes"
                    value={newVaccination.notes}
                    onChange={(e) => setNewVaccination({ ...newVaccination, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>

                <Button onClick={addVaccination} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Record Vaccination
                </Button>
              </CardContent>
            </Card>

            {/* Recent Vaccinations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Recent Vaccinations
                </CardTitle>
                <CardDescription>Latest vaccination records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaccinations.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No vaccinations recorded</h3>
                      <p className="text-gray-600">Vaccination records will appear here</p>
                    </div>
                  ) : (
                    vaccinations
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map((vaccination) => {
                        const patient = pediatricPatients.find((p) => p.id === vaccination.patientId)
                        return (
                          <div key={vaccination.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{vaccination.vaccine}</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Patient: {patient?.name || "Unknown"} ({patient?.age} years)
                              </p>
                              <p className="text-sm text-gray-500">
                                Given: {new Date(vaccination.dateGiven).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Completed
                            </Badge>
                          </div>
                        )
                      })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Add Growth Record */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Record Growth Measurements
                </CardTitle>
                <CardDescription>Track child growth and development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="growthPatient">Patient</Label>
                  <Select
                    value={newGrowthRecord.patientId}
                    onValueChange={(value) => setNewGrowthRecord({ ...newGrowthRecord, patientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {pediatricPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} ({patient.age} years)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={newGrowthRecord.weight}
                      onChange={(e) => setNewGrowthRecord({ ...newGrowthRecord, weight: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      value={newGrowthRecord.height}
                      onChange={(e) => setNewGrowthRecord({ ...newGrowthRecord, height: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headCircumference">Head Circumference (cm)</Label>
                  <Input
                    id="headCircumference"
                    type="number"
                    step="0.1"
                    value={newGrowthRecord.headCircumference}
                    onChange={(e) => setNewGrowthRecord({ ...newGrowthRecord, headCircumference: e.target.value })}
                    placeholder="Optional for children under 2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="growthNotes">Notes</Label>
                  <Textarea
                    id="growthNotes"
                    value={newGrowthRecord.notes}
                    onChange={(e) => setNewGrowthRecord({ ...newGrowthRecord, notes: e.target.value })}
                    placeholder="Developmental observations..."
                    rows={3}
                  />
                </div>

                <Button onClick={addGrowthRecord} className="w-full bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Record Growth Data
                </Button>
              </CardContent>
            </Card>

            {/* Growth Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Growth Trends
                </CardTitle>
                <CardDescription>Recent growth measurements and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {growthData.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No growth data recorded</h3>
                      <p className="text-gray-600">Growth measurements will appear here</p>
                    </div>
                  ) : (
                    growthData
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((growth) => {
                        const patient = pediatricPatients.find((p) => p.id === growth.patientId)
                        return (
                          <div key={growth.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="font-medium">{patient?.name || "Unknown"}</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Weight: {growth.weight}kg | Height: {growth.height}cm
                                {growth.headCircumference && ` | Head: ${growth.headCircumference}cm`}
                              </p>
                              <p className="text-sm text-gray-500">
                                Date: {new Date(growth.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Recorded
                              </Badge>
                            </div>
                          </div>
                        )
                      })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cameroon National Vaccination Schedule
              </CardTitle>
              <CardDescription>
                Official vaccination schedule as per Cameroon Ministry of Public Health guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cameroonVaccineSchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{schedule.vaccine}</span>
                      </div>
                      <p className="text-sm text-gray-600">{schedule.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {schedule.ageMonths === 0 ? "At birth" : `${schedule.ageMonths} months`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
