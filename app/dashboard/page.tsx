"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Stethoscope,
  LogOut,
  Plus,
  Search,
  Bell,
  Settings,
  Video,
  Pill,
  BarChart3,
  Database,
  Stamp,
  Heart,
  Baby,
  Shield,
  Monitor,
  Download,
  Edit,
  Trash2,
  Upload,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  ClipboardList,
  FileCheck,
  FileX,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  UserCog,
  UserX,
  UserCheck2,
  UserMinus,
  UserPlus2,
  UserSettings,
  UserShield,
  UserLock,
  UserUnlock,
  UserEdit,
  UserSearch,
  UserList,
  UserRound,
  UserSquare,
  UserCircle,
  UserCircle2,
  UserCirclePlus,
  UserCircleMinus,
  UserCircleCheck,
  UserCircleX,
  UserCirclePlus2,
  UserCircleMinus2,
  UserCircleCheck2,
  UserCircleX2,
  UserCirclePlus3,
  UserCircleMinus3,
  UserCircleCheck3,
  UserCircleX3,
  UserCirclePlus4,
  UserCircleMinus4,
  UserCircleCheck4,
  UserCircleX4,
  UserCirclePlus5,
  UserCircleMinus5,
  UserCircleCheck5,
  UserCircleX5,
  UserCirclePlus6,
  UserCircleMinus6,
  UserCircleCheck6,
  UserCircleX6,
  UserCirclePlus7,
  UserCircleMinus7,
  UserCircleCheck7,
  UserCircleX7,
  UserCirclePlus8,
  UserCircleMinus8,
  UserCircleCheck8,
  UserCircleX8,
  UserCirclePlus9,
  UserCircleMinus9,
  UserCircleCheck9,
  UserCircleX9,
  UserCirclePlus10,
  UserCircleMinus10,
  UserCircleCheck10,
  UserCircleX10,
  LayoutDashboard,
  History,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    prescriptions: 0,
    consultations: 0,
    certificates: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    // Load stats based on user role
    loadStats(user.role)
  }, [router])

  const loadStats = (role: string) => {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]")
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]")
    const consultations = JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]")
    const certificates = [
      ...JSON.parse(localStorage.getItem("birthCertificates") || "[]"),
      ...JSON.parse(localStorage.getItem("deathCertificates") || "[]"),
    ]

    setStats({
      patients: patients.length,
      appointments: appointments.length,
      prescriptions: prescriptions.length,
      consultations: consultations.length,
      certificates: certificates.length,
    })
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{currentUser.role}</Badge>
            <Button variant="outline" onClick={() => {
              localStorage.removeItem("currentUser")
              router.push("/auth/login")
            }}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.patients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appointments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.prescriptions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultations</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.consultations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Role-specific dashboard components */}
        {currentUser.role === "Admin" && <AdminDashboard stats={stats} />}
        {currentUser.role === "Doctor" && <DoctorDashboard stats={stats} />}
        {currentUser.role === "Nurse" && <NurseDashboard stats={stats} />}
        {currentUser.role === "Lab Technician" && <LabTechDashboard stats={stats} />}
        {currentUser.role === "Receptionist" && <ReceptionistDashboard stats={stats} />}
        {currentUser.role === "Civil Authority" && <CivilAuthorityDashboard stats={stats} />}
        {currentUser.role === "Data Manager" && <DataManagerDashboard stats={stats} />}
        {currentUser.role === "Patient" && <PatientDashboard user={currentUser} />}
      </div>
    </div>
  )
}

function AdminDashboard({ stats }: { stats: any }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600">Complete system control and management</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prescriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultations}</div>
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
      </div>
    </div>
  )
}

function DoctorDashboard({ stats }: { stats: any }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h2>
          <p className="text-gray-600">Patient care and medical management</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Doctor Navigation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Patient Management
            </CardTitle>
            <CardDescription>View and manage patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/doctor/patients">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Users className="h-4 w-4 mr-2" />
                View Patients
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Appointments
            </CardTitle>
            <CardDescription>Manage patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/doctor/appointments">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                View Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              Prescriptions
            </CardTitle>
            <CardDescription>Manage patient prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/doctor/prescriptions">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Pill className="h-4 w-4 mr-2" />
                Manage Prescriptions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PatientDashboard({ user }: { user: any }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Dashboard</h2>
          <p className="text-gray-600">Welcome to your healthcare portal</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Patient Navigation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Appointments
            </CardTitle>
            <CardDescription>View your appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patient/appointments">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                View Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Medical Records
            </CardTitle>
            <CardDescription>View your medical records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patient/records">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                View Records
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              Prescriptions
            </CardTitle>
            <CardDescription>View your prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patient/prescriptions">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Pill className="h-4 w-4 mr-2" />
                View Prescriptions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NurseDashboard({ stats }: { stats: any }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h2>
          <p className="text-gray-600">Patient care and monitoring</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Nurse Navigation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Patient Care
            </CardTitle>
            <CardDescription>View assigned patients</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/nurse/assigned-patients">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Users className="h-4 w-4 mr-2" />
                View Assigned Patients
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Vital Signs
            </CardTitle>
            <CardDescription>Record and monitor patient vitals</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/nurse/vital-signs">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Activity className="h-4 w-4 mr-2" />
                Record Vitals
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Care Plans
            </CardTitle>
            <CardDescription>Manage patient care plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/nurse/care-plans">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <FileText className="h-4 w-4 mr-2" />
                Manage Care Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LabTechDashboard({ stats }: { stats: any }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lab Technician Dashboard</h2>
          <p className="text-gray-600">Laboratory and test management</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Lab Tech Navigation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Lab Tests
            </CardTitle>
            <CardDescription>Manage laboratory tests</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/lab/tests">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Activity className="h-4 w-4 mr-2" />
                Manage Tests
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Test Results
            </CardTitle>
            <CardDescription>View and manage test results</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/lab/results">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                View Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReceptionistDashboard({ stats }: { stats: any }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h2>
          <p className="text-gray-600">Patient registration and scheduling</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Receptionist Navigation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Patient Registration
            </CardTitle>
            <CardDescription>Register new patients</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/reception/register">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Users className="h-4 w-4 mr-2" />
                Register Patient
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Appointments
            </CardTitle>
            <CardDescription>Manage patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/reception/appointments">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CivilAuthorityDashboard({ stats }: { stats: any }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Civil Authority Dashboard</h2>
          <p className="text-gray-600">Certificate and document management</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Civil Authority Navigation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Birth Certificates
            </CardTitle>
            <CardDescription>Manage birth certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/civil-authority/birth-certificates">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Manage Birth Certificates
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Death Certificates
            </CardTitle>
            <CardDescription>Manage death certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/civil-authority/death-certificates">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                Manage Death Certificates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DataManagerDashboard({ stats }: { stats: any }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Manager Dashboard</h2>
          <p className="text-gray-600">System data management and analytics</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Data Manager Navigation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Data Management
            </CardTitle>
            <CardDescription>Manage system data</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/data-manager/data">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Database className="h-4 w-4 mr-2" />
                Manage Data
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Analytics
            </CardTitle>
            <CardDescription>View system analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/data-manager/analytics">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
