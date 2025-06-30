"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Stethoscope, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ExaminationSchedulePage() {
  const [orders, setOrders] = useState<any[]>([])
  const [scheduledExams, setScheduledExams] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [scheduleForm, setScheduleForm] = useState({
    scheduled_date: "",
    scheduled_time: "",
    room: "",
    technician_id: ""
  })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = safeLocalStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)
    loadOrders()
    loadScheduledExams()
  }, [router])

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/examinations/order")
      if (!res.ok) throw new Error("Failed to fetch orders")
      const data = await res.json()
      setOrders(data.filter((order: any) => order.status === "pending"))
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error("Failed to load examination orders")
    }
  }

  const loadScheduledExams = async () => {
    try {
      const res = await fetch("/api/examinations/schedule")
      if (!res.ok) throw new Error("Failed to fetch scheduled exams")
      const data = await res.json()
      setScheduledExams(data)
    } catch (error) {
      console.error('Error loading scheduled exams:', error)
      toast.error("Failed to load scheduled examinations")
    }
  }

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    setLoading(true)
    try {
      const res = await fetch("/api/examinations/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrder.order_id,
          ...scheduleForm
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Examination scheduled successfully!")
        setSelectedOrder(null)
        setScheduleForm({
          scheduled_date: "",
          scheduled_time: "",
          room: "",
          technician_id: ""
        })
        loadOrders()
        loadScheduledExams()
      } else {
        toast.error(data.message || "Failed to schedule examination")
      }
    } catch (error) {
      toast.error("An error occurred while scheduling")
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "normal": return "bg-blue-100 text-blue-800"
      case "low": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-green-100 text-green-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/examinations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Examinations
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Examination Scheduling
            </h1>
          </div>
          <p className="text-gray-600">Schedule pending examination orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>Examination orders awaiting scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pending orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.order_id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{order.examination_type}</h3>
                          <p className="text-sm text-gray-600">Patient ID: {order.patient_id}</p>
                          <p className="text-sm text-gray-600">Department: {order.department}</p>
                        </div>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Requested: {new Date(order.requested_date).toLocaleDateString()}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scheduling Form */}
          {selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule Examination</CardTitle>
                <CardDescription>
                  Schedule: {selectedOrder.examination_type} for Patient {selectedOrder.patient_id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSchedule} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_date">Date *</Label>
                      <Input
                        type="date"
                        value={scheduleForm.scheduled_date}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scheduled_time">Time *</Label>
                      <Input
                        type="time"
                        value={scheduleForm.scheduled_time}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduled_time: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="room">Room/Equipment</Label>
                      <Input
                        placeholder="e.g., Lab 1, MRI Room"
                        value={scheduleForm.room}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, room: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technician_id">Assigned Technician</Label>
                      <Input
                        placeholder="Technician ID or name"
                        value={scheduleForm.technician_id}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, technician_id: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Scheduling..." : "Schedule Examination"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Scheduled Examinations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Scheduled Examinations</CardTitle>
            <CardDescription>Upcoming and completed examinations</CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledExams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No scheduled examinations</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Examination</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledExams.map((exam) => (
                    <TableRow key={exam.schedule_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          Patient {exam.patient_id}
                        </div>
                      </TableCell>
                      <TableCell>{exam.examination_type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(exam.scheduled_date).toLocaleDateString()}
                          <Clock className="h-4 w-4 text-gray-400" />
                          {exam.scheduled_time}
                        </div>
                      </TableCell>
                      <TableCell>{exam.room || "TBD"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(exam.status)}>
                          {exam.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 