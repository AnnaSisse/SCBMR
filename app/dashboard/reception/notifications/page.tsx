"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Search,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ReceptionNotificationsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const [notifications, setNotifications] = useState([
    {
      id: "N001",
      type: "appointment",
      title: "New Appointment Request",
      message: "Patient John Doe requested an appointment for tomorrow at 2:00 PM",
      patientName: "John Doe",
      patientPhone: "+1-555-0001",
      status: "unread",
      priority: "high",
      createdAt: "2024-06-20T10:30:00.000Z",
      department: "Cardiology"
    },
    {
      id: "N002",
      type: "checkin",
      title: "Patient Checked In",
      message: "Jane Smith has checked in for her 11:00 AM appointment",
      patientName: "Jane Smith",
      patientPhone: "+1-555-0002",
      status: "read",
      priority: "medium",
      createdAt: "2024-06-20T11:00:00.000Z",
      department: "General Medicine"
    },
    {
      id: "N003",
      type: "emergency",
      title: "Emergency Patient Arrival",
      message: "Emergency patient Robert Johnson arrived at Emergency Department",
      patientName: "Robert Johnson",
      patientPhone: "+1-555-0003",
      status: "unread",
      priority: "urgent",
      createdAt: "2024-06-20T11:15:00.000Z",
      department: "Emergency"
    }
  ])

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Receptionist") {
      router.push("/dashboard")
      return
    }

    setIsLoading(false)
  }, [router])

  const filteredNotifications = notifications.filter((notification) => {
    const searchLower = searchTerm.toLowerCase()
    return notification.title.toLowerCase().includes(searchLower) ||
           notification.message.toLowerCase().includes(searchLower) ||
           notification.patientName.toLowerCase().includes(searchLower)
  })

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, status: "read" }
        : notification
    ))
    toast.success("Notification marked as read")
  }

  const unreadCount = notifications.filter(n => n.status === "unread").length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-8 w-8 text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </h1>
            <p className="text-gray-600">Manage patient notifications and alerts</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>View and manage all notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                    <p className="text-gray-600">Try adjusting your search</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg ${
                        notification.status === "unread" 
                          ? "border-blue-200 bg-blue-50" 
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">
                            {notification.type === "emergency" ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : notification.type === "checkin" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{notification.title}</h3>
                              <Badge variant="outline">
                                {notification.priority}
                              </Badge>
                              {notification.status === "unread" && (
                                <Badge variant="default" className="bg-blue-600">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {notification.patientName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {notification.patientPhone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(notification.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {notification.status === "unread" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 