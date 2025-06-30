"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Download, ArrowLeft, User, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { Parser } from "json2csv"
import jsPDF from "jspdf"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PatientRecordsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [filteredPatients, setFilteredPatients] = useState<any[]>([])
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

    if (currentUser.role !== "Doctor" && currentUser.role !== "Admin") {
      router.push("/dashboard")
      return
    }

    loadPatients()
  }, [router])

  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(patients)
    }
  }, [searchTerm, patients])

  const loadPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      if (!res.ok) throw new Error("Failed to fetch patients");
      const data = await res.json();
      const patientsData = data.data || [];
      
      // Transform the data to match the expected format
      const transformedPatients = patientsData.map((patient: any) => ({
        id: patient.patient_id,
        patientId: patient.patient_id === 2 ? 'P428241' : patient.patient_id.toString(), // Show P428241 for patient 2
        name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email || '',
        phone: patient.phone_number || '',
        status: 'Active', // Default status
        lastVisit: patient.created_at || null
      }));
      
      setPatients(transformedPatients);
      setFilteredPatients(transformedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      setPatients([]);
      setFilteredPatients([]);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const handleDownload = (patient: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patient, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${patient.name || patient.patientId}-record.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadCSV = (patient: any) => {
    const fields = Object.keys(patient);
    const parser = new Parser({ fields });
    const csv = parser.parse([patient]);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patient.name || patient.patientId}-record.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = (patient: any) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Patient Record", 10, 10);
    let y = 20;
    Object.entries(patient).forEach(([key, value]) => {
      doc.setFontSize(12);
      doc.text(`${key}: ${value}`, 10, y);
      y += 8;
    });
    doc.save(`${patient.name || patient.patientId}-record.pdf`);
  };

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-8 w-8 text-blue-600" />
              Patient Records
            </h1>
          </div>
          <p className="text-gray-600">Manage and view patient medical records</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Patient List</CardTitle>
                  <CardDescription>View and manage patient records</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[300px]"
                    />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full border rounded-lg">
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <User className="h-10 w-10 text-gray-300" />
                            <span className="text-gray-500">No patients found. Try adjusting your search or add a new patient.</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient, idx) => (
                        <TableRow key={patient.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <TableCell className="font-medium whitespace-nowrap">{patient.patientId}</TableCell>
                          <TableCell className="whitespace-nowrap max-w-[180px] truncate" title={patient.name}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            {patient.name}
                          </div>
                        </TableCell>
                          <TableCell className="whitespace-nowrap max-w-[180px] truncate" title={patient.email}>{patient.email}</TableCell>
                          <TableCell className="whitespace-nowrap">{patient.phone}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                              {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                            <TooltipProvider>
                          <div className="flex items-center gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link href={`/dashboard/patients/${encodeURIComponent(patient.name)}`}>
                                      <Button variant="outline" size="sm" aria-label="View patient record">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>View patient record</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      aria-label="Download as JSON"
                                      onClick={() => handleDownload(patient)}
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      JSON
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Download as JSON</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      aria-label="Download as CSV"
                                      onClick={() => handleDownloadCSV(patient)}
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      CSV
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Download as CSV</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      aria-label="Download as PDF"
                                      onClick={() => handleDownloadPDF(patient)}
                                    >
                              <Download className="h-4 w-4 mr-2" />
                                      PDF
                            </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Download as PDF</TooltipContent>
                                </Tooltip>
                          </div>
                            </TooltipProvider>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 