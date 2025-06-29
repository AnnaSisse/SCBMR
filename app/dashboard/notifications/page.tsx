"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  User, 
  Calendar,
  FileText,
  Stethoscope,
  Trash2,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import React from 'react'

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  action_url?: string
  user_id: number
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = safeLocalStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    const currentUser = JSON.parse(userData)
    setUser(currentUser)
    loadNotifications()
  }, [router])

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      if (!res.ok) throw new Error("Failed to fetch notifications")
      const data = await res.json()
      setNotifications(data)
    } catch (error) {
      console.error('Error loading notifications:', error)
      // For demo purposes, create some sample notifications
      createSampleNotifications()
    }
  }

  const createSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        type: "success",
        title: "Patient Discharged",
        message: "Patient #12345 has been successfully discharged from Ward A",
        timestamp: new Date().toISOString(),
        read: false,
        action_url: "/dashboard/hospitalisations",
        user_id: 1
      },
      {
        id: "2",
        type: "warning",
        title: "Examination Results Ready",
        message: "Blood test results for Patient #12346 are now available",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        action_url: "/dashboard/examinations/results",
        user_id: 1
      },
      {
        id: "3",
        type: "info",
        title: "New Appointment",
        message: "New appointment scheduled for tomorrow at 10:00 AM",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        action_url: "/dashboard/appointments",
        user_id: 1
      },
      {
        id: "4",
        type: "error",
        title: "System Maintenance",
        message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        read: false,
        user_id: 1
      }
    ]
    setNotifications(sampleNotifications)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH"
      })
      
      if (res.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        )
      }
    } catch (error) {
      // For demo purposes, update locally
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
    }
  }

  const markAllAsRead = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "PATCH"
      })
      
      if (res.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
        toast.success("All notifications marked as read")
      }
    } catch (error) {
      // For demo purposes, update locally
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
      toast.success("All notifications marked as read")
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE"
      })
      
      if (res.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
        toast.success("Notification deleted")
      }
    } catch (error) {
      // For demo purposes, remove locally
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      toast.success("Notification deleted")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error": return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "border-green-200 bg-green-50"
      case "warning": return "border-yellow-200 bg-yellow-50"
      case "error": return "border-red-200 bg-red-50"
      default: return "border-blue-200 bg-blue-50"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const allNotifications = notifications
  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-8 w-8 text-blue-600" />
              Notifications
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} disabled={loading} variant="outline">
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications to display</p>
                </CardContent>
              </Card>
            ) : (
              allNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {unreadNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">No unread notifications</p>
                </CardContent>
              </Card>
            ) : (
              unreadNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {readNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No read notifications</p>
                </CardContent>
              </Card>
            ) : (
              readNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  getNotificationIcon, 
  getNotificationColor 
}: {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  getNotificationIcon: (type: string) => React.JSX.Element
  getNotificationColor: (type: string) => string
}) {
  return (
    <Card className={`${getNotificationColor(notification.type)} ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                {!notification.read && (
                  <Badge variant="secondary" className="text-xs">New</Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notification.action_url && (
              <Link href={notification.action_url}>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </Link>
            )}
            {!notification.read && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 