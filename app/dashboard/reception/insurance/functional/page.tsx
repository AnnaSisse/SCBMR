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
import {
  CreditCard,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  Download,
  Search,
  Phone,
  AlertTriangle,
  Mail,
  MapPin,
  Printer,
} from "lucide-react"

export default function FunctionalInsurancePage() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [billingRecords, setBillingRecords] = useState<any[]>([])
  const [preAuthRequests, setPreAuthRequests] = useState<any[]>([])

  useEffect(() => {
    const patientsData = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(patientsData)
    loadBillingData()
    loadPreAuthData()
  }, [])

  const loadBillingData = () => {
    const billing = JSON.parse(localStorage.getItem("billingRecords") || "[]")
    if (billing.length === 0) {
      // Generate sample billing data with FCFA
      const sampleBilling = [
        {
          id: "INV001",
          patientName: "John Patient",
          patientId: "P001",
          serviceDate: "2024-01-10",
          services: ["Office Visit", "Lab Work"],
          totalAmount: 125000, // FCFA
          insurancePaid: 100000, // FCFA
          patientBalance: 25000, // FCFA
          status: "paid",
          insuranceClaimId: "CLM001",
          patientPhone: "+237 696 162 344",
          patientEmail: "john.patient@email.com",
          patientAddress: "Douala, Cameroon",
        },
        {
          id: "INV002",
          patientName: "Emily Davis",
          patientId: "P002",
          serviceDate: "2024-01-12",
          services: ["Consultation", "X-Ray"],
          totalAmount: 90000, // FCFA
          insurancePaid: 72000, // FCFA
          patientBalance: 18000, // FCFA
          status: "pending",
          insuranceClaimId: "CLM002",
          patientPhone: "+237 677 123 456",
          patientEmail: "emily.davis@email.com",
          patientAddress: "Yaoundé, Cameroon",
        },
        {
          id: "INV003",
          patientName: "Robert Wilson",
          patientId: "P003",
          serviceDate: "2024-01-14",
          services: ["Follow-up", "Prescription"],
          totalAmount: 60000, // FCFA
          insurancePaid: 48000, // FCFA
          patientBalance: 12000, // FCFA
          status: "overdue",
          insuranceClaimId: "CLM003",
          patientPhone: "+237 655 789 012",
          patientEmail: "robert.wilson@email.com",
          patientAddress: "Bamenda, Cameroon",
        },
      ]
      localStorage.setItem("billingRecords", JSON.stringify(sampleBilling))
      setBillingRecords(sampleBilling)
    } else {
      setBillingRecords(billing)
    }
  }

  const loadPreAuthData = () => {
    const preAuth = JSON.parse(localStorage.getItem("preAuthRequests") || "[]")
    if (preAuth.length === 0) {
      // Generate sample pre-auth data with FCFA
      const samplePreAuth = [
        {
          id: "PA001",
          patientName: "Maria Rodriguez",
          patientId: "P003",
          procedure: "MRI Brain",
          requestDate: "2024-01-13",
          status: "pending",
          urgency: "routine",
          estimatedCost: 600000, // FCFA
        },
        {
          id: "PA002",
          patientName: "James Thompson",
          patientId: "P004",
          procedure: "Cardiac Catheterization",
          requestDate: "2024-01-14",
          status: "approved",
          urgency: "urgent",
          estimatedCost: 1750000, // FCFA
          approvalNumber: "AUTH12345",
        },
      ]
      localStorage.setItem("preAuthRequests", JSON.stringify(samplePreAuth))
      setPreAuthRequests(samplePreAuth)
    } else {
      setPreAuthRequests(preAuth)
    }
  }

  const verifyInsurance = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    setIsVerifying(true)
    setVerificationResult({ status: "verifying" })

    // Simulate API call delay
    setTimeout(() => {
      const mockResult = {
        status: "verified",
        planName: "CNPS Cameroon Health Insurance",
        policyNumber: selectedPatient.insurance?.split(" - ")[1] || "CNPS123456789",
        groupNumber: "GRP001",
        effectiveDate: "2024-01-01",
        expirationDate: "2024-12-31",
        copay: "12,500 FCFA",
        deductible: "250,000 FCFA",
        deductibleMet: "75,000 FCFA",
        coverageDetails: {
          primaryCare: "100% after copay",
          specialist: "80% after deductible",
          emergency: "90% after 50,000 FCFA copay",
          prescription: "Generic 5,000 FCFA, Brand 15,000 FCFA",
        },
        preAuthRequired: ["MRI", "CT Scan", "Surgery"],
        eligibilityStatus: "Active",
        verificationDate: new Date().toISOString(),
      }

      setVerificationResult(mockResult)
      setIsVerifying(false)

      // Save verification result
      const verifications = JSON.parse(localStorage.getItem("insuranceVerifications") || "[]")
      const newVerification = {
        id: `VER${Date.now()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        ...mockResult,
      }
      localStorage.setItem("insuranceVerifications", JSON.stringify([...verifications, newVerification]))
    }, 2000)
  }

  const submitPreAuth = (formData: any) => {
    const newRequest = {
      id: `PA${Date.now()}`,
      ...formData,
      requestDate: new Date().toISOString().split("T")[0],
      status: "pending",
      submittedBy: "Receptionist Jane Smith",
      submittedAt: new Date().toISOString(),
    }

    const updatedRequests = [...preAuthRequests, newRequest]
    setPreAuthRequests(updatedRequests)
    localStorage.setItem("preAuthRequests", JSON.stringify(updatedRequests))

    alert("Pre-authorization request submitted successfully!")
  }

  const processPayment = (invoiceId: string, amount: number) => {
    const updatedBilling = billingRecords.map((record) => {
      if (record.id === invoiceId) {
        return {
          ...record,
          patientBalance: Math.max(0, record.patientBalance - amount),
          status: record.patientBalance - amount <= 0 ? "paid" : "partial",
          lastPayment: {
            amount,
            date: new Date().toISOString(),
            method: "cash",
          },
        }
      }
      return record
    })

    setBillingRecords(updatedBilling)
    localStorage.setItem("billingRecords", JSON.stringify(updatedBilling))
    alert(`Payment of ${amount.toLocaleString()} FCFA processed successfully!`)
  }

  const contactPatient = (record: any) => {
    const message = `Dear ${record.patientName},

This is a reminder regarding your outstanding balance of ${record.patientBalance.toLocaleString()} FCFA for services rendered on ${record.serviceDate}.

Service Details:
- ${record.services.join(", ")}
- Total Amount: ${record.totalAmount.toLocaleString()} FCFA
- Insurance Paid: ${record.insurancePaid.toLocaleString()} FCFA
- Your Balance: ${record.patientBalance.toLocaleString()} FCFA

Please contact us at your earliest convenience to arrange payment.

Thank you for choosing MedRecord Pro Healthcare.

Best regards,
MedRecord Pro Billing Department
Phone: +237 696 162 344
Email: billing@medrecordpro.cm`

    // Create mailto link
    const subject = `Outstanding Balance - Invoice ${record.id}`
    const mailtoLink = `mailto:${record.patientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

    // Open email client
    window.open(mailtoLink)
  }

  const generateInvoice = (record: any) => {
    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${record.id}</title>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0; 
          padding: 20px; 
          line-height: 1.6;
          color: #333;
        }
        .invoice-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 30px; 
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .invoice-number {
          font-size: 18px;
          color: #666;
        }
        .billing-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        .info-section {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        .info-section h3 {
          margin-top: 0;
          color: #2563eb;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
        }
        .services-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .services-table th,
        .services-table td {
          border: 1px solid #e2e8f0;
          padding: 12px;
          text-align: left;
        }
        .services-table th {
          background-color: #2563eb;
          color: white;
          font-weight: 600;
        }
        .services-table tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .totals {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 5px 0;
        }
        .total-row.final {
          border-top: 2px solid #2563eb;
          font-weight: bold;
          font-size: 18px;
          color: #2563eb;
        }
        .payment-info {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 2px solid #e2e8f0;
          padding-top: 20px;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-overdue { background: #fecaca; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div>
          <div class="logo">MedRecord Pro</div>
          <div>Healthcare Management System</div>
          <div>Douala, Cameroon</div>
        </div>
        <div>
          <div class="invoice-number">INVOICE ${record.id}</div>
          <div>Date: ${new Date().toLocaleDateString()}</div>
          <div class="status-badge status-${record.status}">${record.status}</div>
        </div>
      </div>

      <div class="billing-info">
        <div class="info-section">
          <h3>Bill To:</h3>
          <strong>${record.patientName}</strong><br>
          Patient ID: ${record.patientId}<br>
          ${record.patientAddress || "Address on file"}<br>
          Phone: ${record.patientPhone || "Phone on file"}<br>
          Email: ${record.patientEmail || "Email on file"}
        </div>
        <div class="info-section">
          <h3>Service Details:</h3>
          Service Date: ${record.serviceDate}<br>
          Insurance Claim: ${record.insuranceClaimId}<br>
          Generated: ${new Date().toLocaleString()}<br>
          Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </div>
      </div>

      <table class="services-table">
        <thead>
          <tr>
            <th>Service Description</th>
            <th>Date</th>
            <th>Amount (FCFA)</th>
          </tr>
        </thead>
        <tbody>
          ${record.services
            .map(
              (service: string) => `
            <tr>
              <td>${service}</td>
              <td>${record.serviceDate}</td>
              <td>${(record.totalAmount / record.services.length).toLocaleString()} FCFA</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${record.totalAmount.toLocaleString()} FCFA</span>
        </div>
        <div class="total-row">
          <span>Insurance Payment:</span>
          <span>-${record.insurancePaid.toLocaleString()} FCFA</span>
        </div>
        ${
          record.lastPayment
            ? `
        <div class="total-row">
          <span>Last Payment (${new Date(record.lastPayment.date).toLocaleDateString()}):</span>
          <span>-${record.lastPayment.amount.toLocaleString()} FCFA</span>
        </div>
        `
            : ""
        }
        <div class="total-row final">
          <span>Amount Due:</span>
          <span>${record.patientBalance.toLocaleString()} FCFA</span>
        </div>
      </div>

      ${
        record.patientBalance > 0
          ? `
      <div class="payment-info">
        <strong>Payment Information:</strong><br>
        Please remit payment of ${record.patientBalance.toLocaleString()} FCFA by ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}.<br>
        Payment methods: Cash, Mobile Money (MTN/Orange), Bank Transfer<br>
        For questions, contact: +237 696 162 344 or billing@medrecordpro.cm
      </div>
      `
          : `
      <div class="payment-info" style="background: #dcfce7; border-color: #16a34a;">
        <strong>Payment Status: PAID IN FULL</strong><br>
        Thank you for your prompt payment!
      </div>
      `
      }

      <div class="footer">
        <div><strong>MedRecord Pro Healthcare Management System</strong></div>
        <div>Douala, Cameroon | Phone: +237 696 162 344 | Email: info@medrecordpro.cm</div>
        <div>This invoice contains confidential medical billing information.</div>
        <div>Invoice ID: ${record.id}-${Date.now()}</div>
      </div>
    </body>
    </html>
    `

    // Create and download the invoice
    const blob = new Blob([invoiceHTML], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Invoice_${record.id}_${record.patientName.replace(/\s+/g, "_")}.html`
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show instructions
    setTimeout(() => {
      alert(
        'Invoice downloaded! To print or convert to PDF:\n1. Open the downloaded HTML file\n2. Press Ctrl+P (or Cmd+P on Mac)\n3. Select your printer or "Save as PDF"\n4. Print or save',
      )
    }, 500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
      case "verifying":
      case "partial":
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
            Functional Insurance & Billing (Cameroon)
          </h1>
          <p className="text-gray-600">Complete insurance verification and billing operations in FCFA</p>
        </div>

        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="verification">Insurance Verification</TabsTrigger>
            <TabsTrigger value="preauth">Pre-Authorization</TabsTrigger>
            <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
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
                          {patient.insurance && (
                            <p className="text-sm text-blue-600">Insurance: {patient.insurance.split(" - ")[0]}</p>
                          )}
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
                      Real-Time Insurance Verification (Cameroon)
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
                            <Label>Patient Information</Label>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium">{selectedPatient.name}</p>
                              <p className="text-sm text-gray-600">DOB: {selectedPatient.dateOfBirth}</p>
                              <p className="text-sm text-gray-600">ID: {selectedPatient.patientId}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Insurance Information</Label>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium">
                                {selectedPatient.insurance?.split(" - ")[0] || "CNPS Cameroon"}
                              </p>
                              <p className="text-sm text-gray-600">
                                Policy: {selectedPatient.insurance?.split(" - ")[1] || "CNPS123456789"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button onClick={verifyInsurance} className="w-full" disabled={isVerifying} size="lg">
                          {isVerifying ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Verifying Insurance...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify Insurance Coverage
                            </>
                          )}
                        </Button>

                        {verificationResult && verificationResult.status !== "verifying" && (
                          <div className="mt-6 p-4 border rounded-lg bg-green-50">
                            <div className="flex items-center gap-2 mb-4">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <h4 className="font-medium text-green-900">Verification Complete</h4>
                              <Badge className="bg-green-100 text-green-800">Active Coverage</Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
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
                                  <span className="font-medium">Status:</span> {verificationResult.eligibilityStatus}
                                </p>
                              </div>
                              <div className="space-y-2">
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
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <p>• Primary Care: {verificationResult.coverageDetails.primaryCare}</p>
                                <p>• Specialist: {verificationResult.coverageDetails.specialist}</p>
                                <p>• Emergency: {verificationResult.coverageDetails.emergency}</p>
                                <p>• Prescription: {verificationResult.coverageDetails.prescription}</p>
                              </div>
                            </div>

                            {verificationResult.preAuthRequired.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-medium mb-2 flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  Pre-Authorization Required:
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {verificationResult.preAuthRequired.map((item: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-orange-700 border-orange-300">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs text-gray-500">
                                Verified on: {new Date(verificationResult.verificationDate).toLocaleString()}
                              </p>
                            </div>
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
                    Submit Pre-Authorization Request
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target as HTMLFormElement)
                      const data = {
                        patientName: formData.get("patientName"),
                        patientId: formData.get("patientId"),
                        procedure: formData.get("procedure"),
                        urgency: formData.get("urgency"),
                        justification: formData.get("justification"),
                        estimatedCost: Number.parseFloat(formData.get("estimatedCost") as string),
                      }
                      submitPreAuth(data)
                      ;(e.target as HTMLFormElement).reset()
                    }}
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name</Label>
                        <Input name="patientName" required placeholder="Enter patient name" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patientId">Patient ID</Label>
                        <Input name="patientId" required placeholder="Enter patient ID" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="procedure">Procedure/Service</Label>
                        <Select name="procedure" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select procedure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MRI Brain">MRI Brain</SelectItem>
                            <SelectItem value="CT Scan">CT Scan</SelectItem>
                            <SelectItem value="Surgery">Surgery</SelectItem>
                            <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                            <SelectItem value="Specialist Referral">Specialist Referral</SelectItem>
                            <SelectItem value="Cardiac Catheterization">Cardiac Catheterization</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estimatedCost">Estimated Cost (FCFA)</Label>
                        <Input name="estimatedCost" type="number" step="1000" required placeholder="0" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <Select name="urgency" required>
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
                          name="justification"
                          required
                          placeholder="Provide medical necessity and clinical justification..."
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Submit Pre-Authorization Request
                      </Button>
                    </div>
                  </form>
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
                      <div key={request.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{request.procedure}</h4>
                              <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">Patient: {request.patientName}</p>
                            <p className="text-sm text-gray-600">
                              Estimated Cost: {request.estimatedCost?.toLocaleString()} FCFA
                            </p>
                            <p className="text-sm text-gray-500">Requested: {request.requestDate}</p>
                            {request.approvalNumber && (
                              <p className="text-sm text-green-600">Approval #: {request.approvalNumber}</p>
                            )}
                          </div>
                          <Badge variant="outline">{request.urgency}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Billing & Payment Processing (FCFA)</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Billing Report
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {billingRecords.map((record) => (
                    <div key={record.id} className="p-6 border-b last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{record.patientName}</h4>
                            <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Service Date: {record.serviceDate}</p>
                          <p className="text-sm text-gray-600">Services: {record.services.join(", ")}</p>
                          <p className="text-sm text-gray-600">Claim ID: {record.insuranceClaimId}</p>

                          <div className="grid grid-cols-3 gap-6 text-sm">
                            <div>
                              <p className="text-gray-500">Total Amount</p>
                              <p className="font-medium text-lg">{record.totalAmount.toLocaleString()} FCFA</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Insurance Paid</p>
                              <p className="font-medium text-lg text-green-600">
                                {record.insurancePaid.toLocaleString()} FCFA
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Patient Balance</p>
                              <p className="font-medium text-lg text-orange-600">
                                {record.patientBalance.toLocaleString()} FCFA
                              </p>
                            </div>
                          </div>

                          {record.lastPayment && (
                            <div className="p-2 bg-green-50 rounded text-sm">
                              <p className="text-green-800">
                                Last Payment: {record.lastPayment.amount.toLocaleString()} FCFA on{" "}
                                {new Date(record.lastPayment.date).toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          {/* Contact Information */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {record.patientPhone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {record.patientEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {record.patientAddress}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" onClick={() => contactPatient(record)}>
                            <Mail className="h-3 w-3 mr-1" />
                            Contact Patient
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => generateInvoice(record)}>
                            <Printer className="h-3 w-3 mr-1" />
                            Generate Invoice
                          </Button>
                          {record.patientBalance > 0 && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const amount = prompt(
                                  `Enter payment amount (Balance: ${record.patientBalance.toLocaleString()} FCFA):`,
                                )
                                if (amount && !isNaN(Number.parseFloat(amount))) {
                                  processPayment(record.id, Number.parseFloat(amount))
                                }
                              }}
                            >
                              <DollarSign className="h-3 w-3 mr-1" />
                              Process Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-xl font-semibold">Insurance & Billing Reports (FCFA)</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Verifications Today:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payments Collected:</span>
                      <span className="font-medium">1,225,000 FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outstanding Balance:</span>
                      <span className="font-medium text-orange-600">615,000 FCFA</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Daily Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Insurance Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Policies:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verification Rate:</span>
                      <span className="font-medium text-green-600">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Claim Approval Rate:</span>
                      <span className="font-medium text-green-600">94.2%</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pre-Auth Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pending Requests:</span>
                      <span className="font-medium text-yellow-600">
                        {preAuthRequests.filter((r) => r.status === "pending").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approved This Week:</span>
                      <span className="font-medium text-green-600">
                        {preAuthRequests.filter((r) => r.status === "approved").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Processing:</span>
                      <span className="font-medium">2.3 days</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Pre-Auth Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
