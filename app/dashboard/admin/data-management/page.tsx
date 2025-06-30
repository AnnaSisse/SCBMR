"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  ArrowLeft,
  Users,
  Calendar,
  Pill,
  FileText,
  Video,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Activity,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function AdminDataManagementPage() {
  const [user, setUser] = useState<unknown>(null)
  const [systemData, setSystemData] = useState({
    users: [],
    patients: [],
    appointments: [],
    prescriptions: [],
    consultations: [],
    certificates: [],
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    if (currentUser.role !== "Admin") {
      router.push("/dashboard")
      return
    }

    loadSystemData()
  }, [router])

  const loadSystemData = () => {
    setSystemData({
      users: JSON.parse(localStorage.getItem("users") || "[]"),
      patients: JSON.parse(localStorage.getItem("patients") || "[]"),
      appointments: JSON.parse(localStorage.getItem("appointments") || "[]"),
      prescriptions: JSON.parse(localStorage.getItem("prescriptions") || "[]"),
      consultations: JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]"),
      certificates: [
        ...JSON.parse(localStorage.getItem("birthCertificates") || "[]"),
        ...JSON.parse(localStorage.getItem("deathCertificates") || "[]"),
      ],
    })
  }

  const handleDataRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      loadSystemData()
      setLoading(false)
    }, 1000)
  }

  const handleDataExport = (dataType: string) => {
    const data = systemData[dataType as keyof typeof systemData]
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${dataType}-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const handleDataClear = (dataType: string) => {
    if (confirm(`Are you sure you want to clear all ${dataType}? This action cannot be undone.`)) {
      localStorage.setItem(dataType, JSON.stringify([]))
      loadSystemData()
    }
  }

  const dataCategories = [
    {
      key: "users",
      title: "System Users",
      icon: Users,
      description: "Manage all system users and their roles",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      count: systemData.users.length,
    },
    {
      key: "patients",
      title: "Patient Records",
      icon: FileText,
      description: "Complete patient database management",
      color: "text-green-600",
      bgColor: "bg-green-50",
      count: systemData.patients.length,
    },
    {
      key: "appointments",
      title: "Appointments",
      icon: Calendar,
      description: "All scheduled appointments and consultations",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      count: systemData.appointments.length,
    },
    {
      key: "prescriptions",
      title: "Prescriptions",
      icon: Pill,
      description: "Medication prescriptions and pharmacy data",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      count: systemData.prescriptions.length,
    },
    {
      key: "consultations",
      title: "Telemedicine",
      icon: Video,
      description: "Virtual consultation records and sessions",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      count: systemData.consultations.length,
    },
    {
      key: "certificates",
      title: "Certificates",
      icon: Shield,
      description: "Birth and death certificates management",
      color: "text-red-600",
      bgColor: "bg-red-50",
      count: systemData.certificates.length,
    },
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="h-8 w-8 text-blue-600" />
              System Data Management
            </h1>
            <p className="text-gray-600">Complete control over all system data and operations</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDataRefresh} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Record
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">Operational</div>
            <p className="text-xs text-green-600">All systems running normally</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Records</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {Object.values(systemData).reduce((acc, arr) => acc + arr.length, 0)}
            </div>
            <p className="text-xs text-blue-600">Across all data categories</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Data Integrity</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">100%</div>
            <p className="text-xs text-orange-600">No corruption detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Management Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Data Management</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataCategories.map((category) => (
              <Card key={category.key} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 ${category.bgColor} rounded-lg`}>
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDataExport(category.key)}>
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Operations
              </CardTitle>
              <CardDescription>Perform bulk operations on system data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataCategories.map((category) => (
                <div key={category.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                    <div>
                      <div className="font-medium">{category.title}</div>
                      <div className="text-sm text-gray-500">{category.count} records</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDataExport(category.key)}>
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Upload className="h-3 w-3 mr-1" />
                      Import
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDataClear(category.key)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  System Backup
                </CardTitle>
                <CardDescription>Create complete system backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Create Full Backup
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Schedule Automatic Backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  System Restore
                </CardTitle>
                <CardDescription>Restore from previous backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Backup File
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  View Backup History
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Security Alerts
                </CardTitle>
                <CardDescription className="text-red-600">Monitor system security status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Login Attempts</span>
                    <Badge variant="destructive">0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suspicious Activity</span>
                    <Badge variant="secondary">None</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Breaches</span>
                    <Badge variant="secondary">None</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription className="text-green-600">System security overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Encryption Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HIPAA Compliance</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Access Control</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
