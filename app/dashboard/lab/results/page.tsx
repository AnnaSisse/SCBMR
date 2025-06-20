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
} from "lucide-react"
import Link from "next/link"

export default function LabResultsPage() {
  const [labOrders, setLabOrders] = useState<any[]>([])
  const [labResults, setLabResults] = useState<any[]>([])
  const [specimens, setSpecimens] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [resultForm, setResultForm] = useState({
    testName: "",
    result: "",
    unit: "",
    normalRange: "",
    notes: "",
    isAbnormal: false,
  })

  useEffect(() => {
    loadLabData()
    generateSampleData()
  }, [])

  const loadLabData = () => {
    const orders = JSON.parse(localStorage.getItem("labOrders") || "[]")
    const results = JSON.parse(localStorage.getItem("labResults") || "[]")
    const specs = JSON.parse(localStorage.getItem("specimens") || "[]")

    setLabOrders(orders)
    setLabResults(results)
    setSpecimens(specs)
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

  const enterResult = () => {
    if (!selectedOrder || !resultForm.testName || !resultForm.result) {
      alert("Please select an order and fill in required fields")
      return
    }

    const resultEntry = {
      id: `RES${Date.now()}`,
      labOrderId: selectedOrder.id,
      patientName: selectedOrder.patientName,
      patientId: selectedOrder.patientId,
      ...resultForm,
      enteredBy: "Lab Tech Mike Davis",
      enteredAt: new Date().toISOString(),
      verified: false,
      flagged: resultForm.isAbnormal,
    }

    const updatedResults = [...labResults, resultEntry]
    setLabResults(updatedResults)
    localStorage.setItem("labResults", JSON.stringify(updatedResults))

    // Update order status
    const updatedOrders = labOrders.map((order) =>
      order.id === selectedOrder.id ? { ...order, status: "completed", completedAt: new Date().toISOString() } : order,
    )
    setLabOrders(updatedOrders)
    localStorage.setItem("labOrders", JSON.stringify(updatedOrders))

    // Reset form
    setResultForm({
      testName: "",
      result: "",
      unit: "",
      normalRange: "",
      notes: "",
      isAbnormal: false,
    })
    setSelectedOrder(null)

    if (resultForm.isAbnormal) {
      alert("CRITICAL RESULT FLAGGED! Physician has been notified immediately.")
    } else {
      alert("Result entered successfully!")
    }
  }

  const updateSpecimenStatus = (specimenId: string, newStatus: string) => {
    const updatedSpecimens = specimens.map((spec) =>
      spec.id === specimenId ? { ...spec, status: newStatus, updatedAt: new Date().toISOString() } : spec,
    )
    setSpecimens(updatedSpecimens)
    localStorage.setItem("specimens", JSON.stringify(updatedSpecimens))
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Lab Orders</TabsTrigger>
            <TabsTrigger value="results">Results Entry</TabsTrigger>
            <TabsTrigger value="reports">Lab Reports</TabsTrigger>
            <TabsTrigger value="tracking">Sample Tracking</TabsTrigger>
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
                    <Label htmlFor="testName">Test Name</Label>
                    <Input
                      id="testName"
                      value={resultForm.testName}
                      onChange={(e) => setResultForm({ ...resultForm, testName: e.target.value })}
                      placeholder="e.g., Hemoglobin, Glucose, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="result">Result Value</Label>
                      <Input
                        id="result"
                        value={resultForm.result}
                        onChange={(e) => setResultForm({ ...resultForm, result: e.target.value })}
                        placeholder="Enter result"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={resultForm.unit}
                        onChange={(e) => setResultForm({ ...resultForm, unit: e.target.value })}
                        placeholder="mg/dL, g/dL, etc."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="normalRange">Normal Range</Label>
                    <Input
                      id="normalRange"
                      value={resultForm.normalRange}
                      onChange={(e) => setResultForm({ ...resultForm, normalRange: e.target.value })}
                      placeholder="e.g., 70-100 mg/dL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={resultForm.notes}
                      onChange={(e) => setResultForm({ ...resultForm, notes: e.target.value })}
                      placeholder="Additional observations or comments..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAbnormal"
                      checked={resultForm.isAbnormal}
                      onChange={(e) => setResultForm({ ...resultForm, isAbnormal: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="isAbnormal" className="text-sm font-medium">
                      Flag as abnormal/critical result
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={enterResult} className="flex-1" disabled={!selectedOrder}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enter Result
                    </Button>
                    {resultForm.isAbnormal && (
                      <Button variant="destructive" onClick={enterResult} className="flex-1" disabled={!selectedOrder}>
                        <Flag className="h-4 w-4 mr-2" />
                        Flag Critical
                      </Button>
                    )}
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
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="text-sm">{new Date(result.enteredAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {result.notes && (
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <p className="text-gray-700">{result.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => generateLabReport(result.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
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
        </Tabs>
      </div>
    </div>
  )
}
