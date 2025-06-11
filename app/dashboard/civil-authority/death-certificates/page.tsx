"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Download, ArrowLeft, Heart, Calendar, User, MapPin } from "lucide-react"
import Link from "next/link"

export default function DeathCertificatesPage() {
  const [deathCertificates, setDeathCertificates] = useState<any[]>([])
  const [filteredCertificates, setFilteredCertificates] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
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

    // Check if user has permission to view death certificates
    if (!["Admin", "Civil Authority"].includes(currentUser.role)) {
      router.push("/dashboard")
      return
    }

    loadDeathCertificates()
  }, [router])

  useEffect(() => {
    if (searchTerm) {
      const filtered = deathCertificates.filter(
        (cert) =>
          cert.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.placeOfDeath.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCertificates(filtered)
    } else {
      setFilteredCertificates(deathCertificates)
    }
  }, [searchTerm, deathCertificates])

  const loadDeathCertificates = () => {
    const storedCertificates = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
    setDeathCertificates(storedCertificates)
    setFilteredCertificates(storedCertificates)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const downloadCertificate = (certificate: any) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Death Certificate - ${certificate.certificateId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #333; padding-bottom: 20px; }
          .certificate-title { font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px; }
          .republic { font-size: 16px; color: #666; }
          .content { margin: 30px 0; }
          .section { margin: 20px 0; }
          .label { font-weight: bold; display: inline-block; width: 200px; }
          .value { display: inline-block; }
          .signatures { margin-top: 60px; display: flex; justify-content: space-between; }
          .signature-block { text-align: center; width: 200px; }
          .signature-line { border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; }
          .seal { text-align: center; margin: 40px 0; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="republic">REPUBLIC OF CAMEROON</div>
          <div class="republic">Peace - Work - Fatherland</div>
          <div class="certificate-title">DEATH CERTIFICATE</div>
          <div>Certificate No: ${certificate.certificateId}</div>
        </div>
        
        <div class="content">
          <div class="section">
            <h3>Deceased Information</h3>
            <div><span class="label">Full Name:</span> <span class="value">${certificate.patientName}</span></div>
            <div><span class="label">Date of Death:</span> <span class="value">${new Date(certificate.dateOfDeath).toLocaleDateString()}</span></div>
            <div><span class="label">Time of Death:</span> <span class="value">${certificate.timeOfDeath}</span></div>
            <div><span class="label">Place of Death:</span> <span class="value">${certificate.placeOfDeath}</span></div>
          </div>
          
          <div class="section">
            <h3>Cause of Death</h3>
            <div><span class="label">Immediate Cause:</span> <span class="value">${certificate.immediateCase}</span></div>
            <div><span class="label">Underlying Cause:</span> <span class="value">${certificate.underlyingCause}</span></div>
            <div><span class="label">Contributing Factors:</span> <span class="value">${certificate.contributingFactors}</span></div>
            <div><span class="label">Manner of Death:</span> <span class="value">${certificate.mannerOfDeath}</span></div>
          </div>
          
          <div class="section">
            <h3>Certification Information</h3>
            <div><span class="label">Certifier Name:</span> <span class="value">${certificate.certifierName}</span></div>
            <div><span class="label">Certifier Title:</span> <span class="value">${certificate.certifierTitle}</span></div>
            <div><span class="label">Date of Certification:</span> <span class="value">${new Date(certificate.dateOfCertification).toLocaleDateString()}</span></div>
          </div>
        </div>
        
        <div class="signatures">
          <div class="signature-block">
            <div class="signature-line">Civil Registrar</div>
          </div>
          <div class="signature-block">
            <div class="signature-line">Official Seal</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an official document issued by the Civil Registry of Cameroon</p>
          <p>Any alteration or falsification of this document is punishable by law</p>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Death_Certificate_${certificate.certificateId}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-600" />
              Death Certificates
            </h1>
            <p className="text-gray-600">Manage death certificate registrations and approvals</p>
          </div>
        </div>

        <Link href="/dashboard/civil-authority/death-certificates/new">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            New Death Certificate
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Death Certificates</CardTitle>
          <CardDescription>Find certificates by patient name, certificate ID, or place of death</CardDescription>
        </CardHeader>
        <CardContent>
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
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Total Certificates</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{deathCertificates.length}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Approved</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {deathCertificates.filter((cert) => cert.status === "Approved").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Review</CardTitle>
            <User className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {deathCertificates.filter((cert) => cert.status === "Pending Review").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">This Month</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {
                deathCertificates.filter((cert) => {
                  const certDate = new Date(cert.createdAt)
                  const now = new Date()
                  return certDate.getMonth() === now.getMonth() && certDate.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Death Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Death Certificates ({filteredCertificates.length})</CardTitle>
          <CardDescription>
            {filteredCertificates.length === 0
              ? "No death certificates found"
              : `Showing ${filteredCertificates.length} certificates`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No death certificates found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by registering the first death certificate"}
              </p>
              <Link href="/dashboard/civil-authority/death-certificates/new">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Register First Certificate
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Date of Death</TableHead>
                    <TableHead>Place of Death</TableHead>
                    <TableHead>Cause of Death</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell className="font-medium">{certificate.certificateId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-600" />
                          {certificate.patientName}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(certificate.dateOfDeath).toLocaleDateString()}</TableCell>
                      <TableCell>{certificate.placeOfDeath}</TableCell>
                      <TableCell>{certificate.immediateCase}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(certificate.status)}>{certificate.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(certificate.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => downloadCertificate(certificate)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 