"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Activity, Pill, Clock, CheckCircle, Plus, Save, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CarePlansPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    notes: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Nurse") {
      router.push("/dashboard")
      return
    }

    const patientsData = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(patientsData)
  }, [router])

  const recordVitalSigns = () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    const newVitalSigns = {
      id: `VS${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      ...vitalSigns,
      recordedBy: currentUser.name,
      recordedAt: new Date().toISOString(),
    }

    const existingVitalSigns = JSON.parse(localStorage.getItem("vitalSigns") || "[]")
    const updatedVitalSigns = [...existingVitalSigns, newVitalSigns]
    localStorage.setItem("vitalSigns", JSON.stringify(updatedVitalSigns))

    // Reset form
    setVitalSigns({
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      notes: "",
    })

    alert("Vital signs recorded successfully!")
  }

  const createCarePlan = (template: any) => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    const newCarePlan = {
      id: `CP${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      name: template.name,
      description: template.description,
      tasks: template.tasks,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      status: "active",
    }

    const existingCarePlans = JSON.parse(localStorage.getItem("carePlans") || "[]")
    const updatedCarePlans = [...existingCarePlans, newCarePlan]
    localStorage.setItem("carePlans", JSON.stringify(updatedCarePlans))

    alert(`Care plan "${template.name}" created successfully for ${selectedPatient.name}!`)
  }

  const carePlanTemplates = [
    {
      id: "diabetes",
      name: "Diabetes Management",
      description: "Comprehensive care plan for diabetes management",
      tasks: [
        "Monitor blood glucose levels",
        "Administer insulin as prescribed",
        "Check for foot complications",
        "Provide dietary education",
        "Schedule regular eye exams",
      ],
    },
    {
      id: "hypertension",
      name: "Hypertension Care",
      description: "Care plan for managing high blood pressure",
      tasks: [
        "Monitor blood pressure regularly",
        "Administer prescribed medications",
        "Provide lifestyle modification education",
        "Schedule follow-up appointments",
        "Monitor for side effects",
      ],
    },
    {
      id: "post-surgery",
      name: "Post-Surgery Recovery",
      description: "Care plan for post-operative recovery",
      tasks: [
        "Monitor vital signs",
        "Check surgical site",
        "Administer pain medication",
        "Assist with mobility",
        "Provide wound care education",
      ],
    },
  ]

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              Care Plans
            </h1>
            <p className="text-gray-600">Manage patient care plans and vital signs</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Patient</CardTitle>
              <CardDescription>Choose a patient to manage their care</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedPatient?.id}
                onValueChange={(value) => {
                  const patient = patients.find((p) => p.id === value)
                  setSelectedPatient(patient)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle>Record Vital Signs</CardTitle>
              <CardDescription>Enter patient's vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blood Pressure</label>
                    <Input
                      placeholder="e.g., 120/80"
                      value={vitalSigns.bloodPressure}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Heart Rate</label>
                    <Input
                      placeholder="bpm"
                      value={vitalSigns.heartRate}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature</label>
                    <Input
                      placeholder="°C"
                      value={vitalSigns.temperature}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Respiratory Rate</label>
                    <Input
                      placeholder="breaths/min"
                      value={vitalSigns.respiratoryRate}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, respiratoryRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Oxygen Saturation</label>
                    <Input
                      placeholder="%"
                      value={vitalSigns.oxygenSaturation}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, oxygenSaturation: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    placeholder="Additional observations"
                    value={vitalSigns.notes}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, notes: e.target.value })}
                  />
                </div>
                <Button onClick={recordVitalSigns} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Record Vital Signs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Care Plan Templates */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Care Plan Templates</CardTitle>
              <CardDescription>Create care plans from templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {carePlanTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {template.tasks.map((task, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`task-${template.id}-${index}`} />
                              <label
                                htmlFor={`task-${template.id}-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {task}
                              </label>
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={() => createCarePlan(template)}
                          className="w-full"
                          disabled={!selectedPatient}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Care Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
