"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Users, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PatientDownloadPage() {
  const [user, setUser] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [downloadFormat, setDownloadFormat] = useState("csv")
  const [includeFields, setIncludeFields] = useState({
    basicInfo: true,
    contactInfo: true,
    medicalHistory: true,
    appointments: true,
    prescriptions: true,
    labResults: false,
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    // Load patients
    const patientsData = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(patientsData)
  }, [router])

  const handlePatientSelection = (patientId: string, checked: boolean) => {
    if (checked) {
      setSelectedPatients([...selectedPatients, patientId])
    } else {
      setSelectedPatients(selectedPatients.filter((id) => id !== patientId))
    }
  }

  const selectAllPatients = () => {
    setSelectedPatients(patients.map((p) => p.id))
  }

  const clearSelection = () => {
    setSelectedPatients([])
  }

  const downloadPatientData = async () => {
    if (selectedPatients.length === 0) {
      alert("Please select at least one patient")
      return
    }

    setIsDownloading(true)

    try {
      // Get selected patient data
      const selectedPatientData = patients.filter((p) => selectedPatients.includes(p.id))

      // Get additional data if requested
      const appointments = includeFields.appointments ? JSON.parse(localStorage.getItem("appointments") || "[]") : []
      const prescriptions = includeFields.prescriptions ? JSON.parse(localStorage.getItem("prescriptions") || "[]") : []

      // Prepare download data
      const downloadData = selectedPatientData.map((patient) => {
        const patientData: any = {}

        if (includeFields.basicInfo) {
          patientData.id = patient.id
          patientData.name = patient.name
          patientData.age = patient.age
          patientData.gender = patient.gender
          patientData.dateOfBirth = patient.dateOfBirth
        }

        if (includeFields.contactInfo) {
          patientData.phone = patient.phone
          patientData.email = patient.email
          patientData.address = patient.address
          patientData.emergencyContact = patient.emergencyContact
        }

        if (includeFields.medicalHistory) {
          patientData.medicalHistory = patient.medicalHistory
          patientData.allergies = patient.allergies
          patientData.currentMedications = patient.currentMedications
        }

        if (includeFields.appointments) {
          const patientAppointments = appointments.filter((apt: any) => apt.patientId === patient.id)
          patientData.totalAppointments = patientAppointments.length
          patientData.lastAppointment =
            patientAppointments.length > 0 ? patientAppointments[patientAppointments.length - 1].date : "None"
        }

        if (includeFields.prescriptions) {
          const patientPrescriptions = prescriptions.filter((presc: any) => presc.patientId === patient.id)
          patientData.totalPrescriptions = patientPrescriptions.length
          patientData.activePrescriptions = patientPrescriptions.filter((p: any) => p.status === "Active").length
        }

        return patientData
      })

      const filename = `patient_data_${new Date().toISOString().split("T")[0]}.${downloadFormat}`

      if (downloadFormat === "csv") {
        downloadAsCSV(downloadData, filename)
      } else if (downloadFormat === "json") {
        downloadAsJSON(downloadData, filename)
      } else if (downloadFormat === "xlsx") {
        downloadAsXLSX(downloadData, filename)
      }

      setTimeout(() => {
        setIsDownloading(false)
      }, 1000)
    } catch (error) {
      console.error("Download failed:", error)
      setIsDownloading(false)
      alert("Download failed. Please try again.")
    }
  }

  const downloadAsCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      `# Patient Data Export`,
      `# Generated: ${new Date().toLocaleString()}`,
      `# Generated by: ${user?.name} (${user?.role})`,
      `# Total Records: ${data.length}`,
      "",
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = String(row[header] || "")
            return value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value
          })
          .join(","),
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

  const downloadAsJSON = (data: any[], filename: string) => {
    const jsonData = {
      metadata: {
        title: "Patient Data Export",
        generated: new Date().toISOString(),
        generatedBy: `${user?.name} (${user?.role})`,
        totalRecords: data.length,
        fields: includeFields,
      },
      patients: data,
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAsXLSX = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const xmlContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Patient Data">
  <Table>
   <Row><Cell><Data ss:Type="String">Patient Data Export</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Generated: ${new Date().toLocaleString()}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Generated by: ${user?.name} (${user?.role})</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Total Records: ${data.length}</Data></Cell></Row>
   <Row></Row>
   <Row>
    ${headers.map((header) => `<Cell><Data ss:Type="String">${header}</Data></Cell>`).join("")}
   </Row>
   ${data
     .map(
       (row) => `
   <Row>
    ${headers
      .map(
        (header) =>
          `<Cell><Data ss:Type="String">${String(row[header] || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</Data></Cell>`,
      )
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
        <Link href="/dashboard/patients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Download className="h-8 w-8 text-blue-600" />
            Download Patient Data
          </h1>
          <p className="text-gray-600">Export patient information in various formats</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Patients ({selectedPatients.length} selected)
              </CardTitle>
              <CardDescription>Choose which patients to include in the export</CardDescription>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={selectAllPatients}>
                  Select All
                </Button>
                <Button size="sm" variant="outline" onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {patients.map((patient) => (
                  <div key={patient.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      id={patient.id}
                      checked={selectedPatients.includes(patient.id)}
                      onCheckedChange={(checked) => handlePatientSelection(patient.id, checked as boolean)}
                    />
                    <label htmlFor={patient.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">
                        {patient.age} years • {patient.gender} • {patient.phone}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Configuration */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Export Settings
              </CardTitle>
              <CardDescription>Configure your export preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Format Selection */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    <SelectItem value="json">JSON (JavaScript Object)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Field Selection */}
              <div className="space-y-3">
                <Label>Include Fields</Label>
                <div className="space-y-2">
                  {Object.entries(includeFields).map(([field, checked]) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={checked}
                        onCheckedChange={(checked) =>
                          setIncludeFields((prev) => ({ ...prev, [field]: checked as boolean }))
                        }
                      />
                      <label htmlFor={field} className="text-sm cursor-pointer">
                        {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={downloadPatientData}
                disabled={isDownloading || selectedPatients.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Data
                  </>
                )}
              </Button>

              {selectedPatients.length === 0 && (
                <p className="text-sm text-gray-500 text-center">Select patients to enable download</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
