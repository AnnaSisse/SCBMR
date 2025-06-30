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
  TestTube,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Search,
  Flag,
  Download,
  Eye,
  Beaker,
  ArrowLeft,
  History,
  Image as ImageIcon,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LabResultsPage() {
  const [labOrders, setLabOrders] = useState<any[]>([])
  const [labResults, setLabResults] = useState<any[]>([])
  const [specimens, setSpecimens] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [auditTrail, setAuditTrail] = useState<any[]>([])
  const [isAuditTrailVisible, setIsAuditTrailVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [resultForm, setResultForm] = useState({
    patient_id: "",
    test_name: "",
    result_value: "",
    result_date: "",
    doctor_id: "",
    notes: "",
  })

  useEffect(() => {
    fetchLabResults()
    generateSampleData()
    loadAuditTrail()
  }, [])

  const fetchLabResults = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/lab-results")
      if (!res.ok) throw new Error("Failed to fetch lab results")
      const data = await res.json()
      setLabResults(data)
    } catch (err: any) {
      setError(err.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  const loadLabData = () => {
    const orders = JSON.parse(localStorage.getItem("labOrders") || "[]")
    const results = JSON.parse(localStorage.getItem("labResults") || "[]")
    const specs = JSON.parse(localStorage.getItem("specimens") || "[]")

    setLabOrders(orders)
    setLabResults(results)
    setSpecimens(specs)
  }

  const loadAuditTrail = () => {
    const trail = JSON.parse(localStorage.getItem("labAuditTrail") || "[]")
    setAuditTrail(trail)
  }

  const generateSampleData = () => {
    // Generate sample lab orders if none exist
    const existingOrders = JSON.parse(localStorage.getItem("labOrders") || "[]")
    if (existingOrders.length === 0) {
      const sampleOrders = [
        {
          id: "LAB001",
          patientName: "John Patient",
          patientId: "P001",
          testType: "Complete Blood Count",
          priority: "routine",
          orderedAt: "2024-01-15 08:30:00",
          orderedBy: "Dr. Sarah Johnson",
          status: "pending",
          specimenType: "Blood",
        },
        {
          id: "LAB002",
          patientName: "Emily Davis",
          patientId: "P002",
          testType: "Lipid Panel",
          priority: "high",
          orderedAt: "2024-01-15 09:15:00",
          orderedBy: "Dr. Michael Brown",
          status: "in_progress",
          specimenType: "Blood",
        },
        {
          id: "LAB003",
          patientName: "Robert Wilson",
          patientId: "P003",
          testType: "Liver Function Tests",
          priority: "urgent",
          orderedAt: "2024-01-15 10:00:00",
          orderedBy: "Dr. Sarah Johnson",
          status: "pending",
          specimenType: "Blood",
        },
        {
          id: "LAB004",
          patientName: "Maria Rodriguez",
          patientId: "P004",
          testType: "Urinalysis",
          priority: "routine",
          orderedAt: "2024-01-15 11:30:00",
          orderedBy: "Dr. Michael Brown",
          status: "completed",
          specimenType: "Urine",
        },
      ]
      localStorage.setItem("labOrders", JSON.stringify(sampleOrders))
      setLabOrders(sampleOrders)
    }

    // Generate sample specimens
    const existingSpecimens = JSON.parse(localStorage.getItem("specimens") || "[]")
    if (existingSpecimens.length === 0) {
      const sampleSpecimens = [
        {
          id: "SPEC001",
          labOrderId: "LAB001",
          patientName: "John Patient",
          type: "Blood",
          collectedAt: "2024-01-15 08:45:00",
          collectedBy: "Nurse Mary Wilson",
          status: "processing",
          barcode: "BC001234567",
          location: "Lab Station 1",
        },
        {
          id: "SPEC002",
          labOrderId: "LAB002",
          patientName: "Emily Davis",
          type: "Blood",
          collectedAt: "2024-01-15 09:30:00",
          collectedBy: "Nurse Mary Wilson",
          status: "completed",
          barcode: "BC001234568",
          location: "Lab Station 2",
        },
        {
          id: "SPEC003",
          labOrderId: "LAB003",
          patientName: "Robert Wilson",
          type: "Blood",
          collectedAt: "2024-01-15 10:15:00",
          collectedBy: "Lab Tech Mike Davis",
          status: "received",
          barcode: "BC001234569",
          location: "Receiving",
        },
      ]
      localStorage.setItem("specimens", JSON.stringify(sampleSpecimens))
      setSpecimens(sampleSpecimens)
    }
  }

  const handleChange = (e: any) => {
    setResultForm({ ...resultForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/lab-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: Number(resultForm.patient_id),
          test_name: resultForm.test_name,
          result_value: resultForm.result_value,
          result_date: resultForm.result_date,
          doctor_id: Number(resultForm.doctor_id),
          notes: resultForm.notes,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit lab result")
      fetchLabResults()
      setResultForm({
        patient_id: "",
        test_name: "",
        result_value: "",
        result_date: "",
        doctor_id: "",
        notes: "",
      })
    } catch (err: any) {
      setError(err.message || "Error")
    }
  }

  const enterResult = () => {
    if (!selectedOrder || !resultForm.test_name || !resultForm.result_value) {
      alert("Please select an order and fill in required fields")
      return
    }

    const resultEntry = {
      id: `RES${Date.now()}`,
      labOrderId: selectedOrder.id,
      patientName: selectedOrder.patientName,
      patientId: selectedOrder.patientId,
      testName: resultForm.test_name,
      result: resultForm.result_value,
      unit: "",
      normalRange: "",
      notes: resultForm.notes,
      isAbnormal: false,
      image: "",
      enteredBy: "Lab Tech Mike Davis",
      enteredAt: new Date().toISOString(),
      verified: false,
      flagged: false,
      history: [
        {
          action: "Result Entered",
          user: "Lab Tech Mike Davis",
          timestamp: new Date().toISOString(),
        },
      ],
    }

    const updatedResults = [...labResults, resultEntry]
    setLabResults(updatedResults)
    localStorage.setItem("labResults", JSON.stringify(updatedResults))
    logAuditEvent("Result Entered", { resultId: resultEntry.id, orderId: selectedOrder.id })

    // Update order status
    const updatedOrders = labOrders.map((order) =>
      order.id === selectedOrder.id ? { ...order, status: "completed", completedAt: new Date().toISOString() } : order,
    )
    setLabOrders(updatedOrders)
    localStorage.setItem("labOrders", JSON.stringify(updatedOrders))
    logAuditEvent("Order Status Updated", { orderId: selectedOrder.id, newStatus: "completed" })

    // Reset form
    setResultForm({
      patient_id: "",
      test_name: "",
      result_value: "",
      result_date: "",
      doctor_id: "",
      notes: "",
    })
    setSelectedOrder(null)

    alert("Result entered successfully!")
  }

  const verifyResult = (resultId: string) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const updatedResults = labResults.map((result) => {
      if (result.id === resultId) {
        const newHistory = [
          ...(result.history || []),
          {
            action: "Result Verified",
            user: currentUser.name || "System",
            timestamp: new Date().toISOString(),
          },
        ]
        return { ...result, verified: true, verifiedBy: currentUser.name, history: newHistory }
      }
      return result
    })

    setLabResults(updatedResults)
    localStorage.setItem("labResults", JSON.stringify(updatedResults))
    logAuditEvent("Result Verified", { resultId })
    alert("Result has been verified.")
  }

  const updateSpecimenStatus = (specimenId: string, newStatus: string) => {
    const updatedSpecimens = specimens.map((spec) =>
      spec.id === specimenId ? { ...spec, status: newStatus, updatedAt: new Date().toISOString() } : spec,
    )
    setSpecimens(updatedSpecimens)
    localStorage.setItem("specimens", JSON.stringify(updatedSpecimens))
    logAuditEvent("Specimen Status Updated", { specimenId, newStatus })
  }

  const generateLabReport = (resultId: string) => {
    const result = labResults.find((r) => r.id === resultId)
    if (!result) return

    const report = {
      reportId: `RPT${Date.now()}`,
      patientName: result.patientName,
      patientId: result.patientId,
      testName: result.testName,
      result: result.result,
      unit: result.unit,
      normalRange: result.normalRange,
      notes: result.notes,
      isAbnormal: result.isAbnormal,
      enteredBy: result.enteredBy,
      enteredAt: result.enteredAt,
      reportGeneratedAt: new Date().toISOString(),
      reportGeneratedBy: "Lab Tech Mike Davis",
    }

    // Save report
    const existingReports = JSON.parse(localStorage.getItem("labReports") || "[]")
    localStorage.setItem("labReports", JSON.stringify([...existingReports, report]))

    // Download report as JSON (simulated)
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lab-report-${result.patientName.replace(/\s+/g, "-")}-${Date.now()}.json`
    a.click()

    alert("Lab report generated and downloaded!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "received":
        return "bg-purple-100 text-purple-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "routine":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const logAuditEvent = (action: string, details: object) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const event = {
      action,
      details,
      user: currentUser.name || "System",
      timestamp: new Date().toISOString(),
    }
    const currentTrail = JSON.parse(localStorage.getItem("labAuditTrail") || "[]")
    const newTrail = [event, ...currentTrail]
    localStorage.setItem("labAuditTrail", JSON.stringify(newTrail))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TestTube className="h-8 w-8 text-blue-600" />
              Laboratory Results Management
            </h1>
            <p className="text-gray-600">Process test results, generate reports, and track specimens</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">Lab Orders</TabsTrigger>
            <TabsTrigger value="results">Results Entry</TabsTrigger>
            <TabsTrigger value="reports">Lab Reports</TabsTrigger>
            <TabsTrigger value="tracking">Sample Tracking</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Pending Lab Orders</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search orders..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {labOrders.map((order) => (
                <Card key={order.id} className={selectedOrder?.id === order.id ? "ring-2 ring-blue-500" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TestTube className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">{order.testType}</h3>
                          <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Patient: {order.patientName} (ID: {order.patientId})
                        </p>
                        <p className="text-sm text-gray-600">Ordered by: {order.orderedBy}</p>
                        <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                        <p className="text-sm text-gray-500">Ordered: {order.orderedAt}</p>
                        <p className="text-sm text-gray-500">Specimen: {order.specimenType}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant={selectedOrder?.id === order.id ? "default" : "outline"}
                          onClick={() => setSelectedOrder(order)}
                        >
                          {selectedOrder?.id === order.id ? "Selected" : "Select"}
                        </Button>
                        {order.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Result
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Selected Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Selected Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOrder ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900">{selectedOrder.testType}</h4>
                        <p className="text-sm text-blue-700">Patient: {selectedOrder.patientName}</p>
                        <p className="text-sm text-blue-700">Order ID: {selectedOrder.id}</p>
                        <p className="text-sm text-blue-700">Specimen: {selectedOrder.specimenType}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getPriorityColor(selectedOrder.priority)}>{selectedOrder.priority}</Badge>
                          <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No order selected</h3>
                      <p className="text-gray-600">Select a lab order from the Orders tab to enter results</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Result Entry Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Enter Test Results
                  </CardTitle>
                  <CardDescription>Enter and validate laboratory test results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test_name">Test Name</Label>
                    <Input
                      id="test_name"
                      value={resultForm.test_name}
                      onChange={handleChange}
                      placeholder="e.g., Hemoglobin, Glucose, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="result_value">Result Value</Label>
                      <Input
                        id="result_value"
                        value={resultForm.result_value}
                        onChange={handleChange}
                        placeholder="Enter result"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="result_date">Result Date</Label>
                      <Input
                        id="result_date"
                        value={resultForm.result_date}
                        onChange={handleChange}
                        type="date"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor_id">Doctor ID</Label>
                    <Input
                      id="doctor_id"
                      value={resultForm.doctor_id}
                      onChange={handleChange}
                      placeholder="Enter doctor ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={resultForm.notes}
                      onChange={handleChange}
                      placeholder="Additional observations or comments..."
                      rows={3}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="image-upload">Attach Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setResultForm({ ...resultForm, image: reader.result as string })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="mt-1"
                    />
                    {resultForm.image && (
                      <div className="mt-2">
                        <img src={resultForm.image} alt="Result preview" className="h-24 w-24 object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={enterResult} className="flex-1" disabled={!selectedOrder}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enter Result
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recent Results Entered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {labResults.length === 0 ? (
                    <div className="text-center py-8">
                      <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results entered yet</h3>
                      <p className="text-gray-600">Results you enter will appear here</p>
                    </div>
                  ) : (
                    labResults
                      .sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime())
                      .slice(0, 5)
                      .map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{result.testName}</h4>
                              {result.flagged && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Critical
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Patient: {result.patientName} - Result: {result.result} {result.unit}
                            </p>
                            <p className="text-sm text-gray-500">
                              Entered: {new Date(result.enteredAt).toLocaleString()}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => generateLabReport(result.id)}>
                            <Download className="h-4 w-4 mr-1" />
                            Generate Report
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Laboratory Reports</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All Reports
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {result.testName}
                    </CardTitle>
                    <CardDescription>Patient: {result.patientName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Result:</span>
                        <span className="font-medium">
                          {result.result} {result.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Normal Range:</span>
                        <span className="text-sm">{result.normalRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <Badge variant={result.flagged ? "destructive" : "default"}>
                          {result.flagged ? "Abnormal" : "Normal"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Verified:</span>
                        <Badge variant={result.verified ? "default" : "secondary"}>
                          {result.verified ? `Yes, by ${result.verifiedBy}` : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="text-sm">{new Date(result.enteredAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {result.notes && (
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <p className="text-gray-700">{result.notes}</p>
                      </div>
                    )}

                    {result.image && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="mt-2">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            View Attached Image
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Attached Image for {result.testName}</DialogTitle>
                          </DialogHeader>
                          <img src={result.image} alt={`Result for ${result.testName}`} className="w-full h-auto object-contain rounded-lg mt-4" />
                        </DialogContent>
                      </Dialog>
                    )}

                    <div className="flex gap-2">
                      {!result.verified && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-green-100 hover:bg-green-200"
                          onClick={() => verifyResult(result.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1">
                            <History className="h-4 w-4 mr-1" />
                            History
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Audit Trail for Result {result.id}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                            {(result.history || []).map((event: any, index: number) => (
                              <div key={index} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                  <div className="flex-grow w-px bg-gray-300"></div>
                                </div>
                                <div>
                                  <p className="font-semibold">{event.action}</p>
                                  <p className="text-sm text-gray-600">
                                    by {event.user}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(event.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Sample Tracking</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search by barcode or patient..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Beaker className="h-4 w-4 mr-2" />
                  Add Sample
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {specimens.map((specimen) => (
                <Card key={specimen.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Beaker className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold">{specimen.type} Sample</h3>
                          <Badge className={getStatusColor(specimen.status)}>{specimen.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Patient: {specimen.patientName}</p>
                        <p className="text-sm text-gray-600">Barcode: {specimen.barcode}</p>
                        <p className="text-sm text-gray-600">Collected by: {specimen.collectedBy}</p>
                        <p className="text-sm text-gray-500">Collected: {specimen.collectedAt}</p>
                        <p className="text-sm text-gray-500">Location: {specimen.location}</p>
                        <p className="text-sm text-gray-500">Lab Order: {specimen.labOrderId}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Select
                          value={specimen.status}
                          onValueChange={(value) => updateSpecimenStatus(specimen.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="disposed">Disposed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Track History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sample Tracking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sample Tracking Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">
                      {specimens.filter((s) => s.status === "received").length}
                    </p>
                    <p className="text-sm text-blue-600">Received</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-700">
                      {specimens.filter((s) => s.status === "processing").length}
                    </p>
                    <p className="text-sm text-yellow-600">Processing</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">
                      {specimens.filter((s) => s.status === "completed").length}
                    </p>
                    <p className="text-sm text-green-600">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-700">{specimens.length}</p>
                    <p className="text-sm text-gray-600">Total Samples</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  System-Wide Audit Trail
                </CardTitle>
                <CardDescription>A log of all significant actions taken in the lab module.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {auditTrail.map((event, index) => (
                    <div key={index} className="flex gap-4 p-2 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold">{event.action}</p>
                        <p className="text-sm text-gray-700">
                          Details: {JSON.stringify(event.details)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Performed by: {event.user} at {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
