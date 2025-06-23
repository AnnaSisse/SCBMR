"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, FileText, DollarSign, CheckCircle, Clock, Upload, Download, Search, Phone } from "lucide-react"

export default function InsurancePage() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  useEffect(() => {
    const patientsData = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(patientsData)
  }, [])

  const verifyInsurance = async (patientId: string) => {
    // Simulate insurance verification API call
    setVerificationResult({ status: "verifying" })

    setTimeout(() => {
      const mockResult = {
        status: "verified",
        planName: "Blue Cross Blue Shield Premium",
        policyNumber: "BC123456789",
        groupNumber: "GRP001",
        effectiveDate: "2024-01-01",
        expirationDate: "2024-12-31",
        copay: "$25",
        deductible: "$500",
        deductibleMet: "$150",
        coverageDetails: {
          primaryCare: "100% after copay",
          specialist: "80% after deductible",
          emergency: "90% after $100 copay",
          prescription: "Generic $10, Brand $30",
        },
        preAuthRequired: ["MRI", "CT Scan", "Surgery"],
        eligibilityStatus: "Active",
      }
      setVerificationResult(mockResult)
    }, 2000)
  }

  const billingRecords = [
    {
      id: "INV001",
      patientName: "John Patient",
      serviceDate: "2024-01-10",
      services: ["Office Visit", "Lab Work"],
      totalAmount: "$250.00",
      insurancePaid: "$200.00",
      patientBalance: "$50.00",
      status: "paid",
    },
    {
      id: "INV002",
      patientName: "Emily Davis",
      serviceDate: "2024-01-12",
      services: ["Consultation", "X-Ray"],
      totalAmount: "$180.00",
      insurancePaid: "$144.00",
      patientBalance: "$36.00",
      status: "pending",
    },
    {
      id: "INV003",
      patientName: "Robert Wilson",
      serviceDate: "2024-01-14",
      services: ["Follow-up", "Prescription"],
      totalAmount: "$120.00",
      insurancePaid: "$96.00",
      patientBalance: "$24.00",
      status: "overdue",
    },
  ]

  const preAuthRequests = [
    {
      id: "PA001",
      patientName: "Maria Rodriguez",
      procedure: "MRI Brain",
      requestDate: "2024-01-13",
      status: "pending",
      urgency: "routine",
    },
    {
      id: "PA002",
      patientName: "James Thompson",
      procedure: "Cardiac Catheterization",
      requestDate: "2024-01-14",
      status: "approved",
      urgency: "urgent",
    },
    {
      id: "PA003",
      patientName: "Sarah Johnson",
      procedure: "Physical Therapy",
      requestDate: "2024-01-15",
      status: "denied",
      urgency: "routine",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
      case "verifying":
        return "bg-yellow-100 text-yellow-800"
      case "denied":
      case "overdue":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Insurance & Billing Management
          </h1>
          <p className="text-gray-600">Comprehensive insurance verification and billing operations</p>
        </div>

        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="verification">Insurance Verification</TabsTrigger>
            <TabsTrigger value="preauth">Pre-Authorization</TabsTrigger>
            <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
            <TabsTrigger value="documents">Document Management</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>

          <TabsContent value="verification" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Patient Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Select Patient
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input placeholder="Search patients..." />
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {patients.map((patient) => (
                        <div
                          key={patient.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPatient?.id === patient.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-500">DOB: {patient.dateOfBirth}</p>
                          <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Verification */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Insurance Verification
                    </CardTitle>
                    <CardDescription>
                      {selectedPatient
                        ? `Verifying insurance for ${selectedPatient.name}`
                        : "Select a patient to verify insurance"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedPatient && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Insurance Provider</Label>
                            <p className="text-sm font-medium">
                              {selectedPatient.insurance?.split(" - ")[0] || "Not provided"}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Policy Number</Label>
                            <p className="text-sm font-medium">
                              {selectedPatient.insurance?.split(" - ")[1] || "Not provided"}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => verifyInsurance(selectedPatient.id)}
                          className="w-full"
                          disabled={verificationResult?.status === "verifying"}
                        >
                          {verificationResult?.status === "verifying" ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify Insurance
                            </>
                          )}
                        </Button>

                        {verificationResult && verificationResult.status !== "verifying" && (
                          <div className="mt-6 p-4 border rounded-lg bg-green-50">
                            <div className="flex items-center gap-2 mb-4">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <h4 className="font-medium text-green-900">Verification Complete</h4>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p>
                                  <span className="font-medium">Plan:</span> {verificationResult.planName}
                                </p>
                                <p>
                                  <span className="font-medium">Policy:</span> {verificationResult.policyNumber}
                                </p>
                                <p>
                                  <span className="font-medium">Group:</span> {verificationResult.groupNumber}
                                </p>
                                <p>
                                  <span className="font-medium">Status:</span>
                                  <Badge className="ml-2 bg-green-100 text-green-800">
                                    {verificationResult.eligibilityStatus}
                                  </Badge>
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Copay:</span> {verificationResult.copay}
                                </p>
                                <p>
                                  <span className="font-medium">Deductible:</span> {verificationResult.deductible}
                                </p>
                                <p>
                                  <span className="font-medium">Met:</span> {verificationResult.deductibleMet}
                                </p>
                                <p>
                                  <span className="font-medium">Expires:</span> {verificationResult.expirationDate}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Coverage Details:</h5>
                              <div className="text-sm space-y-1">
                                <p>• Primary Care: {verificationResult.coverageDetails.primaryCare}</p>
                                <p>• Specialist: {verificationResult.coverageDetails.specialist}</p>
                                <p>• Emergency: {verificationResult.coverageDetails.emergency}</p>
                                <p>• Prescription: {verificationResult.coverageDetails.prescription}</p>
                              </div>
                            </div>

                            {verificationResult.preAuthRequired.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-medium mb-2">Pre-Authorization Required:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {verificationResult.preAuthRequired.map((item: string, index: number) => (
                                    <Badge key={index} variant="outline">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preauth" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    New Pre-Authorization Request
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="procedure">Procedure/Service</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select procedure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mri">MRI Scan</SelectItem>
                        <SelectItem value="ct">CT Scan</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="pt">Physical Therapy</SelectItem>
                        <SelectItem value="specialist">Specialist Referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justification">Clinical Justification</Label>
                    <Textarea
                      id="justification"
                      placeholder="Provide medical necessity and clinical justification..."
                    />
                  </div>

                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Pre-Authorization
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pre-Authorization Status</CardTitle>
                  <CardDescription>Track pending and completed requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {preAuthRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{request.procedure}</p>
                          <p className="text-sm text-gray-600">Patient: {request.patientName}</p>
                          <p className="text-sm text-gray-500">Requested: {request.requestDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{request.urgency}</Badge>
                          <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Billing & Payment Collection
                </CardTitle>
                <CardDescription>Manage patient billing and payment processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{record.patientName}</h4>
                            <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Service Date: {record.serviceDate}</p>
                          <p className="text-sm text-gray-600">Services: {record.services.join(", ")}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Total Amount</p>
                              <p className="font-medium">{record.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Insurance Paid</p>
                              <p className="font-medium text-green-600">{record.insurancePaid}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Patient Balance</p>
                              <p className="font-medium text-orange-600">{record.patientBalance}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Document Management
                </CardTitle>
                <CardDescription>Upload and manage patient documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG, DOC</p>
                  <Button className="mt-4">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recent Documents</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Insurance Card - John Patient.pdf", date: "2024-01-15", size: "245 KB" },
                      { name: "Referral Letter - Emily Davis.pdf", date: "2024-01-14", size: "189 KB" },
                      { name: "Lab Results - Robert Wilson.pdf", date: "2024-01-13", size: "156 KB" },
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.date} • {doc.size}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical Record Requests
                </CardTitle>
                <CardDescription>Handle medical record requests and releases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient Request</SelectItem>
                        <SelectItem value="attorney">Attorney Request</SelectItem>
                        <SelectItem value="insurance">Insurance Company</SelectItem>
                        <SelectItem value="provider">Healthcare Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Processing Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                        <SelectItem value="expedited">Expedited (2-3 days)</SelectItem>
                        <SelectItem value="urgent">Urgent (24 hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recordsRequested">Records Requested</Label>
                  <Textarea
                    id="recordsRequested"
                    placeholder="Specify which records are being requested (date ranges, specific visits, etc.)..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorization">Authorization Status</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Patient authorization received</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">HIPAA release form signed</span>
                    </label>
                  </div>
                </div>

                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Process Record Request
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
