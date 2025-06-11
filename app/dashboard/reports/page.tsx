"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Users,
  Activity,
  Pill,
  Video,
  Heart,
  Baby,
  BarChart3,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: any
  requiredRole: string[]
  parameters: string[]
  formats: string[]
}

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null)
  const [reportData, setReportData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    department: "",
    doctor: "",
    status: "",
    format: "pdf",
  })
  const [previewMode, setPreviewMode] = useState(false)
  const router = useRouter()

  const reportTemplates: ReportTemplate[] = [
    {
      id: "patient-demographics",
      name: "Patient Demographics Report",
      description: "Comprehensive patient population analysis",
      category: "Patient Management",
      icon: Users,
      requiredRole: ["Admin", "Doctor"],
      parameters: ["dateRange", "ageGroup", "gender"],
      formats: ["pdf", "csv", "xlsx"],
    },
    {
      id: "appointments-summary",
      name: "Appointments Summary",
      description: "Detailed appointment statistics and trends",
      category: "Scheduling",
      icon: Calendar,
      requiredRole: ["Admin", "Doctor", "Receptionist"],
      parameters: ["dateRange", "doctor", "status"],
      formats: ["pdf", "csv", "xlsx"],
    },
    {
      id: "prescription-audit",
      name: "Prescription Audit Report",
      description: "Medication prescribing patterns and compliance",
      category: "Pharmacy",
      icon: Pill,
      requiredRole: ["Admin", "Doctor"],
      parameters: ["dateRange", "medication", "doctor"],
      formats: ["pdf", "csv", "xlsx"],
    },
    {
      id: "lab-results-summary",
      name: "Laboratory Results Summary",
      description: "Lab test results and trends analysis",
      category: "Laboratory",
      icon: Activity,
      requiredRole: ["Admin", "Doctor", "Lab Technician"],
      parameters: ["dateRange", "testType", "abnormalOnly"],
      formats: ["pdf", "csv", "xlsx"],
    },
    {
      id: "telemedicine-usage",
      name: "Telemedicine Usage Report",
      description: "Virtual consultation statistics and outcomes",
      category: "Telemedicine",
      icon: Video,
      requiredRole: ["Admin", "Doctor"],
      parameters: ["dateRange", "consultationType", "doctor"],
      formats: ["pdf", "csv", "xlsx"],
    },
    {
      id: "death-certificates",
      name: "Death Certificates Report",
      description: "Death certificate issuance and statistics",
      category: "Civil Registry",
      icon: Heart,
      requiredRole: ["Admin", "Doctor", "Civil Authority"],
      parameters: ["dateRange", "causeOfDeath", "doctor"],
      formats: ["pdf", "csv"],
    },
    {
      id: "birth-certificates",
      name: "Birth Certificates Report",
      description: "Birth certificate registrations and trends",
      category: "Civil Registry",
      icon: Baby,
      requiredRole: ["Admin", "Civil Authority"],
      parameters: ["dateRange", "hospital", "complications"],
      formats: ["pdf", "csv"],
    },
    {
      id: "financial-summary",
      name: "Financial Summary Report",
      description: "Revenue, billing, and payment analysis",
      category: "Financial",
      icon: BarChart3,
      requiredRole: ["Admin", "Receptionist"],
      parameters: ["dateRange", "paymentMethod", "insuranceProvider"],
      formats: ["pdf", "xlsx"],
    },
    {
      id: "security-audit",
      name: "Security Audit Report",
      description: "System access logs and security events",
      category: "Security",
      icon: AlertCircle,
      requiredRole: ["Admin"],
      parameters: ["dateRange", "eventType", "severity"],
      formats: ["pdf", "csv"],
    },
  ]

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    // Set default date range (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    setFilters((prev) => ({
      ...prev,
      dateFrom: thirtyDaysAgo.toISOString().split("T")[0],
      dateTo: today.toISOString().split("T")[0],
    }))
  }, [router])

  const getAvailableReports = () => {
    if (!user) return []
    return reportTemplates.filter((template) => template.requiredRole.includes(user.role))
  }

  const generateReport = async () => {
    if (!selectedReport) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate report generation with progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock report data based on selected report
      const data = await generateMockReportData(selectedReport.id)
      setReportData(data)
      setGenerationProgress(100)

      setTimeout(() => {
        setIsGenerating(false)
        setPreviewMode(true)
      }, 500)
    } catch (error) {
      console.error("Report generation failed:", error)
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const generateMockReportData = async (reportId: string) => {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]")
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]")
    const consultations = JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]")

    switch (reportId) {
      case "patient-demographics":
        return {
          title: "Patient Demographics Report",
          generatedAt: new Date().toISOString(),
          dateRange: `${filters.dateFrom} to ${filters.dateTo}`,
          summary: {
            totalPatients: patients.length,
            averageAge: patients.reduce((sum: number, p: any) => sum + p.age, 0) / patients.length || 0,
            genderDistribution: {
              male: patients.filter((p: any) => p.gender === "Male").length,
              female: patients.filter((p: any) => p.gender === "Female").length,
            },
          },
          data: patients.map((p: any) => ({
            id: p.id,
            name: p.name,
            age: p.age,
            gender: p.gender,
            phone: p.phone,
            registrationDate: p.createdAt,
          })),
        }

      case "appointments-summary":
        return {
          title: "Appointments Summary Report",
          generatedAt: new Date().toISOString(),
          dateRange: `${filters.dateFrom} to ${filters.dateTo}`,
          summary: {
            totalAppointments: appointments.length,
            completedAppointments: appointments.filter((a: any) => a.status === "Completed").length,
            cancelledAppointments: appointments.filter((a: any) => a.status === "Cancelled").length,
            averagePerDay: (appointments.length / 30).toFixed(1),
          },
          data: appointments.map((a: any) => ({
            id: a.id,
            patientName: a.patientName,
            doctor: a.doctor,
            date: a.date,
            time: a.time,
            status: a.status,
            type: a.type,
          })),
        }

      case "prescription-audit":
        return {
          title: "Prescription Audit Report",
          generatedAt: new Date().toISOString(),
          dateRange: `${filters.dateFrom} to ${filters.dateTo}`,
          summary: {
            totalPrescriptions: prescriptions.length,
            uniqueMedications: [...new Set(prescriptions.map((p: any) => p.medication))].length,
            averagePerPatient: (prescriptions.length / patients.length).toFixed(1),
          },
          data: prescriptions.map((p: any) => ({
            id: p.id,
            patientName: p.patientName,
            medication: p.medication,
            dosage: p.dosage,
            frequency: p.frequency,
            prescribedBy: p.prescribedBy,
            date: p.date,
          })),
        }

      default:
        return {
          title: selectedReport?.name || "Report",
          generatedAt: new Date().toISOString(),
          dateRange: `${filters.dateFrom} to ${filters.dateTo}`,
          summary: { message: "Report generated successfully" },
          data: [],
        }
    }
  }

  const downloadReport = (format: string) => {
    if (!reportData) return

    const filename = `${selectedReport?.id}_${new Date().toISOString().split("T")[0]}.${format}`

    switch (format) {
      case "pdf":
        downloadAsPDF(reportData, filename)
        break
      case "csv":
        downloadAsCSV(reportData, filename)
        break
      case "xlsx":
        downloadAsXLSX(reportData, filename)
        break
    }
  }

  const downloadAsPDF = (data: any, filename: string) => {
    // Create comprehensive HTML content for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.title}</title>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0; 
          padding: 20px; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .summary { 
          background: #f8fafc; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        .summary h3 {
          margin-top: 0;
          color: #2563eb;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .summary-item {
          background: white;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-value {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 5px;
        }
        .summary-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th, td { 
          border: 1px solid #e2e8f0; 
          padding: 12px 8px; 
          text-align: left; 
          font-size: 14px;
        }
        th { 
          background-color: #2563eb; 
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        tr:hover {
          background-color: #e2e8f0;
        }
        .footer { 
          margin-top: 40px; 
          text-align: center; 
          font-size: 12px; 
          color: #666; 
          border-top: 2px solid #e2e8f0;
          padding-top: 20px;
        }
        .footer .logo {
          font-weight: bold;
          color: #2563eb;
          font-size: 14px;
        }
        .no-data {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }
        @media print {
          body { margin: 0; }
          .header { page-break-after: avoid; }
          table { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.title}</h1>
        <p><strong>Generated:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
        <p><strong>Date Range:</strong> ${data.dateRange}</p>
        <p><strong>Generated by:</strong> ${user?.name || "System"} (${user?.role || "Unknown"})</p>
      </div>
      
      <div class="summary">
        <h3>Executive Summary</h3>
        <div class="summary-grid">
          ${Object.entries(data.summary)
            .map(
              ([key, value]) => `
              <div class="summary-item">
                <div class="summary-value">${typeof value === "number" ? value.toLocaleString() : value}</div>
                <div class="summary-label">${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</div>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>
      
      ${
        data.data && data.data.length > 0
          ? `
        <h3>Detailed Data</h3>
        <table>
          <thead>
            <tr>
              ${Object.keys(data.data[0])
                .map((key) => `<th>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${data.data
              .map(
                (row: any) => `
              <tr>
                ${Object.values(row)
                  .map((value) => `<td>${String(value)}</td>`)
                  .join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `
          : '<div class="no-data">No detailed data available for the selected criteria.</div>'
      }
      
      <div class="footer">
        <div class="logo">MedRecord Pro - Healthcare Management System</div>
        <p>This report contains confidential medical information.</p>
        <p>Handle according to HIPAA guidelines and institutional policies.</p>
        <p>Report ID: ${selectedReport?.id}-${Date.now()}</p>
      </div>
    </body>
    </html>
  `

    // Create and download the HTML file (which can be printed to PDF)
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.replace(".pdf", ".html")
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show instructions for PDF conversion
    setTimeout(() => {
      alert(
        'HTML report downloaded! To convert to PDF:\n1. Open the downloaded HTML file in your browser\n2. Press Ctrl+P (or Cmd+P on Mac)\n3. Select "Save as PDF" as the destination\n4. Click Save',
      )
    }, 500)
  }

  const downloadAsCSV = (data: any, filename: string) => {
    if (!data.data || data.data.length === 0) {
      alert("No data available to export")
      return
    }

    const headers = Object.keys(data.data[0])
    const csvRows = [
      // Report metadata
      `# ${data.title}`,
      `# Generated: ${new Date(data.generatedAt).toLocaleString()}`,
      `# Date Range: ${data.dateRange}`,
      `# Generated by: ${user?.name || "System"} (${user?.role || "Unknown"})`,
      "",
      "# Summary",
      ...Object.entries(data.summary).map(([key, value]) => `# ${key.replace(/([A-Z])/g, " $1")}: ${value}`),
      "",
      "# Detailed Data",
      // Headers
      headers
        .map((header) => `"${header.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}"`)
        .join(","),
      // Data rows
      ...data.data.map((row: any) =>
        headers
          .map((header) => {
            const value = String(row[header] || "")
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (value.includes(",") || value.includes('"') || value.includes("\n")) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAsXLSX = (data: any, filename: string) => {
    if (!data.data || data.data.length === 0) {
      alert("No data available to export")
      return
    }

    // Create Excel-compatible XML format
    const headers = Object.keys(data.data[0])
    const xmlContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${data.title}</Title>
  <Author>MedRecord Pro</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1"/>
   <Interior ss:Color="#2563eb" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Summary">
   <Font ss:Bold="1"/>
   <Interior ss:Color="#f8fafc" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Report">
  <Table>
   <Row>
    <Cell ss:StyleID="Summary"><Data ss:Type="String">${data.title}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Generated: ${new Date(data.generatedAt).toLocaleString()}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Date Range: ${data.dateRange}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Generated by: ${user?.name || "System"} (${user?.role || "Unknown"})</Data></Cell>
   </Row>
   <Row></Row>
   <Row>
    <Cell ss:StyleID="Summary"><Data ss:Type="String">Summary</Data></Cell>
   </Row>
   ${Object.entries(data.summary)
     .map(
       ([key, value]) => `
   <Row>
    <Cell><Data ss:Type="String">${key.replace(/([A-Z])/g, " $1")}</Data></Cell>
    <Cell><Data ss:Type="${typeof value === "number" ? "Number" : "String"}">${value}</Data></Cell>
   </Row>
   `,
     )
     .join("")}
   <Row></Row>
   <Row>
    <Cell ss:StyleID="Summary"><Data ss:Type="String">Detailed Data</Data></Cell>
   </Row>
   <Row>
    ${headers
      .map(
        (header) => `
    <Cell ss:StyleID="Header"><Data ss:Type="String">${header.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</Data></Cell>
    `,
      )
      .join("")}
   </Row>
   ${data.data
     .map(
       (row: any) => `
   <Row>
    ${headers
      .map((header) => {
        const value = row[header]
        const dataType = typeof value === "number" ? "Number" : "String"
        return `<Cell><Data ss:Type="${dataType}">${String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</Data></Cell>`
      })
      .join("")}
   </Row>
   `,
     )
     .join("")}
  </Table>
 </Worksheet>
</Workbook>`

    const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.replace(".xlsx", ".xls")
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const availableReports = getAvailableReports()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600">Generate and download comprehensive system reports</p>
        </div>
      </div>

      {!selectedReport && !previewMode && (
        <div className="space-y-6">
          {/* Report Categories */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="Patient Management">Patients</TabsTrigger>
              <TabsTrigger value="Scheduling">Scheduling</TabsTrigger>
              <TabsTrigger value="Laboratory">Laboratory</TabsTrigger>
              <TabsTrigger value="Financial">Financial</TabsTrigger>
              <TabsTrigger value="Security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableReports.map((report) => (
                  <Card
                    key={report.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200"
                    onClick={() => setSelectedReport(report)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <report.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {report.category}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        {report.formats.map((format) => (
                          <Badge key={format} variant="secondary" className="text-xs">
                            {format.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {["Patient Management", "Scheduling", "Laboratory", "Financial", "Security"].map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableReports
                    .filter((report) => report.category === category)
                    .map((report) => (
                      <Card
                        key={report.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200"
                        onClick={() => setSelectedReport(report)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <report.icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{report.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {report.category}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>{report.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 flex-wrap">
                            {report.formats.map((format) => (
                              <Badge key={format} variant="secondary" className="text-xs">
                                {format.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {/* Report Configuration */}
      {selectedReport && !previewMode && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <selectedReport.icon className="h-6 w-6 text-blue-600" />
                {selectedReport.name}
              </h2>
              <p className="text-gray-600">{selectedReport.description}</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Report Configuration
              </CardTitle>
              <CardDescription>Configure filters and parameters for your report</CardDescription>
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

              {/* Additional Filters */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
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
                    {selectedReport.formats.map((format) => (
                      <SelectItem key={format} value={format}>
                        <div className="flex items-center gap-2">
                          {format === "pdf" && <FileText className="h-4 w-4" />}
                          {format === "csv" && <FileSpreadsheet className="h-4 w-4" />}
                          {format === "xlsx" && <FileSpreadsheet className="h-4 w-4" />}
                          {format.toUpperCase()}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <div className="flex gap-4">
                <Button onClick={generateReport} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Cancel
                </Button>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating report...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Preview and Download */}
      {previewMode && reportData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Report Generated Successfully
              </h2>
              <p className="text-gray-600">Preview your report and download in your preferred format</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Configuration
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedReport(null)
                  setPreviewMode(false)
                  setReportData(null)
                }}
              >
                New Report
              </Button>
            </div>
          </div>

          {/* Download Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Options
              </CardTitle>
              <CardDescription>Choose your preferred format to download the report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {selectedReport?.formats.map((format) => (
                  <Button
                    key={format}
                    onClick={() => downloadReport(format)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {format === "pdf" && <FileText className="h-4 w-4" />}
                    {format === "csv" && <FileSpreadsheet className="h-4 w-4" />}
                    {format === "xlsx" && <FileSpreadsheet className="h-4 w-4" />}
                    Download {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                Generated on {new Date(reportData.generatedAt).toLocaleString()} | Date Range: {reportData.dateRange}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Summary</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(reportData.summary).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{String(value)}</div>
                        <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Table Preview */}
                {reportData.data && reportData.data.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Data Preview (First 10 rows)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            {Object.keys(reportData.data[0]).map((header) => (
                              <th key={header} className="border border-gray-300 px-4 py-2 text-left font-medium">
                                {header.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.data.slice(0, 10).map((row: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                                  {String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {reportData.data.length > 10 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Showing 10 of {reportData.data.length} total records. Download the full report to see all data.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
