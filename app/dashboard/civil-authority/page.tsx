"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stamp, FileText, Baby, Clock, CheckCircle, AlertTriangle, ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CivilAuthorityPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [birthCertificates, setBirthCertificates] = useState<any[]>([])
  const [deathCertificates, setDeathCertificates] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Admin") {
      router.push("/dashboard")
      return
    }

    loadCertificates()
  }, [router])

  const loadCertificates = () => {
    const birthCerts = JSON.parse(localStorage.getItem("birthCertificates") || "[]")
    const deathCerts = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
    setBirthCertificates(birthCerts)
    setDeathCertificates(deathCerts)
  }

  const approveCertificate = (certId: string, type: "birth" | "death") => {
    const certs = type === "birth" ? birthCertificates : deathCertificates
    const updatedCerts = certs.map((cert) => {
      if (cert.id === certId) {
        return {
          ...cert,
          status: "approved",
          approvedBy: currentUser.name,
          approvedAt: new Date().toISOString(),
        }
      }
      return cert
    })

    if (type === "birth") {
      localStorage.setItem("birthCertificates", JSON.stringify(updatedCerts))
      setBirthCertificates(updatedCerts)
    } else {
      localStorage.setItem("deathCertificates", JSON.stringify(updatedCerts))
      setDeathCertificates(updatedCerts)
    }
  }

  const rejectCertificate = (certId: string, type: "birth" | "death") => {
    const certs = type === "birth" ? birthCertificates : deathCertificates
    const updatedCerts = certs.map((cert) => {
      if (cert.id === certId) {
        return {
          ...cert,
          status: "rejected",
          rejectedBy: currentUser.name,
          rejectedAt: new Date().toISOString(),
        }
      }
      return cert
    })

    if (type === "birth") {
      localStorage.setItem("birthCertificates", JSON.stringify(updatedCerts))
      setBirthCertificates(updatedCerts)
    } else {
      localStorage.setItem("deathCertificates", JSON.stringify(updatedCerts))
      setDeathCertificates(updatedCerts)
    }
  }

  const filteredBirthCerts = birthCertificates.filter(
    (cert) =>
      cert.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.motherName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDeathCerts = deathCertificates.filter(
    (cert) =>
      cert.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.placeOfDeath.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Stamp className="h-8 w-8 text-blue-600" />
              Certificate Management
            </h1>
            <p className="text-gray-600">Manage birth and death certificates</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="birth" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="birth">Birth Certificates</TabsTrigger>
            <TabsTrigger value="death">Death Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="birth">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-blue-600" />
                  Birth Certificates
                </CardTitle>
                <CardDescription>Review and manage birth certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBirthCerts.map((cert) => (
                      <div key={cert.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                              <Baby className="h-5 w-5 text-blue-600" />
                          <h3 className="font-medium">{cert.childName}</h3>
                        </div>
                        <Badge
                          variant={
                            cert.status === "approved"
                              ? "default"
                              : cert.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {cert.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Certificate ID: {cert.certificateId}</p>
                        <p>Date of Birth: {new Date(cert.dateOfBirth).toLocaleDateString()}</p>
                        <p>Mother: {cert.motherName}</p>
                        <p>Father: {cert.fatherName}</p>
                          <p>Submitted by: {cert.submittedBy}</p>
                        {cert.status === "approved" && (
                          <>
                            <p>Approved by: {cert.approvedBy}</p>
                            <p>Approved at: {new Date(cert.approvedAt).toLocaleString()}</p>
                          </>
                        )}
                        {cert.status === "rejected" && (
                          <>
                            <p>Rejected by: {cert.rejectedBy}</p>
                            <p>Rejected at: {new Date(cert.rejectedAt).toLocaleString()}</p>
                          </>
                        )}
                        </div>
                      {cert.status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <Button onClick={() => approveCertificate(cert.id, "birth")} variant="default">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button onClick={() => rejectCertificate(cert.id, "birth")} variant="destructive">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="death">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  Death Certificates
                </CardTitle>
                <CardDescription>Review and manage death certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDeathCerts.map((cert) => (
                      <div key={cert.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-red-600" />
                          <h3 className="font-medium">{cert.patientName}</h3>
                          </div>
                        <Badge
                          variant={
                            cert.status === "approved"
                              ? "default"
                              : cert.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {cert.status}
                        </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                        <p>Certificate ID: {cert.certificateId}</p>
                        <p>Date of Death: {new Date(cert.dateOfDeath).toLocaleDateString()}</p>
                        <p>Place of Death: {cert.placeOfDeath}</p>
                        <p>Cause of Death: {cert.causeOfDeath}</p>
                          <p>Submitted by: {cert.submittedBy}</p>
                        {cert.status === "approved" && (
                          <>
                          <p>Approved by: {cert.approvedBy}</p>
                          <p>Approved at: {new Date(cert.approvedAt).toLocaleString()}</p>
                          </>
                        )}
                        {cert.status === "rejected" && (
                          <>
                            <p>Rejected by: {cert.rejectedBy}</p>
                            <p>Rejected at: {new Date(cert.rejectedAt).toLocaleString()}</p>
                          </>
                        )}
                      </div>
                      {cert.status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <Button onClick={() => approveCertificate(cert.id, "death")} variant="default">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button onClick={() => rejectCertificate(cert.id, "death")} variant="destructive">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
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
