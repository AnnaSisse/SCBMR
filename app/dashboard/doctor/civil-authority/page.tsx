"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stamp, FileText, Baby, Heart, Send, Clock, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DoctorCivilAuthorityPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [deathCertForm, setDeathCertForm] = useState({
    patientName: "",
    dateOfDeath: "",
    causeOfDeath: "",
    placeOfDeath: "",
    certifierName: "",
    certifierTitle: "",
    certifierLicense: "",
    additionalNotes: "",
  })
  const [birthCertForm, setBirthCertForm] = useState({
    childName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    gender: "",
    weight: "",
    length: "",
    motherName: "",
    fatherName: "",
    attendingPhysician: "",
    additionalNotes: "",
  })
  const [submittedCertificates, setSubmittedCertificates] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Doctor") {
      router.push("/dashboard")
      return
    }

    setDeathCertForm((prev) => ({ ...prev, certifierName: user.name, certifierTitle: "Doctor" }))
    setBirthCertForm((prev) => ({ ...prev, attendingPhysician: user.name }))

    const patientsData = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(patientsData)

    const deathCerts = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
    const birthCerts = JSON.parse(localStorage.getItem("birthCertificates") || "[]")
    setSubmittedCertificates([...deathCerts, ...birthCerts])
  }, [router])

  const submitDeathCertificate = () => {
    if (!deathCertForm.patientName || !deathCertForm.dateOfDeath || !deathCertForm.causeOfDeath) {
      alert("Please fill in all required fields")
      return
    }

    const deathCerts = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
    const newCert = {
      id: `DC${Date.now()}`,
      ...deathCertForm,
      status: "pending",
      submittedBy: currentUser.name,
      submittedAt: new Date().toISOString(),
    }
    deathCerts.push(newCert)
    localStorage.setItem("deathCertificates", JSON.stringify(deathCerts))
    setSubmittedCertificates((prev) => [...prev, newCert])
    setDeathCertForm({
      patientName: "",
      dateOfDeath: "",
      causeOfDeath: "",
      placeOfDeath: "",
      certifierName: currentUser.name,
      certifierTitle: "Doctor",
      certifierLicense: "",
      additionalNotes: "",
    })
    alert("Death certificate submitted successfully!")
  }

  const submitBirthCertificate = () => {
    if (!birthCertForm.childName || !birthCertForm.dateOfBirth || !birthCertForm.gender) {
      alert("Please fill in all required fields")
      return
    }

    const birthCerts = JSON.parse(localStorage.getItem("birthCertificates") || "[]")
    const newCert = {
      id: `BC${Date.now()}`,
      ...birthCertForm,
      status: "pending",
      submittedBy: currentUser.name,
      submittedAt: new Date().toISOString(),
    }
    birthCerts.push(newCert)
    localStorage.setItem("birthCertificates", JSON.stringify(birthCerts))
    setSubmittedCertificates((prev) => [...prev, newCert])
    setBirthCertForm({
      childName: "",
      dateOfBirth: "",
      timeOfBirth: "",
      gender: "",
      weight: "",
      length: "",
      motherName: "",
      fatherName: "",
      attendingPhysician: currentUser.name,
      additionalNotes: "",
    })
    alert("Birth certificate submitted successfully!")
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Stamp className="h-8 w-8 text-blue-600" />
              Civil Authority Certificates
            </h1>
            <p className="text-gray-600">Submit and manage birth and death certificates</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit">Submit Certificate</TabsTrigger>
            <TabsTrigger value="history">Certificate History</TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Death Certificate Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Death Certificate
                  </CardTitle>
                  <CardDescription>Submit a new death certificate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Patient Name</Label>
                    <Input
                      value={deathCertForm.patientName}
                      onChange={(e) => setDeathCertForm({ ...deathCertForm, patientName: e.target.value })}
                      placeholder="Enter patient's full name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Death</Label>
                      <Input
                        type="date"
                        value={deathCertForm.dateOfDeath}
                        onChange={(e) => setDeathCertForm({ ...deathCertForm, dateOfDeath: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Place of Death</Label>
                      <Input
                        value={deathCertForm.placeOfDeath}
                        onChange={(e) => setDeathCertForm({ ...deathCertForm, placeOfDeath: e.target.value })}
                        placeholder="Hospital, home, etc."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cause of Death</Label>
                    <Textarea
                      value={deathCertForm.causeOfDeath}
                      onChange={(e) => setDeathCertForm({ ...deathCertForm, causeOfDeath: e.target.value })}
                      placeholder="Enter cause of death"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={deathCertForm.additionalNotes}
                      onChange={(e) => setDeathCertForm({ ...deathCertForm, additionalNotes: e.target.value })}
                      placeholder="Any additional information"
                    />
                  </div>
                  <Button onClick={submitDeathCertificate} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Death Certificate
                  </Button>
                </CardContent>
              </Card>

              {/* Birth Certificate Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Baby className="h-5 w-5" />
                    Birth Certificate
                  </CardTitle>
                  <CardDescription>Submit a new birth certificate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Child's Name</Label>
                    <Input
                      value={birthCertForm.childName}
                      onChange={(e) => setBirthCertForm({ ...birthCertForm, childName: e.target.value })}
                      placeholder="Enter child's full name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={birthCertForm.dateOfBirth}
                        onChange={(e) => setBirthCertForm({ ...birthCertForm, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time of Birth</Label>
                      <Input
                        type="time"
                        value={birthCertForm.timeOfBirth}
                        onChange={(e) => setBirthCertForm({ ...birthCertForm, timeOfBirth: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={birthCertForm.gender}
                        onValueChange={(value) => setBirthCertForm({ ...birthCertForm, gender: value })}
                      >
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
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        value={birthCertForm.weight}
                        onChange={(e) => setBirthCertForm({ ...birthCertForm, weight: e.target.value })}
                        placeholder="Enter weight"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mother's Name</Label>
                      <Input
                        value={birthCertForm.motherName}
                        onChange={(e) => setBirthCertForm({ ...birthCertForm, motherName: e.target.value })}
                        placeholder="Enter mother's name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Father's Name</Label>
                      <Input
                        value={birthCertForm.fatherName}
                        onChange={(e) => setBirthCertForm({ ...birthCertForm, fatherName: e.target.value })}
                        placeholder="Enter father's name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={birthCertForm.additionalNotes}
                      onChange={(e) => setBirthCertForm({ ...birthCertForm, additionalNotes: e.target.value })}
                      placeholder="Any additional information"
                    />
                  </div>
                  <Button onClick={submitBirthCertificate} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Birth Certificate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Submitted Certificates
                </CardTitle>
                <CardDescription>View all certificates you have submitted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submittedCertificates.map((cert) => (
                    <div key={cert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {cert.id.startsWith("DC") ? (
                            <FileText className="h-5 w-5 text-red-600" />
                          ) : (
                            <Baby className="h-5 w-5 text-blue-600" />
                          )}
                          <h3 className="font-medium">
                            {cert.id.startsWith("DC") ? cert.patientName : cert.childName}
                          </h3>
                        </div>
                        <Badge
                          variant={cert.status === "approved" ? "default" : cert.status === "pending" ? "secondary" : "destructive"}
                        >
                          {cert.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Submitted: {new Date(cert.submittedAt).toLocaleString()}</p>
                        <p>Type: {cert.id.startsWith("DC") ? "Death Certificate" : "Birth Certificate"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
