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
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function NewDeathCertificatePage() {
  const [formData, setFormData] = useState({
    patientId: "",
    dateOfDeath: "",
    timeOfDeath: "",
    placeOfDeath: "",
    causeOfDeath: "",
    mannerOfDeath: "",
    additionalDetails: "",
    status: "Draft",
  })
  const [patients, setPatients] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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

    loadPatients()
  }, [router])

  const loadPatients = () => {
    const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(storedPatients)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const certificates = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
      const selectedPatient = patients.find((p) => p.id === formData.patientId)

      if (!selectedPatient) {
        setError("Please select a patient")
        setLoading(false)
        return
      }

      const certificateId = `DC${Date.now().toString().slice(-6)}`

      const newCertificate = {
        id: Date.now().toString(),
        certificateId,
        patientId: formData.patientId,
        patientName: selectedPatient.name,
        patientAge: selectedPatient.age,
        patientGender: selectedPatient.gender,
        ...formData,
        issuedBy: user.name,
        issuedById: user.id,
        createdAt: new Date().toISOString(),
      }

      certificates.push(newCertificate)
      localStorage.setItem("deathCertificates", JSON.stringify(certificates))

      // Update patient status to deceased
      const updatedPatients = patients.map((p) => (p.id === formData.patientId ? { ...p, status: "Deceased" } : p))
      localStorage.setItem("patients", JSON.stringify(updatedPatients))

      router.push("/dashboard/death-certificates")
    } catch (err) {
      setError("Failed to generate certificate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const mannerOfDeathOptions = [
    "Natural",
    "Accident",
    "Suicide",
    "Homicide",
    "Pending Investigation",
    "Could not be determined",
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/death-certificates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Certificates
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Generate Death Certificate
          </h1>
          <p className="text-gray-600">Create a new death certificate</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Death Certificate Information</CardTitle>
          <CardDescription>Fill in the required information for the death certificate</CardDescription>
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
                <Label htmlFor="dateOfDeath">Date of Death *</Label>
                <Input
                  id="dateOfDeath"
                  type="date"
                  value={formData.dateOfDeath}
                  onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeOfDeath">Time of Death</Label>
                <Input
                  id="timeOfDeath"
                  type="time"
                  value={formData.timeOfDeath}
                  onChange={(e) => setFormData({ ...formData, timeOfDeath: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfDeath">Place of Death *</Label>
                <Input
                  id="placeOfDeath"
                  value={formData.placeOfDeath}
                  onChange={(e) => setFormData({ ...formData, placeOfDeath: e.target.value })}
                  placeholder="Hospital, Home, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mannerOfDeath">Manner of Death *</Label>
                <Select
                  value={formData.mannerOfDeath}
                  onValueChange={(value) => setFormData({ ...formData, mannerOfDeath: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manner of death" />
                  </SelectTrigger>
                  <SelectContent>
                    {mannerOfDeathOptions.map((manner) => (
                      <SelectItem key={manner} value={manner}>
                        {manner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="causeOfDeath">Immediate Cause of Death *</Label>
              <Textarea
                id="causeOfDeath"
                value={formData.causeOfDeath}
                onChange={(e) => setFormData({ ...formData, causeOfDeath: e.target.value })}
                placeholder="Describe the immediate cause of death..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Textarea
                id="additionalDetails"
                value={formData.additionalDetails}
                onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                placeholder="Any additional relevant information..."
                rows={4}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate Certificate"}
              </Button>
              <Link href="/dashboard/death-certificates">
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
