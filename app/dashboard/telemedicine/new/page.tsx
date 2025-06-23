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
import { ArrowLeft, Video } from "lucide-react"
import Link from "next/link"

export default function NewTelemedicineConsultationPage() {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    scheduledDate: "",
    scheduledTime: "",
    consultationType: "",
    duration: "30",
    notes: "",
    status: "Scheduled",
  })
  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadPatientsAndDoctors()
  }, [])

  const loadPatientsAndDoctors = () => {
    const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const doctorUsers = storedUsers.filter((user: any) => user.role === "Doctor")

    setPatients(storedPatients)
    setDoctors(doctorUsers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const consultations = JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]")

      const selectedPatient = patients.find((p) => p.id === formData.patientId)
      const selectedDoctor = doctors.find((d) => d.id === formData.doctorId)

      const newConsultation = {
        id: Date.now().toString(),
        consultationId: `TC${Date.now().toString().slice(-6)}`,
        ...formData,
        patientName: selectedPatient?.name || "",
        doctorName: selectedDoctor?.name || "",
        createdAt: new Date().toISOString(),
        roomUrl: `https://meet.medrecord.com/room/${Date.now()}`, // Simulated video room URL
      }

      consultations.push(newConsultation)
      localStorage.setItem("telemedicineConsultations", JSON.stringify(consultations))

      router.push("/dashboard/telemedicine")
    } catch (err) {
      setError("Failed to schedule consultation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const consultationTypes = [
    "General Consultation",
    "Follow-up",
    "Mental Health",
    "Chronic Disease Management",
    "Prescription Review",
    "Second Opinion",
    "Emergency Consultation",
  ]

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/telemedicine">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Telemedicine
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Video className="h-8 w-8" />
            Schedule Virtual Consultation
          </h1>
          <p className="text-gray-600">Set up a new telemedicine session</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consultation Details</CardTitle>
          <CardDescription>Fill in the virtual consultation information</CardDescription>
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
                <Label htmlFor="doctorId">Doctor *</Label>
                <Select
                  value={formData.doctorId}
                  onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Time *</Label>
                <Select
                  value={formData.scheduledTime}
                  onValueChange={(value) => setFormData({ ...formData, scheduledTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultationType">Consultation Type *</Label>
                <Select
                  value={formData.consultationType}
                  onValueChange={(value) => setFormData({ ...formData, consultationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Pre-consultation Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions or notes for the consultation..."
                rows={3}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Scheduling..." : "Schedule Consultation"}
              </Button>
              <Link href="/dashboard/telemedicine">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
