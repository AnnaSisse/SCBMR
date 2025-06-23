"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Pill, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function NewPrescriptionPage() {
  const [formData, setFormData] = useState({
    patientId: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    totalRefills: "0",
    priority: "Medium",
    instructions: "",
    notes: "",
    genericSubstitution: true,
    status: "Active",
  })
  const [patients, setPatients] = useState<any[]>([])
  const [medications, setMedications] = useState<any[]>([])
  const [drugInteractions, setDrugInteractions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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

    if (currentUser.role !== "Doctor" && currentUser.role !== "Admin") {
      router.push("/dashboard")
      return
    }

    loadPatientsAndMedications()
  }, [router])

  const loadPatientsAndMedications = () => {
    const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(storedPatients)

    // Common medications database
    const commonMedications = [
      { name: "Amoxicillin", category: "Antibiotic" },
      { name: "Lisinopril", category: "ACE Inhibitor" },
      { name: "Metformin", category: "Diabetes" },
      { name: "Atorvastatin", category: "Statin" },
      { name: "Omeprazole", category: "PPI" },
      { name: "Amlodipine", category: "Calcium Channel Blocker" },
      { name: "Metoprolol", category: "Beta Blocker" },
      { name: "Hydrochlorothiazide", category: "Diuretic" },
      { name: "Albuterol", category: "Bronchodilator" },
      { name: "Prednisone", category: "Corticosteroid" },
    ]
    setMedications(commonMedications)
  }

  const checkDrugInteractions = (selectedMedication: string, patientId: string) => {
    // Simulate drug interaction checking
    const interactions: string[] = []

    if (selectedMedication === "Warfarin") {
      interactions.push("May interact with Aspirin - increased bleeding risk")
    }
    if (selectedMedication === "Metformin" && Math.random() > 0.7) {
      interactions.push("Monitor kidney function - contraindicated in renal impairment")
    }

    setDrugInteractions(interactions)
  }

  const handleMedicationChange = (medication: string) => {
    setFormData({ ...formData, medication })
    checkDrugInteractions(medication, formData.patientId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const prescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]")
      const selectedPatient = patients.find((p) => p.id === formData.patientId)

      if (!selectedPatient) {
        setError("Please select a patient")
        setLoading(false)
        return
      }

      const prescriptionId = `RX${Date.now().toString().slice(-6)}`

      const newPrescription = {
        id: Date.now().toString(),
        prescriptionId,
        patientId: formData.patientId,
        patientName: selectedPatient.name,
        doctorId: user.id,
        doctorName: user.name,
        ...formData,
        refillsRemaining: Number.parseInt(formData.totalRefills),
        totalRefills: Number.parseInt(formData.totalRefills),
        createdAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      }

      prescriptions.push(newPrescription)
      localStorage.setItem("prescriptions", JSON.stringify(prescriptions))

      router.push("/dashboard/prescriptions")
    } catch (err) {
      setError("Failed to create prescription. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime",
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/prescriptions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prescriptions
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Pill className="h-8 w-8" />
            New Prescription
          </h1>
          <p className="text-gray-600">Create a new prescription for a patient</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Prescription Details</CardTitle>
              <CardDescription>Fill in the prescription information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient *</Label>
                    <Select
                      value={formData.patientId}
                      onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} - {patient.patientId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication *</Label>
                    <Select value={formData.medication} onValueChange={handleMedicationChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medication" />
                      </SelectTrigger>
                      <SelectContent>
                        {medications.map((med) => (
                          <SelectItem key={med.name} value={med.name}>
                            {med.name} ({med.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage *</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      placeholder="e.g., 500mg, 10ml, 1 tablet"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 7 days, 2 weeks, 30 days"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalRefills">Number of Refills</Label>
                    <Select
                      value={formData.totalRefills}
                      onValueChange={(value) => setFormData({ ...formData, totalRefills: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select refills" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (No refills)</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="11">11 (1 year)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Patient Instructions *</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Instructions for the patient on how to take the medication..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Doctor's Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes for pharmacy or medical records..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="genericSubstitution"
                    checked={formData.genericSubstitution}
                    onCheckedChange={(checked) => setFormData({ ...formData, genericSubstitution: checked as boolean })}
                  />
                  <Label htmlFor="genericSubstitution">Allow generic substitution</Label>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Prescription"}
                  </Button>
                  <Link href="/dashboard/prescriptions">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Drug Interactions */}
          {drugInteractions.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Drug Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {drugInteractions.map((interaction, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{interaction}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patient Allergies */}
          {formData.patientId && (
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const selectedPatient = patients.find((p) => p.id === formData.patientId)
                  return selectedPatient ? (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Allergies</p>
                        <p className="font-medium">{selectedPatient.allergies || "None known"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Medical History</p>
                        <p className="font-medium">{selectedPatient.medicalHistory || "None recorded"}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Select a patient to view information</p>
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Prescription Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Always verify patient allergies before prescribing</p>
              <p>• Check for drug interactions with current medications</p>
              <p>• Provide clear dosage and frequency instructions</p>
              <p>• Consider generic alternatives when appropriate</p>
              <p>• Set appropriate refill limits based on medication type</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
