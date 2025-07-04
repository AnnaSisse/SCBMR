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
  Search,
  Filter,
  ArrowLeft,
  Baby,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  RefreshCw,
  FileCheck,
  FileX,
  Download,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function CertificatesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [birthCertificates, setBirthCertificates] = useState<any[]>([])
  const [deathCertificates, setDeathCertificates] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Civil Authority") {
      router.push("/dashboard")
      return
    }

    loadCertificates()
  }, [router])

  const loadCertificates = () => {
    try {
      const birthCerts = JSON.parse(localStorage.getItem("birthCertificates") || "[]")
      const deathCerts = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
      setBirthCertificates(birthCerts)
      setDeathCertificates(deathCerts)
    } catch (error) {
      console.error("Error loading certificates:", error)
      toast.error("Failed to load certificates")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCertificates = [...birthCertificates, ...deathCertificates].filter((cert) => {
    // Get the correct name property based on certificate type
    const certificateName = cert.type === "birth" ? cert.childName : cert.patientName;
    
    const matchesSearch = 
      (certificateName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (cert.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (cert.placeOfBirth?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (cert.placeOfDeath?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || 
      (filterType === "birth" && cert.type === "birth") ||
      (filterType === "death" && cert.type === "death")

    const matchesStatus = filterStatus === "all" || cert.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const updateCertificateStatus = (certId: string, newStatus: string) => {
    const updatedBirthCerts = birthCertificates.map((cert) => {
      if (cert.id === certId) {
        return {
          ...cert,
          status: newStatus,
          statusUpdatedAt: new Date().toISOString(),
          statusUpdatedBy: currentUser.name,
        }
      }
      return cert
    })

    const updatedDeathCerts = deathCertificates.map((cert) => {
      if (cert.id === certId) {
        return {
          ...cert,
          status: newStatus,
          statusUpdatedAt: new Date().toISOString(),
          statusUpdatedBy: currentUser.name,
        }
      }
      return cert
    })

    localStorage.setItem("birthCertificates", JSON.stringify(updatedBirthCerts))
    localStorage.setItem("deathCertificates", JSON.stringify(updatedDeathCerts))
    setBirthCertificates(updatedBirthCerts)
    setDeathCertificates(updatedDeathCerts)
    toast.success("Certificate status updated successfully")
  }

  const deleteCertificate = (certId: string) => {
    if (window.confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) {
      const updatedBirthCerts = birthCertificates.filter((cert) => cert.id !== certId)
      const updatedDeathCerts = deathCertificates.filter((cert) => cert.id !== certId)

      localStorage.setItem("birthCertificates", JSON.stringify(updatedBirthCerts))
      localStorage.setItem("deathCertificates", JSON.stringify(updatedDeathCerts))
      setBirthCertificates(updatedBirthCerts)
      setDeathCertificates(updatedDeathCerts)
      toast.success("Certificate deleted successfully")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Certificates
            </h1>
            <p className="text-gray-600">Manage birth and death certificates</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={loadCertificates}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{birthCertificates.length + deathCertificates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Birth Certificates</CardTitle>
              <Baby className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{birthCertificates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Death Certificates</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deathCertificates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {[...birthCertificates, ...deathCertificates].filter((cert) => cert.status === "Pending Review").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Certificates</CardTitle>
            <CardDescription>View and manage all certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="birth">Birth Certificates</SelectItem>
                    <SelectItem value="death">Death Certificates</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredCertificates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredCertificates.map((cert) => (
                    <div key={cert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            {cert.type === "birth" ? (
                              <Baby className="h-6 w-6 text-green-600" />
                            ) : (
                              <Heart className="h-6 w-6 text-red-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {cert.type === "birth" ? cert.childName : cert.patientName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>ID: {cert.id}</span>
                              {cert.placeOfBirth && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Place: {cert.placeOfBirth}</span>
                                </>
                              )}
                              {cert.placeOfDeath && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Place: {cert.placeOfDeath}</span>
                                </>
                              )}
                              {cert.dateOfBirth && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Date: {new Date(cert.dateOfBirth).toLocaleDateString()}</span>
                                </>
                              )}
                              {cert.dateOfDeath && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Date: {new Date(cert.dateOfDeath).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={cert.status === "Approved" ? "default" : cert.status === "Rejected" ? "destructive" : "secondary"}>
                            {cert.status}
                          </Badge>
                          <Badge variant="outline">{cert.type === "birth" ? "Birth" : "Death"}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Created: {new Date(cert.createdAt).toLocaleString()}
                          </div>
                          {cert.statusUpdatedAt && (
                            <div className="flex items-center gap-1">
                              {cert.status === "Approved" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : cert.status === "Rejected" ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                              Status Updated: {new Date(cert.statusUpdatedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {cert.status === "Pending Review" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCertificateStatus(cert.id, "Approved")}
                              >
                                <FileCheck className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => updateCertificateStatus(cert.id, "Rejected")}
                              >
                                <FileX className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/api/certificates/${cert.id}/download`, "_blank")}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteCertificate(cert.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
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