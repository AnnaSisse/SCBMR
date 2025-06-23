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
import { ArrowLeft, Baby } from "lucide-react"
import Link from "next/link"

export default function NewBirthCertificatePage() {
  const [formData, setFormData] = useState({
    childName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    gender: "",
    weight: "",
    length: "",
    motherName: "",
    motherAge: "",
    motherNationality: "",
    fatherName: "",
    fatherAge: "",
    fatherNationality: "",
    attendingPhysician: "",
    hospitalName: "",
    registrationNumber: "",
    additionalNotes: "",
    status: "Pending Review",
  })
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

    if (currentUser.role !== "Civil Authority" && currentUser.role !== "Admin") {
      router.push("/dashboard")
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const certificates = JSON.parse(localStorage.getItem("birthCertificates") || "[]")
      const certificateId = `BC${Date.now().toString().slice(-6)}`

      const newCertificate = {
        id: Date.now().toString(),
        certificateId,
        ...formData,
        issuedBy: user.name,
        issuedById: user.id,
        createdAt: new Date().toISOString(),
      }

      certificates.push(newCertificate)
      localStorage.setItem("birthCertificates", JSON.stringify(certificates))

      router.push("/dashboard/civil-authority")
    } catch (err) {
      setError("Failed to generate birth certificate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/civil-authority">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Civil Authority
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Baby className="h-8 w-8 text-green-600" />
            Generate Birth Certificate
          </h1>
          <p className="text-gray-600">Create a new birth certificate</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Birth Certificate Information</CardTitle>
          <CardDescription>Fill in the required information for the birth certificate</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Child Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Child Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Full Name *</Label>
                  <Input
                    id="childName"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeOfBirth">Time of Birth</Label>
                  <Input
                    id="timeOfBirth"
                    type="time"
                    value={formData.timeOfBirth}
                    onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g., 3.2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                <Input
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                  placeholder="Hospital name and address"
                  required
                />
              </div>
            </div>

            {/* Parents Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Parents Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Full Name *</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherAge">Mother's Age</Label>
                  <Input
                    id="motherAge"
                    type="number"
                    value={formData.motherAge}
                    onChange={(e) => setFormData({ ...formData, motherAge: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherNationality">Mother's Nationality</Label>
                  <Input
                    id="motherNationality"
                    value={formData.motherNationality}
                    onChange={(e) => setFormData({ ...formData, motherNationality: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Full Name *</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherAge">Father's Age</Label>
                  <Input
                    id="fatherAge"
                    type="number"
                    value={formData.fatherAge}
                    onChange={(e) => setFormData({ ...formData, fatherAge: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherNationality">Father's Nationality</Label>
                  <Input
                    id="fatherNationality"
                    value={formData.fatherNationality}
                    onChange={(e) => setFormData({ ...formData, fatherNationality: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attendingPhysician">Attending Physician *</Label>
                  <Input
                    id="attendingPhysician"
                    value={formData.attendingPhysician}
                    onChange={(e) => setFormData({ ...formData, attendingPhysician: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital/Facility Name *</Label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Hospital registration number"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
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
                {loading ? "Generating..." : "Generate Birth Certificate"}
              </Button>
              <Link href="/dashboard/civil-authority">
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
