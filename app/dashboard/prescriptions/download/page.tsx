"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Pill, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrescriptionDownloadPage() {
  const [user, setUser] = useState<any>(null)
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    doctor: "",
    patient: "",
    medication: "",
    status: "all",
    format: "pdf",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    // Load prescriptions
    const prescriptionsData = JSON.parse(localStorage.getItem("prescriptions") || "[]")
    setPrescriptions(prescriptionsData)

    // Set default date range (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    setFilters((prev) => ({
      ...prev,
      dateFrom: thirtyDaysAgo.toISOString().split("T")[0],
      dateTo: today.toISOString().split("T")[0],
    }))
  }, [router])

  const downloadPrescriptions = () => {
    // Filter prescriptions based on criteria
    const filteredPrescriptions = prescriptions.filter((prescription) => {
      const prescDate = new Date(prescription.date)
      const fromDate = new Date(filters.dateFrom)
      const toDate = new Date(filters.dateTo)

      if (prescDate < fromDate || prescDate > toDate) return false
      if (filters.doctor && !prescription.prescribedBy.toLowerCase().includes(filters.doctor.toLowerCase()))
        return false
      if (filters.patient && !prescription.patientName.toLowerCase().includes(filters.patient.toLowerCase()))
        return false
      if (filters.medication && !prescription.medication.toLowerCase().includes(filters.medication.toLowerCase()))
        return false
      if (filters.status !== "all" && prescription.status !== filters.status) return false

      return true
    })

    if (filteredPrescriptions.length === 0) {
      alert("No prescriptions found matching your criteria")
      return
    }

    const filename = `prescriptions_${filters.dateFrom}_to_${filters.dateTo}.${filters.format}`

    if (filters.format === "pdf") {
      downloadPrescriptionsAsPDF(filteredPrescriptions, filename)
    } else if (filters.format === "csv") {
      downloadPrescriptionsAsCSV(filteredPrescriptions, filename)
    }
  }

  const downloadPrescriptionsAsPDF = (data: any[], filename: string) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
          .header h1 { color: #2563eb; margin: 0; }
          .prescription { border: 1px solid #ddd; margin: 15px 0; padding: 15px; border-radius: 8px; }
          .prescription-header { background: #f8fafc; padding: 10px; margin: -15px -15px 15px -15px; border-radius: 8px 8px 0 0; }
          .prescription-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .detail-group { margin-bottom: 10px; }
          .detail-label { font-weight: bold; color: #374151; }
          .detail-value { color: #6b7280; }
          .medication-name { font-size: 18px; font-weight: bold; color: #2563eb; }
          .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .status.active { background: #dcfce7; color: #166534; }
          .status.completed { background: #e0e7ff; color: #3730a3; }
          .status.cancelled { background: #fee2e2; color: #991b1b; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Prescription Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Date Range: ${filters.dateFrom} to ${filters.dateTo}</p>
          <p>Total Prescriptions: ${data.length}</p>
        </div>
        
        ${data
          .map(
            (prescription) => `
          <div class="prescription">
            <div class="prescription-header">
              <div class="medication-name">${prescription.medication}</div>
              <span class="status ${prescription.status.toLowerCase()}">${prescription.status}</span>
            </div>
            <div class="prescription-details">
              <div>
                <div class="detail-group">
                  <div class="detail-label">Patient:</div>
                  <div class="detail-value">${prescription.patientName}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Prescribed By:</div>
                  <div class="detail-value">Dr. ${prescription.prescribedBy}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Date:</div>
                  <div class="detail-value">${new Date(prescription.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div>
                <div class="detail-group">
                  <div class="detail-label">Dosage:</div>
                  <div class="detail-value">${prescription.dosage}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Frequency:</div>
                  <div class="detail-value">${prescription.frequency}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Duration:</div>
                  <div class="detail-value">${prescription.duration || "Not specified"}</div>
                </div>
              </div>
            </div>
            ${
              prescription.instructions
                ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <div class="detail-label">Instructions:</div>
                <div class="detail-value">${prescription.instructions}</div>
              </div>
            `
                : ""
            }
          </div>
        `,
          )
          .join("")}
        
        <div class="footer">
          <p>MedRecord Pro - Healthcare Management System</p>
          <p>This report contains confidential medical information. Handle according to HIPAA guidelines.</p>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.replace(".pdf", ".html")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadPrescriptionsAsCSV = (data: any[], filename: string) => {
    const headers = [
      "Patient Name",
      "Medication",
      "Dosage",
      "Frequency",
      "Duration",
      "Prescribed By",
      "Date",
      "Status",
      "Instructions",
    ]
    const csvContent = [
      "# Prescription Report",
      `# Generated: ${new Date().toLocaleString()}`,
      `# Date Range: ${filters.dateFrom} to ${filters.dateTo}`,
      `# Total Records: ${data.length}`,
      "",
      headers.join(","),
      ...data.map((prescription) =>
        [
          `"${prescription.patientName}"`,
          `"${prescription.medication}"`,
          `"${prescription.dosage}"`,
          `"${prescription.frequency}"`,
          `"${prescription.duration || ""}"`,
          `"Dr. ${prescription.prescribedBy}"`,
          `"${new Date(prescription.date).toLocaleDateString()}"`,
          `"${prescription.status}"`,
          `"${prescription.instructions || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/prescriptions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prescriptions
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Download className="h-8 w-8 text-blue-600" />
            Download Prescriptions
          </h1>
          <p className="text-gray-600">Export prescription data with custom filters</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescription Export Settings
          </CardTitle>
          <CardDescription>Configure filters and format for prescription export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor (optional)</Label>
              <Input
                id="doctor"
                placeholder="Enter doctor name"
                value={filters.doctor}
                onChange={(e) => setFilters((prev) => ({ ...prev, doctor: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient">Patient (optional)</Label>
              <Input
                id="patient"
                placeholder="Enter patient name"
                value={filters.patient}
                onChange={(e) => setFilters((prev) => ({ ...prev, patient: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medication">Medication (optional)</Label>
              <Input
                id="medication"
                placeholder="Enter medication name"
                value={filters.medication}
                onChange={(e) => setFilters((prev) => ({ ...prev, medication: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select
              value={filters.format}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, format: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Download Button */}
          <Button onClick={downloadPrescriptions} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download Prescriptions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
