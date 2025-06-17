"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Database, Shield, Settings, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPatients: 0,
    systemHealth: "100%"
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== "Admin") {
      router.push("/dashboard")
      return
    }

    // Load admin stats
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const patients = JSON.parse(localStorage.getItem("patients") || "[]")
    
    setStats({
      totalUsers: users.length,
      activeUsers: users.filter((u: any) => u.status === "active").length,
      totalPatients: patients.length,
      systemHealth: "100%"
    })
  }, [router])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Complete system control and management</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.activeUsers}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.totalPatients}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">System Health</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.systemHealth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Navigation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              User Management
            </CardTitle>
            <CardDescription>Manage system users and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/user-management">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              Data Management
            </CardTitle>
            <CardDescription>Manage system data and records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/data-management">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Database className="h-4 w-4 mr-2" />
                Manage Data
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage system security and access</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/security">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Analytics
            </CardTitle>
            <CardDescription>View system analytics and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/analytics">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-red-600" />
              System Settings
            </CardTitle>
            <CardDescription>Configure system-wide settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/settings">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-yellow-600" />
              Reports
            </CardTitle>
            <CardDescription>Generate and view system reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/reports">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                <FileText className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 