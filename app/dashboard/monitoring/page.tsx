"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  ArrowLeft,
  Heart,
  Thermometer,
  Droplets,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Wifi,
  Server,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function RealTimeMonitoringPage() {
  const [user, setUser] = useState<any>(null)
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkLatency: 0,
    activeUsers: 0,
    onlinePatients: 0,
    systemUptime: 0,
  })
  const [patientVitals, setPatientVitals] = useState<any[]>([])
  const [systemAlerts, setSystemAlerts] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    if (currentUser.role !== "Admin" && currentUser.role !== "Doctor" && currentUser.role !== "Nurse") {
      router.push("/dashboard")
      return
    }

    // Start real-time monitoring
    startRealTimeMonitoring()

    return () => {
      // Cleanup intervals when component unmounts
    }
  }, [router])

  const startRealTimeMonitoring = () => {
    // Simulate real-time system metrics
    const updateSystemMetrics = () => {
      setSystemMetrics({
        cpuUsage: Math.floor(Math.random() * 30) + 20, // 20-50%
        memoryUsage: Math.floor(Math.random() * 20) + 60, // 60-80%
        diskUsage: Math.floor(Math.random() * 10) + 45, // 45-55%
        networkLatency: Math.floor(Math.random() * 20) + 10, // 10-30ms
        activeUsers: Math.floor(Math.random() * 5) + 15, // 15-20 users
        onlinePatients: Math.floor(Math.random() * 10) + 25, // 25-35 patients
        systemUptime: 99.8 + Math.random() * 0.2, // 99.8-100%
      })
    }

    // Simulate patient vitals monitoring
    const updatePatientVitals = () => {
      const patients = JSON.parse(localStorage.getItem("patients") || "[]")
      const vitals = patients.slice(0, 5).map((patient: any) => ({
        id: patient.id,
        name: patient.name,
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
        bloodPressure: {
          systolic: Math.floor(Math.random() * 40) + 110, // 110-150
          diastolic: Math.floor(Math.random() * 20) + 70, // 70-90
        },
        temperature: (Math.random() * 2 + 36.5).toFixed(1), // 36.5-38.5°C
        oxygenSaturation: Math.floor(Math.random() * 5) + 95, // 95-100%
        status: Math.random() > 0.8 ? "Critical" : Math.random() > 0.6 ? "Warning" : "Normal",
        lastUpdate: new Date().toISOString(),
      }))
      setPatientVitals(vitals)
    }

    // Simulate system alerts
    const updateSystemAlerts = () => {
      const alerts = [
        {
          id: "1",
          type: "info",
          message: "System backup completed successfully",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          severity: "Low",
        },
        {
          id: "2",
          type: "warning",
          message: "High memory usage detected on server 2",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          severity: "Medium",
        },
        {
          id: "3",
          type: "success",
          message: "All security scans passed",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          severity: "Low",
        },
      ]
      setSystemAlerts(alerts)
    }

    // Initial load
    updateSystemMetrics()
    updatePatientVitals()
    updateSystemAlerts()

    // Set up intervals for real-time updates
    const metricsInterval = setInterval(updateSystemMetrics, 3000) // Every 3 seconds
    const vitalsInterval = setInterval(updatePatientVitals, 5000) // Every 5 seconds
    const alertsInterval = setInterval(updateSystemAlerts, 10000) // Every 10 seconds

    // Cleanup function
    return () => {
      clearInterval(metricsInterval)
      clearInterval(vitalsInterval)
      clearInterval(alertsInterval)
    }
  }

  const getVitalStatus = (vital: any) => {
    if (vital.status === "Critical") return "text-red-600 bg-red-50 border-red-200"
    if (vital.status === "Warning") return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-green-600 bg-green-50 border-green-200"
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            Real-Time Monitoring
          </h1>
          <p className="text-gray-600">Live system and patient monitoring dashboard</p>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">System Status</CardTitle>
            <Server className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">Online</div>
            <p className="text-xs text-green-600">Uptime: {systemMetrics.systemUptime.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{systemMetrics.activeUsers}</div>
            <p className="text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2 from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Online Patients</CardTitle>
            <Heart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{systemMetrics.onlinePatients}</div>
            <p className="text-xs text-purple-600">Being monitored</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Network Latency</CardTitle>
            <Wifi className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{systemMetrics.networkLatency}ms</div>
            <p className="text-xs text-orange-600">Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      {/* System Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-600" />
            System Performance
          </CardTitle>
          <CardDescription>Real-time server performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-gray-500">{systemMetrics.cpuUsage}%</span>
              </div>
              <Progress value={systemMetrics.cpuUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-500">{systemMetrics.memoryUsage}%</span>
              </div>
              <Progress value={systemMetrics.memoryUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disk Usage</span>
                <span className="text-sm text-gray-500">{systemMetrics.diskUsage}%</span>
              </div>
              <Progress value={systemMetrics.diskUsage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Vitals Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            Patient Vitals Monitoring
          </CardTitle>
          <CardDescription>Real-time patient vital signs monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {patientVitals.map((patient) => (
              <Card key={patient.id} className={`border ${getVitalStatus(patient)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{patient.name}</h3>
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(patient.lastUpdate).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className={getVitalStatus(patient)}>{patient.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-sm font-medium">{patient.heartRate} BPM</div>
                        <div className="text-xs text-gray-500">Heart Rate</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">
                          {patient.bloodPressure.systolic}/{patient.bloodPressure.diastolic}
                        </div>
                        <div className="text-xs text-gray-500">Blood Pressure</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="text-sm font-medium">{patient.temperature}°C</div>
                        <div className="text-xs text-gray-500">Temperature</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-cyan-500" />
                      <div>
                        <div className="text-sm font-medium">{patient.oxygenSaturation}%</div>
                        <div className="text-xs text-gray-500">O2 Saturation</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            System Alerts
          </CardTitle>
          <CardDescription>Recent system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="text-sm font-medium">{alert.message}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
                <Badge variant="outline">{alert.severity}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Security Monitoring
          </CardTitle>
          <CardDescription>Real-time security status and threat detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Firewall Status</div>
                <div className="text-xs text-green-600">Active & Protected</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Encryption</div>
                <div className="text-xs text-green-600">AES-256 Active</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Intrusion Detection</div>
                <div className="text-xs text-green-600">No Threats Detected</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
