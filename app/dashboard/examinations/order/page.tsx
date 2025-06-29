"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stethoscope, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ExaminationOrderPage() {
  const [formData, setFormData] = useState({
    patient_id: "",
    examination_type: "",
    priority: "normal",
    department: "",
    notes: "",
    requested_date: ""
  })
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = safeLocalStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)
    loadPatients()
  }, [router])

  const loadPatients = async () => {
    try {
      const res = await fetch("/api/patients")
      if (!res.ok) throw new Error("Failed to fetch patients")
      const data = await res.json()
      setPatients(data.data || [])
    } catch (error) {
      console.error('Error loading patients:', error)
      toast.error("Failed to load patients")
    }
  }

  const examinationTypes = [
    "Complete Blood Count (CBC)",
    "Blood Chemistry Panel",
    "Chest X-ray",
    "CT Scan",
    "MRI",
    "Electrocardiogram (ECG)",
    "Echocardiogram",
    "Pulmonary Function Tests",
    "Endoscopy",
    "Biopsy Analysis"
  ]

  const departments = [
    "Laboratory",
    "Radiology",
    "Cardiology",
    "Respiratory",
    "Endoscopy",
    "Pathology"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/examinations/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          doctor_id: user.id,
          patient_id: Number(formData.patient_id)
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Examination order created successfully!")
        router.push("/dashboard/examinations")
      } else {
        toast.error(data.message || "Failed to create examination order")
      }
    } catch (error) {
      toast.error("An error occurred while creating the order")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/examinations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Examinations
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              Order Examination
            </h1>
          </div>
          <p className="text-gray-600">Create a new examination order for a patient</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Examination Order Form</CardTitle>
            <CardDescription>Fill in the details to order an examination for a patient</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient_id">Patient *</Label>
                  <Select value={formData.patient_id} onValueChange={(value) => setFormData(prev => ({ ...prev, patient_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.patient_id} value={patient.patient_id.toString()}>
                          {patient.first_name} {patient.last_name} (ID: {patient.patient_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requested_date">Requested Date *</Label>
                  <Input
                    type="date"
                    value={formData.requested_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, requested_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examination_type">Examination Type *</Label>
                <Select value={formData.examination_type} onValueChange={(value) => setFormData(prev => ({ ...prev, examination_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select examination type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examinationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Clinical Notes</Label>
                <Textarea
                  placeholder="Enter clinical notes and reasoning for the examination..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Link href="/dashboard/examinations">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Order..." : "Create Examination Order"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 