"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { safeLocalStorage } from "@/lib/utils"

export default function NewPatientPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  const [patientForm, setPatientForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
    blood_type: "",
    allergies: "",
    medical_history: "",
    insurance_provider: "",
    insurance_number: ""
  })

  useEffect(() => {
    setIsClient(true)
    const userData = safeLocalStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    try {
      const currentUser = JSON.parse(userData)
      setUser(currentUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push("/auth/login")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patientForm,
          registered_by: user?.id
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Patient registered successfully!")
        router.push("/dashboard/patients")
      } else {
        toast.error(data.message || "Failed to register patient")
      }
    } catch (error) {
      toast.error("An error occurred while registering patient")
    } finally {
      setLoading(false)
    }
  }

  if (!isClient || !user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/patients">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-8 w-8 text-blue-600" />
              Register New Patient
            </h1>
          </div>
          <p className="text-gray-600">Create a new patient record in the system</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic patient details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={patientForm.first_name}
                      onChange={(e) => setPatientForm(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={patientForm.last_name}
                      onChange={(e) => setPatientForm(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={patientForm.date_of_birth}
                      onChange={(e) => setPatientForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={patientForm.gender} onValueChange={(value) => setPatientForm(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="blood_type">Blood Type</Label>
                  <Select value={patientForm.blood_type} onValueChange={(value) => setPatientForm(prev => ({ ...prev, blood_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Phone, email, and address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={patientForm.address}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
                <CardDescription>Emergency contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name *</Label>
                  <Input
                    id="emergency_contact_name"
                    value={patientForm.emergency_contact_name}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    value={patientForm.emergency_contact_phone}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                  <Input
                    id="emergency_contact_relationship"
                    value={patientForm.emergency_contact_relationship}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, emergency_contact_relationship: e.target.value }))}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical Information
                </CardTitle>
                <CardDescription>Allergies and medical history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={patientForm.allergies}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, allergies: e.target.value }))}
                    placeholder="List any known allergies..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="medical_history">Medical History</Label>
                  <Textarea
                    id="medical_history"
                    value={patientForm.medical_history}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, medical_history: e.target.value }))}
                    placeholder="Previous medical conditions, surgeries, etc..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Insurance Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Insurance Information
                </CardTitle>
                <CardDescription>Insurance provider and policy details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insurance_provider">Insurance Provider</Label>
                    <Input
                      id="insurance_provider"
                      value={patientForm.insurance_provider}
                      onChange={(e) => setPatientForm(prev => ({ ...prev, insurance_provider: e.target.value }))}
                      placeholder="e.g., Blue Cross, Aetna"
                    />
                  </div>
                  <div>
                    <Label htmlFor="insurance_number">Insurance Number</Label>
                    <Input
                      id="insurance_number"
                      value={patientForm.insurance_number}
                      onChange={(e) => setPatientForm(prev => ({ ...prev, insurance_number: e.target.value }))}
                      placeholder="Policy number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Link href="/dashboard/patients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register Patient"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
