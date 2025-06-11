"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, FileText, Baby, Heart, Clock, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DataManagementPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [certificates, setCertificates] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Data Manager") {
      router.push("/dashboard")
      return
    }

    const deathCerts = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
    const birthCerts = JSON.parse(localStorage.getItem("birthCertificates") || "[]")
    setCertificates([...deathCerts, ...birthCerts])
  }, [router])

  const archiveCertificate = (certId: string) => {
    const updatedCerts = certificates.map((cert) => {
      if (cert.id === certId) {
        return {
          ...cert,
          archived: true,
          archivedAt: new Date().toISOString(),
          archivedBy: currentUser.name,
        }
      }
      return cert
    })

    const deathCerts = updatedCerts.filter((cert) => cert.id.startsWith("DC"))
    const birthCerts = updatedCerts.filter((cert) => cert.id.startsWith("BC"))

    localStorage.setItem("deathCertificates", JSON.stringify(deathCerts))
    localStorage.setItem("birthCertificates", JSON.stringify(birthCerts))
    setCertificates(updatedCerts)
  }

  const restoreCertificate = (certId: string) => {
    const updatedCerts = certificates.map((cert) => {
      if (cert.id === certId) {
        return {
          ...cert,
          archived: false,
          archivedAt: null,
          archivedBy: null,
        }
      }
      return cert
    })

    const deathCerts = updatedCerts.filter((cert) => cert.id.startsWith("DC"))
    const birthCerts = updatedCerts.filter((cert) => cert.id.startsWith("BC"))

    localStorage.setItem("deathCertificates", JSON.stringify(deathCerts))
    localStorage.setItem("birthCertificates", JSON.stringify(birthCerts))
    setCertificates(updatedCerts)
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
              <Database className="h-8 w-8 text-blue-600" />
              Data Management
            </h1>
            <p className="text-gray-600">Manage and archive certificates</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Records</TabsTrigger>
            <TabsTrigger value="archived">Archived Records</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Active Certificates
                </CardTitle>
                <CardDescription>View and manage active certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates
                    .filter((cert) => !cert.archived)
                    .map((cert) => (
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
                            variant={
                              cert.status === "approved"
                                ? "default"
                                : cert.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {cert.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>Submitted: {new Date(cert.submittedAt).toLocaleString()}</p>
                          <p>Type: {cert.id.startsWith("DC") ? "Death Certificate" : "Birth Certificate"}</p>
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
                              <p>Reason: {cert.rejectionReason}</p>
                            </>
                          )}
                        </div>
                        <Button onClick={() => archiveCertificate(cert.id)} variant="outline">
                          Archive Record
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Archived Certificates
                </CardTitle>
                <CardDescription>View and restore archived certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates
                    .filter((cert) => cert.archived)
                    .map((cert) => (
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
                          <Badge variant="secondary">Archived</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>Submitted: {new Date(cert.submittedAt).toLocaleString()}</p>
                          <p>Type: {cert.id.startsWith("DC") ? "Death Certificate" : "Birth Certificate"}</p>
                          <p>Submitted by: {cert.submittedBy}</p>
                          <p>Archived by: {cert.archivedBy}</p>
                          <p>Archived at: {new Date(cert.archivedAt).toLocaleString()}</p>
                        </div>
                        <Button onClick={() => restoreCertificate(cert.id)} variant="outline">
                          Restore Record
                        </Button>
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