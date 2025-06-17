"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Users,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  ArrowLeft,
  Activity,
  Server,
  Wifi,
  Thermometer,
  Key,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function AdminSecurityPage() {
  const [securityLogs, setSecurityLogs] = useState<any[]>([])
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    activeConnections: 0,
    systemLoad: 0,
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: true,
    sessionTimeout: true,
    auditLogging: true,
    encryptionEnabled: true,
    backupEncryption: true,
    accessLogging: true,
    failedLoginLockout: true,
    ipRestriction: false,
    emailNotifications: true,
  })

  useEffect(() => {
    loadSecurityData()
    generateSecurityLogs()
    loadActiveUsers()
    startSystemMonitoring()
  }, [])

  const startSystemMonitoring = () => {
    // Simulate real-time system metrics
    setInterval(() => {
      setSystemMetrics({
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        networkLatency: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 1000),
        systemLoad: Math.random() * 100,
      })
    }, 2000)
  }

  const loadSecurityData = () => {
    const settings = localStorage.getItem("securitySettings")
    if (settings) {
      setSecuritySettings(JSON.parse(settings))
    }
  }

  const generateSecurityLogs = () => {
    const logs = [
      {
        id: "LOG001",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        type: "login_success",
        user: "Dr. Sarah Johnson",
        action: "Successful login",
        ipAddress: "192.168.1.100",
        severity: "info",
      },
      {
        id: "LOG002",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        type: "failed_login",
        user: "unknown",
        action: "Failed login attempt",
        ipAddress: "203.0.113.45",
        severity: "warning",
      },
      {
        id: "LOG003",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        type: "data_access",
        user: "Nurse Mary Wilson",
        action: "Accessed patient record #12345",
        ipAddress: "192.168.1.105",
        severity: "info",
      },
      {
        id: "LOG004",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        type: "permission_change",
        user: "Admin John Smith",
        action: "Modified user permissions for Lab Tech Mike",
        ipAddress: "192.168.1.101",
        severity: "medium",
      },
      {
        id: "LOG005",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        type: "suspicious_activity",
        user: "unknown",
        action: "Multiple failed login attempts from same IP",
        ipAddress: "198.51.100.23",
        severity: "high",
      },
    ]
    setSecurityLogs(logs)
  }

  const loadActiveUsers = () => {
    const users = [
      {
        id: "U001",
        name: "Dr. Sarah Johnson",
        role: "Doctor",
        loginTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        ipAddress: "192.168.1.100",
        location: "Consultation Room 1",
        status: "active",
      },
      {
        id: "U002",
        name: "Nurse Mary Wilson",
        role: "Nurse",
        loginTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        ipAddress: "192.168.1.105",
        location: "Nursing Station",
        status: "active",
      },
      {
        id: "U003",
        name: "Lab Tech Mike Davis",
        role: "Lab Technician",
        loginTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        ipAddress: "192.168.1.110",
        location: "Laboratory",
        status: "idle",
      },
    ]
    setActiveUsers(users)
  }

  const updateSecuritySetting = (setting: string, value: boolean) => {
    const updatedSettings = { ...securitySettings, [setting]: value }
    setSecuritySettings(updatedSettings)
    localStorage.setItem("securitySettings", JSON.stringify(updatedSettings))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "idle":
        return "bg-yellow-100 text-yellow-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const forceLogout = (userId: string) => {
    const updatedUsers = activeUsers.map((user) => (user.id === userId ? { ...user, status: "offline" } : user))
    setActiveUsers(updatedUsers)
    alert(`User ${activeUsers.find((u) => u.id === userId)?.name} has been logged out`)
  }

  const exportSecurityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      securityLogs: securityLogs,
      activeUsers: activeUsers,
      securitySettings: securitySettings,
      summary: {
        totalLogs: securityLogs.length,
        highSeverityAlerts: securityLogs.filter((log) => log.severity === "high").length,
        activeUserCount: activeUsers.filter((user) => user.status === "active").length,
        securityScore:
          (Object.values(securitySettings).filter(Boolean).length / Object.keys(securitySettings).length) * 100,
      },
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `security-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const toggleSetting = (setting: keyof typeof securitySettings) => {
    updateSecuritySetting(setting, !securitySettings[setting])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
          <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
              <p className="text-gray-600">Configure system security and access controls</p>
            </div>
                      </div>
                    </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Authentication
                  </CardTitle>
              <CardDescription>Configure user authentication settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                <Label htmlFor="twoFactorAuth" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Two-Factor Authentication
                </Label>
                    <Switch
                  id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                  onCheckedChange={() => toggleSetting("twoFactorAuth")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                <Label htmlFor="passwordExpiry" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Password Expiry
                </Label>
                    <Switch
                      id="passwordExpiry"
                      checked={securitySettings.passwordExpiry}
                  onCheckedChange={() => toggleSetting("passwordExpiry")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                <Label htmlFor="sessionTimeout" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Session Timeout
                </Label>
                    <Switch
                      id="sessionTimeout"
                      checked={securitySettings.sessionTimeout}
                  onCheckedChange={() => toggleSetting("sessionTimeout")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Access Control
                  </CardTitle>
              <CardDescription>Manage system access and restrictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                <Label htmlFor="ipRestriction" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  IP Restriction
                </Label>
                    <Switch
                  id="ipRestriction"
                  checked={securitySettings.ipRestriction}
                  onCheckedChange={() => toggleSetting("ipRestriction")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                <Label htmlFor="auditLogging" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Audit Logging
                </Label>
                    <Switch
                      id="auditLogging"
                      checked={securitySettings.auditLogging}
                  onCheckedChange={() => toggleSetting("auditLogging")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Security Notifications
                </Label>
                    <Switch
                  id="emailNotifications"
                  checked={securitySettings.emailNotifications}
                  onCheckedChange={() => toggleSetting("emailNotifications")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
      </div>
    </div>
  )
}
