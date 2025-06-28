"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              System Security Management
            </h1>
            <p className="text-gray-600">Monitor and manage system security, access controls, and audit logs</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">System Performance</CardTitle>
              <Server className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">{systemMetrics.cpuUsage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">{systemMetrics.memoryUsage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">System Load</span>
                  <span className="text-sm font-medium">{systemMetrics.systemLoad.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Network Status</CardTitle>
              <Wifi className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Network Latency</span>
                  <span className="text-sm font-medium">{systemMetrics.networkLatency.toFixed(1)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Connections</span>
                  <span className="text-sm font-medium">{systemMetrics.activeConnections}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Security Status</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Active Users</span>
                  <span className="text-sm font-medium">{activeUsers.filter(u => u.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Security Score</span>
                  <span className="text-sm font-medium">
                    {Math.round((Object.values(securitySettings).filter(Boolean).length / Object.keys(securitySettings).length) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="logs">Security Logs</TabsTrigger>
            <TabsTrigger value="users">Active Users</TabsTrigger>
            <TabsTrigger value="settings">Security Settings</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Security Audit Logs</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={generateSecurityLogs}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={exportSecurityReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {log.type === "login_success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {log.type === "failed_login" && <XCircle className="h-4 w-4 text-red-600" />}
                          {log.type === "data_access" && <Eye className="h-4 w-4 text-blue-600" />}
                          {log.type === "permission_change" && <Settings className="h-4 w-4 text-orange-600" />}
                          {log.type === "suspicious_activity" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          <span className="font-medium">{log.action}</span>
                          <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">User: {log.user}</p>
                        <p className="text-sm text-gray-500">IP: {log.ipAddress}</p>
                      </div>
                      <div className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active User Sessions</h2>
              <Button variant="outline" onClick={loadActiveUsers}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{user.name}</span>
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Location: {user.location}</p>
                        <p className="text-sm text-gray-500">IP: {user.ipAddress}</p>
                        <p className="text-sm text-gray-500">Login: {new Date(user.loginTime).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Monitor
                        </Button>
                        {user.status === "active" && (
                          <Button variant="destructive" size="sm" onClick={() => forceLogout(user.id)}>
                            Force Logout
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold">Security Configuration</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Authentication Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all users</p>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => updateSecuritySetting("twoFactorAuth", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="passwordExpiry">Password Expiry</Label>
                      <p className="text-sm text-gray-500">Force password changes every 90 days</p>
                    </div>
                    <Switch
                      id="passwordExpiry"
                      checked={securitySettings.passwordExpiry}
                      onCheckedChange={(checked) => updateSecuritySetting("passwordExpiry", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <p className="text-sm text-gray-500">Auto-logout after 30 minutes of inactivity</p>
                    </div>
                    <Switch
                      id="sessionTimeout"
                      checked={securitySettings.sessionTimeout}
                      onCheckedChange={(checked) => updateSecuritySetting("sessionTimeout", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="failedLoginLockout">Failed Login Lockout</Label>
                      <p className="text-sm text-gray-500">Lock account after 5 failed attempts</p>
                    </div>
                    <Switch
                      id="failedLoginLockout"
                      checked={securitySettings.failedLoginLockout}
                      onCheckedChange={(checked) => updateSecuritySetting("failedLoginLockout", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Data Protection Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="encryption">Data Encryption</Label>
                      <p className="text-sm text-gray-500">Encrypt all patient data at rest</p>
                    </div>
                    <Switch
                      id="encryption"
                      checked={securitySettings.encryptionEnabled}
                      onCheckedChange={(checked) => updateSecuritySetting("encryptionEnabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="backupEncryption">Backup Encryption</Label>
                      <p className="text-sm text-gray-500">Encrypt all backup files</p>
                    </div>
                    <Switch
                      id="backupEncryption"
                      checked={securitySettings.backupEncryption}
                      onCheckedChange={(checked) => updateSecuritySetting("backupEncryption", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auditLogging">Audit Logging</Label>
                      <p className="text-sm text-gray-500">Log all system activities</p>
                    </div>
                    <Switch
                      id="auditLogging"
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => updateSecuritySetting("auditLogging", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="accessLogging">Access Logging</Label>
                      <p className="text-sm text-gray-500">Log all data access attempts</p>
                    </div>
                    <Switch
                      id="accessLogging"
                      checked={securitySettings.accessLogging}
                      onCheckedChange={(checked) => updateSecuritySetting("accessLogging", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <h2 className="text-xl font-semibold">HIPAA Compliance Status</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    Compliance Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { item: "Data Encryption", status: true },
                      { item: "Access Controls", status: true },
                      { item: "Audit Logging", status: true },
                      { item: "User Authentication", status: true },
                      { item: "Data Backup", status: true },
                      { item: "Incident Response Plan", status: true },
                      { item: "Staff Training", status: false },
                      { item: "Risk Assessment", status: false },
                    ].map((check, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{check.item}</span>
                        {check.status ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Compliance Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Generate HIPAA Compliance Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Security Audit Trail
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Risk Assessment
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Incident Report
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
