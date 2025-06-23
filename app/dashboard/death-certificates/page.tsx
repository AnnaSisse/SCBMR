"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Plus, ArrowLeft, Download, Eye } from "lucide-react"
import Link from "next/link"

export default function DeathCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([])
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

    // Only doctors and admins can access death certificates
    if (currentUser.role !== "Doctor" && currentUser.role !== "Admin") {
      router.push("/dashboard")
      return
    }

    loadCertificates()
  }, [router])

  const loadCertificates = () => {
    const storedCertificates = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
    setCertificates(storedCertificates)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending Review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
              <FileText className="h-8 w-8" />
              Death Certificates
            </h1>
            <p className="text-gray-600">Manage death certificate generation</p>
          </div>
        </div>

        <Link href="/dashboard/death-certificates/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Certificate
          </Button>
        </Link>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Death Certificates ({certificates.length})</CardTitle>
          <CardDescription>
            {certificates.length === 0 ? "No certificates generated" : `Showing ${certificates.length} certificates`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No death certificates</h3>
              <p className="text-gray-600 mb-4">Generate your first death certificate</p>
              <Link href="/dashboard/death-certificates/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate First Certificate
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
                    <TableHead>Cause of Death</TableHead>
                    <TableHead>Issued By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell className="font-medium">{certificate.certificateId}</TableCell>
                      <TableCell>{certificate.patientName}</TableCell>
                      <TableCell>{new Date(certificate.dateOfDeath).toLocaleDateString()}</TableCell>
                      <TableCell>{certificate.causeOfDeath}</TableCell>
                      <TableCell>Dr. {certificate.issuedBy}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(certificate.status)}>{certificate.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
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
