"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Calendar, CheckCircle, FileText } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function DischargePatientPage() {
  const [hospitalisations, setHospitalisations] = useState<any[]>([])
  const [selectedHospitalisation, setSelectedHospitalisation] = useState<any>(null)
  const [dischargeForm, setDischargeForm] = useState({
    discharge_date: "",
    discharge_summary: "",
    medications_prescribed: "",
    follow_up_instructions: "",
    discharge_condition: "stable"
  })
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
    loadActiveHospitalisations()
  }, [router])

  const loadActiveHospitalisations = async () => {
    try {
      const res = await fetch("/api/hospitalisations?status=active")
      if (!res.ok) throw new Error("Failed to fetch hospitalisations")
      const data = await res.json()
      setHospitalisations(data.filter((h: any) => !h.discharge_date))
    } catch (error) {
      console.error('Error loading hospitalisations:', error)
      toast.error("Failed to load hospitalisations")
    }
  }

  const handleDischarge = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedHospitalisation) return

    setLoading(true)
    try {
      const res = await fetch(`/api/hospitalisations/${selectedHospitalisation.hospitalisation_id}/discharge`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dischargeForm,
          doctor_id: user.id
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Patient discharged successfully!")
        setSelectedHospitalisation(null)
        setDischargeForm({
          discharge_date: "",
          discharge_summary: "",
          medications_prescribed: "",
          follow_up_instructions: "",
          discharge_condition: "stable"
        })
        loadActiveHospitalisations()
      } else {
        toast.error(data.message || "Failed to discharge patient")
      }
    } catch (error) {
      toast.error("An error occurred while discharging patient")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "admitted" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/hospitalisations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hospitalisations
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              Discharge Patient
            </h1>
          </div>
          <p className="text-gray-600">Discharge patients from hospitalization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Hospitalisations */}
          <Card>
            <CardHeader>
              <CardTitle>Active Hospitalisations</CardTitle>
              <CardDescription>Patients currently admitted</CardDescription>
            </CardHeader>
            <CardContent>
              {hospitalisations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active hospitalisations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hospitalisations.map((hosp) => (
                    <div key={hosp.hospitalisation_id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Patient {hosp.patient_id}</h3>
                          <p className="text-sm text-gray-600">Ward: {hosp.ward} - Room: {hosp.room}</p>
                          <p className="text-sm text-gray-600">
                            Admitted: {new Date(hosp.admission_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(hosp.status)}>
                          {hosp.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          Reason: {hosp.reason}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => setSelectedHospitalisation(hosp)}
                        >
                          Discharge
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discharge Form */}
          {selectedHospitalisation && (
            <Card>
              <CardHeader>
                <CardTitle>Discharge Patient</CardTitle>
                <CardDescription>
                  Discharge Patient {selectedHospitalisation.patient_id} from {selectedHospitalisation.ward}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDischarge} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="discharge_date">Discharge Date *</Label>
                    <Input
                      type="date"
                      value={dischargeForm.discharge_date}
                      onChange={(e) => setDischargeForm(prev => ({ ...prev, discharge_date: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discharge_condition">Discharge Condition *</Label>
                    <Select value={dischargeForm.discharge_condition} onValueChange={(value) => setDischargeForm(prev => ({ ...prev, discharge_condition: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="improved">Improved</SelectItem>
                        <SelectItem value="recovered">Recovered</SelectItem>
                        <SelectItem value="transferred">Transferred</SelectItem>
                        <SelectItem value="against_advice">Against Medical Advice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discharge_summary">Discharge Summary *</Label>
                    <Textarea
                      placeholder="Enter discharge summary including treatment provided, outcomes, and current condition..."
                      value={dischargeForm.discharge_summary}
                      onChange={(e) => setDischargeForm(prev => ({ ...prev, discharge_summary: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications_prescribed">Medications Prescribed</Label>
                    <Textarea
                      placeholder="List any medications prescribed for discharge..."
                      value={dischargeForm.medications_prescribed}
                      onChange={(e) => setDischargeForm(prev => ({ ...prev, medications_prescribed: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="follow_up_instructions">Follow-up Instructions</Label>
                    <Textarea
                      placeholder="Enter follow-up instructions, appointments, and recommendations..."
                      value={dischargeForm.follow_up_instructions}
                      onChange={(e) => setDischargeForm(prev => ({ ...prev, follow_up_instructions: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedHospitalisation(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Discharging..." : "Discharge Patient"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Discharges */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Discharges</CardTitle>
            <CardDescription>Recently discharged patients</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Discharge Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* This would be populated with recent discharges */}
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No recent discharges to display</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 