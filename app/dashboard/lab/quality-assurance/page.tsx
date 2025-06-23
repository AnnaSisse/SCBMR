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
import { TestTube, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Settings, Search, Flag } from "lucide-react"

export default function QualityAssurancePage() {
  const [labOrders, setLabOrders] = useState<any[]>([])
  const [specimens, setSpecimens] = useState<any[]>([])
  const [qualityControls, setQualityControls] = useState<any[]>([])

  useEffect(() => {
    // Load lab data
    const ordersData = JSON.parse(localStorage.getItem("labOrders") || "[]")
    const specimensData = JSON.parse(localStorage.getItem("specimens") || "[]")
    const qcData = JSON.parse(localStorage.getItem("qualityControls") || "[]")

    setLabOrders(ordersData)
    setSpecimens(specimensData)
    setQualityControls(qcData)
  }, [])

  const pendingOrders = [
    {
      id: "LAB001",
      patientName: "John Patient",
      testType: "Complete Blood Count",
      priority: "routine",
      orderedAt: "2024-01-15 08:30:00",
      status: "pending",
    },
    {
      id: "LAB002",
      patientName: "Emily Davis",
      testType: "Lipid Panel",
      priority: "high",
      orderedAt: "2024-01-15 09:15:00",
      status: "in_progress",
    },
    {
      id: "LAB003",
      patientName: "Robert Wilson",
      testType: "Liver Function Tests",
      priority: "urgent",
      orderedAt: "2024-01-15 10:00:00",
      status: "pending",
    },
  ]

  const criticalResults = [
    {
      id: "CRIT001",
      patientName: "James Thompson",
      testType: "Blood Glucose",
      result: "450 mg/dL",
      normalRange: "70-100 mg/dL",
      status: "critical",
      flaggedAt: "2024-01-15 11:30:00",
    },
    {
      id: "CRIT002",
      patientName: "Maria Rodriguez",
      testType: "Hemoglobin",
      result: "5.2 g/dL",
      normalRange: "12.0-15.5 g/dL",
      status: "critical",
      flaggedAt: "2024-01-15 12:15:00",
    },
  ]

  const equipmentCalibration = [
    {
      equipment: "Hematology Analyzer",
      lastCalibration: "2024-01-14",
      nextDue: "2024-01-21",
      status: "current",
    },
    {
      equipment: "Chemistry Analyzer",
      lastCalibration: "2024-01-13",
      nextDue: "2024-01-20",
      status: "due_soon",
    },
    {
      equipment: "Microscope Station 1",
      lastCalibration: "2024-01-10",
      nextDue: "2024-01-17",
      status: "overdue",
    },
  ]

  const enterResult = (orderId: string, result: string, isAbnormal: boolean) => {
    const resultEntry = {
      id: `RES${Date.now()}`,
      orderId,
      result,
      isAbnormal,
      enteredBy: "Lab Tech Mike Davis",
      enteredAt: new Date().toISOString(),
      verified: false,
    }

    const existingResults = JSON.parse(localStorage.getItem("labResults") || "[]")
    localStorage.setItem("labResults", JSON.stringify([...existingResults, resultEntry]))

    if (isAbnormal) {
      alert("Abnormal result flagged for immediate physician review!")
    } else {
      alert("Result entered successfully!")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "current":
        return "bg-green-100 text-green-800"
      case "due_soon":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TestTube className="h-8 w-8 text-blue-600" />
            Laboratory Quality Assurance
          </h1>
          <p className="text-gray-600">Comprehensive lab management and quality control</p>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">Lab Orders</TabsTrigger>
            <TabsTrigger value="results">Results Entry</TabsTrigger>
            <TabsTrigger value="critical">Critical Values</TabsTrigger>
            <TabsTrigger value="specimens">Specimen Tracking</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending Lab Orders
                </CardTitle>
                <CardDescription>Orders awaiting processing and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{order.testType}</h4>
                          <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Patient: {order.patientName}</p>
                        <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                        <p className="text-sm text-gray-500">Ordered: {order.orderedAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status === "pending" ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          )}
                          {order.status.replace("_", " ")}
                        </Badge>
                        <Button size="sm">Process</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Result Entry & Validation
                </CardTitle>
                <CardDescription>Enter and validate laboratory test results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testOrder">Select Test Order</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pending order" />
                      </SelectTrigger>
                      <SelectContent>
                        {pendingOrders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            {order.patientName} - {order.testType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testResult">Test Result</Label>
                    <Input id="testResult" placeholder="Enter result value" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="units">Units</Label>
                    <Input id="units" placeholder="mg/dL, g/dL, etc." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="normalRange">Normal Range</Label>
                    <Input id="normalRange" placeholder="e.g., 70-100 mg/dL" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resultNotes">Result Notes</Label>
                  <Textarea id="resultNotes" placeholder="Additional observations or comments..." />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Enter Normal Result
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <Flag className="h-4 w-4 mr-2" />
                    Flag Abnormal Result
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="critical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Values Alert
                </CardTitle>
                <CardDescription>Results requiring immediate physician notification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalResults.map((result) => (
                    <div key={result.id} className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h4 className="font-medium text-red-900">{result.testType} - CRITICAL</h4>
                          </div>
                          <p className="text-sm text-red-800">Patient: {result.patientName}</p>
                          <p className="text-sm text-red-800">
                            Result: <span className="font-bold">{result.result}</span>
                          </p>
                          <p className="text-sm text-red-700">Normal Range: {result.normalRange}</p>
                          <p className="text-xs text-red-600">Flagged: {result.flaggedAt}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="destructive">
                            Notify Physician
                          </Button>
                          <Button size="sm" variant="outline">
                            Document Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specimens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Specimen Tracking
                </CardTitle>
                <CardDescription>Track specimen lifecycle from collection to disposal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input placeholder="Search by specimen ID or patient name..." className="flex-1" />
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {[
                      {
                        id: "SPEC001",
                        patientName: "John Patient",
                        type: "Blood",
                        collectedAt: "2024-01-15 08:45:00",
                        status: "processing",
                      },
                      {
                        id: "SPEC002",
                        patientName: "Emily Davis",
                        type: "Urine",
                        collectedAt: "2024-01-15 09:30:00",
                        status: "completed",
                      },
                      {
                        id: "SPEC003",
                        patientName: "Robert Wilson",
                        type: "Blood",
                        collectedAt: "2024-01-15 10:15:00",
                        status: "received",
                      },
                    ].map((specimen) => (
                      <div key={specimen.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {specimen.id} - {specimen.type}
                          </p>
                          <p className="text-sm text-gray-600">Patient: {specimen.patientName}</p>
                          <p className="text-sm text-gray-500">Collected: {specimen.collectedAt}</p>
                        </div>
                        <Badge className={getStatusColor(specimen.status)}>{specimen.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Equipment Calibration
                  </CardTitle>
                  <CardDescription>Monitor equipment calibration status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {equipmentCalibration.map((equipment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{equipment.equipment}</p>
                          <p className="text-sm text-gray-600">Last: {equipment.lastCalibration}</p>
                          <p className="text-sm text-gray-600">Next Due: {equipment.nextDue}</p>
                        </div>
                        <Badge className={getStatusColor(equipment.status)}>{equipment.status.replace("_", " ")}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Quality Control Checks
                  </CardTitle>
                  <CardDescription>Daily quality control documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="qcTest">QC Test Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select QC test" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hematology">Hematology Controls</SelectItem>
                          <SelectItem value="chemistry">Chemistry Controls</SelectItem>
                          <SelectItem value="microbiology">Microbiology Controls</SelectItem>
                          <SelectItem value="immunology">Immunology Controls</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="controlLevel">Control Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Control</SelectItem>
                            <SelectItem value="normal">Normal Control</SelectItem>
                            <SelectItem value="high">High Control</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="qcResult">QC Result</Label>
                        <Input id="qcResult" placeholder="Enter result" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qcNotes">QC Notes</Label>
                      <Textarea id="qcNotes" placeholder="Document any observations or corrective actions..." />
                    </div>

                    <Button className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Document QC Check
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
