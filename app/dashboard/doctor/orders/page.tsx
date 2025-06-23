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
import { FileText, Pill, TestTube, Camera, UserCheck, Plus, Search, Clock, CheckCircle } from "lucide-react"

export default function OrdersPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [newOrder, setNewOrder] = useState({
    type: "",
    description: "",
    priority: "routine",
    notes: "",
    patientId: "",
  })

  useEffect(() => {
    const patientsData = JSON.parse(localStorage.getItem("patients") || "[]")
    const ordersData = JSON.parse(localStorage.getItem("medicalOrders") || "[]")
    setPatients(patientsData)
    setOrders(ordersData)
  }, [])

  const orderTypes = {
    lab: {
      name: "Laboratory Tests",
      icon: TestTube,
      options: [
        "Complete Blood Count (CBC)",
        "Basic Metabolic Panel",
        "Lipid Panel",
        "Liver Function Tests",
        "Thyroid Function Tests",
        "Urinalysis",
        "Blood Glucose",
        "HbA1c",
        "Coagulation Studies",
        "Cardiac Enzymes",
      ],
    },
    imaging: {
      name: "Imaging Studies",
      icon: Camera,
      options: [
        "Chest X-Ray",
        "Abdominal X-Ray",
        "CT Scan - Head",
        "CT Scan - Chest",
        "CT Scan - Abdomen",
        "MRI - Brain",
        "MRI - Spine",
        "Ultrasound - Abdominal",
        "Echocardiogram",
        "Mammography",
      ],
    },
    medication: {
      name: "Medications",
      icon: Pill,
      options: [
        "Antibiotics",
        "Pain Management",
        "Cardiovascular",
        "Diabetes Management",
        "Respiratory",
        "Psychiatric",
        "Dermatological",
        "Gastrointestinal",
        "Neurological",
        "Hormonal",
      ],
    },
    referral: {
      name: "Referrals",
      icon: UserCheck,
      options: [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Psychiatry",
        "Dermatology",
        "Gastroenterology",
        "Endocrinology",
        "Pulmonology",
        "Oncology",
        "Physical Therapy",
      ],
    },
  }

  const createOrder = () => {
    if (!selectedPatient || !newOrder.type || !newOrder.description) {
      alert("Please fill in all required fields")
      return
    }

    const order = {
      id: `ORD${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      type: newOrder.type,
      description: newOrder.description,
      priority: newOrder.priority,
      notes: newOrder.notes,
      status: "Pending",
      orderedBy: "Dr. Sarah Johnson",
      orderedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    const updatedOrders = [...orders, order]
    setOrders(updatedOrders)
    localStorage.setItem("medicalOrders", JSON.stringify(updatedOrders))

    // Reset form
    setNewOrder({
      type: "",
      description: "",
      priority: "routine",
      notes: "",
      patientId: "",
    })

    alert("Order created successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
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
            <FileText className="h-8 w-8 text-blue-600" />
            Medical Orders Management
          </h1>
          <p className="text-gray-600">Create and track medical orders for patients</p>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Order</TabsTrigger>
            <TabsTrigger value="pending">Pending Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Patient Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Patient</CardTitle>
                  <CardDescription>Choose a patient to create an order for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search patients..." className="pl-10" />
                    </div>
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
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                              <p className="text-sm text-gray-500">
                                Age: {patient.age}, {patient.gender}
                              </p>
                            </div>
                            <Badge variant="outline">{patient.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Creation */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Order</CardTitle>
                  <CardDescription>
                    {selectedPatient ? `Creating order for ${selectedPatient.name}` : "Select a patient first"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderType">Order Type</Label>
                    <Select value={newOrder.type} onValueChange={(value) => setNewOrder({ ...newOrder, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(orderTypes).map(([key, type]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {newOrder.type && (
                    <div className="space-y-2">
                      <Label htmlFor="description">Specific Order</Label>
                      <Select
                        value={newOrder.description}
                        onValueChange={(value) => setNewOrder({ ...newOrder, description: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specific order" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderTypes[newOrder.type as keyof typeof orderTypes]?.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newOrder.priority}
                      onValueChange={(value) => setNewOrder({ ...newOrder, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Clinical Notes</Label>
                    <Textarea
                      placeholder="Additional instructions or clinical context..."
                      value={newOrder.notes}
                      onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={createOrder}
                    className="w-full"
                    disabled={!selectedPatient || !newOrder.type || !newOrder.description}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="grid gap-4">
              {orders
                .filter((order) => order.status === "Pending")
                .map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{order.description}</h3>
                            <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Patient: {order.patientName}</p>
                          <p className="text-sm text-gray-600">Ordered: {new Date(order.orderedAt).toLocaleString()}</p>
                          {order.notes && <p className="text-sm text-gray-600">Notes: {order.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            <Clock className="h-3 w-3 mr-1" />
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{order.description}</h3>
                          <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Patient: {order.patientName}</p>
                        <p className="text-sm text-gray-600">Ordered: {new Date(order.orderedAt).toLocaleString()}</p>
                        {order.notes && <p className="text-sm text-gray-600">Notes: {order.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status === "Completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
