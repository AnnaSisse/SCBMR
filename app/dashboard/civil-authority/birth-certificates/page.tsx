"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BirthCertificatesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [certificates, setCertificates] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "CivilAuthority") {
      router.push("/dashboard")
      return
    }

    const certificatesData = JSON.parse(localStorage.getItem("birthCertificates") || "[]")
    setCertificates(certificatesData)
  }, [router])

  const filteredCertificates = certificates.filter((certificate) => {
    const matchesSearch = certificate.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || certificate.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleApprove = (certificateId: string) => {
    const updatedCertificates = certificates.map((cert) => {
      if (cert.id === certificateId) {
        return { ...cert, status: "approved" }
      }
      return cert
    })
    setCertificates(updatedCertificates)
    localStorage.setItem("birthCertificates", JSON.stringify(updatedCertificates))
  }

  const handleReject = (certificateId: string) => {
    const updatedCertificates = certificates.map((cert) => {
      if (cert.id === certificateId) {
        return { ...cert, status: "rejected" }
      }
      return cert
    })
    setCertificates(updatedCertificates)
    localStorage.setItem("birthCertificates", JSON.stringify(updatedCertificates))
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
              <FileText className="h-8 w-8 text-blue-600" />
              Birth Certificates
            </h1>
            <p className="text-gray-600">Review and manage birth certificate applications</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {certificates.filter((cert) => cert.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {certificates.filter((cert) => cert.status === "approved").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Applications</CardTitle>
            <CardDescription>Review and process birth certificate applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredCertificates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                    <p className="text-gray-600">Birth certificate applications will appear here when submitted</p>
                  </div>
                ) : (
                  filteredCertificates.map((certificate) => (
                    <div key={certificate.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{certificate.childName}</h3>
                          <p className="text-sm text-gray-500">Submitted by: {certificate.submittedBy}</p>
                        </div>
                        <Badge
                          variant={
                            certificate.status === "pending"
                              ? "default"
                              : certificate.status === "approved"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {certificate.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth: {certificate.dateOfBirth}</p>
                          <p className="text-sm text-gray-600">Place of Birth: {certificate.placeOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Parent/Guardian: {certificate.parentName}</p>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(certificate.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {certificate.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(certificate.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(certificate.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
