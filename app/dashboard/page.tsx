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
  LayoutDashboard,
  History,
  TrendingUp,
  TrendingDown,
  FlaskConical,
  HeartPulse,
  User as UserIcon,
  Lock,
  BookUser,
  Briefcase,
  Boxes,
  MessageCircle,
  Camera
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number;
  name: string;
  role: string;
  // add other fields as needed
}

interface DashboardStats {
  [key: string]: number | string | undefined;
  totalPatients?: number;
  totalDoctors?: number;
  totalAppointments?: number;
  successRate?: number;
  // add other fields as needed
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    successRate: 0,
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
      totalPatients: patients.length,
      totalDoctors: 0, // Assuming totalDoctors is not available in the current stats
      totalAppointments: appointments.length,
      successRate: 100, // Assuming successRate is not available in the current stats
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
            <Avatar>
              <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <Badge variant="outline">{currentUser.role}</Badge>
            <Button variant="outline" onClick={() => {
              localStorage.removeItem("currentUser")
              router.push("/auth/login")
            }}>
              Logout
            </Button>
          </div>
        </div>

        {currentUser.role?.toLowerCase() === "admin" && <AdminDashboard stats={stats} />}
        {currentUser.role?.toLowerCase() === "doctor" && <DoctorDashboard stats={stats} />}
        {currentUser.role?.toLowerCase() === "nurse" && <NurseDashboard stats={stats} />}
        {currentUser.role?.toLowerCase() === "lab technician" && <LabTechDashboard stats={stats} />}
        {currentUser.role?.toLowerCase() === "receptionist" && <ReceptionistDashboard stats={stats} />}
        {currentUser.role?.toLowerCase() === "civil authority" && <CivilAuthorityDashboard stats={stats} />}
        {currentUser.role?.toLowerCase() === "data manager" && <DataManagerDashboard stats={stats} />}
        {currentUser.role?.toLowerCase() === "patient" && <PatientDashboard user={currentUser} />}
      </div>
    </div>
  )
}

function AdminDashboard({ stats }: { stats: DashboardStats }) {
  const { totalPatients, totalDoctors, totalAppointments, successRate } = stats

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Complete system control and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{totalPatients}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{totalDoctors}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{totalAppointments}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">System Health</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">100%</div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Data Management
            </CardTitle>
            <CardDescription>Complete control over all system data</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/data-management">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Database className="h-4 w-4 mr-2" />
                Manage System Data
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              User Management
            </CardTitle>
            <CardDescription>Manage all system users and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/user-management">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-purple-600" />
              Real-Time Monitoring
            </CardTitle>
            <CardDescription>Live system and patient monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/monitoring">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Monitor className="h-4 w-4 mr-2" />
                View Monitoring
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Analytics & Reports
            </CardTitle>
            <CardDescription>Comprehensive system analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/analytics">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stamp className="h-5 w-5 text-red-600" />
              Civil Authority
            </CardTitle>
            <CardDescription>Birth and death certificate management</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/civil-authority">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Stamp className="h-4 w-4 mr-2" />
                Civil Registry
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              System Security
            </CardTitle>
            <CardDescription>Security monitoring and management</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/security">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Shield className="h-4 w-4 mr-2" />
                Security Center
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-emerald-600" />
              Reports & Downloads
            </CardTitle>
            <CardDescription>Generate and download system reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/reports">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-pink-600" />
              Pediatrics Department
            </CardTitle>
            <CardDescription>Specialized care for children and adolescents</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/pediatrics">
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                <Baby className="h-4 w-4 mr-2" />
                Pediatrics Portal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              Hospitalisations
            </CardTitle>
            <CardDescription>View and manage all hospitalisations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/hospitalisations">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <HeartPulse className="h-4 w-4 mr-2" />
                Manage Hospitalisations
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-yellow-600" />
              Examinations
            </CardTitle>
            <CardDescription>View and manage all examinations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/examinations">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                <FlaskConical className="h-4 w-4 mr-2" />
                Manage Examinations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DoctorDashboard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600">Patient care and medical management</p>
      </div>

      {/* Doctor Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Patient Records
            </CardTitle>
            <CardDescription>View and manage patient medical records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/doctor/patient-records">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Users className="h-4 w-4 mr-2" />
                View Records
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
            <CardDescription>Manage your appointment schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/appointments">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              Telemedicine
            </CardTitle>
            <CardDescription>Virtual consultations and remote care</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/telemedicine">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Video className="h-4 w-4 mr-2" />
                Virtual Consultations
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-orange-600" />
              Prescriptions
            </CardTitle>
            <CardDescription>Manage patient prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/prescriptions">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Pill className="h-4 w-4 mr-2" />
                Manage Prescriptions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Analytics
            </CardTitle>
            <CardDescription>View medical analytics and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/analytics">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Civil Authority
            </CardTitle>
            <CardDescription>Death certificate collaboration</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/doctor/civil-authority">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Heart className="h-4 w-4 mr-2" />
                Death Certificates
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              Hospitalisations
            </CardTitle>
            <CardDescription>View and manage patient hospitalisations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/doctor/hospitalisations">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <HeartPulse className="h-4 w-4 mr-2" />
                Manage Hospitalisations
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-yellow-600" />
              Examinations
            </CardTitle>
            <CardDescription>View and manage patient examinations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/examinations">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                <FlaskConical className="h-4 w-4 mr-2" />
                Manage Examinations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PatientDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
        <p className="text-gray-600">Your health information and appointments</p>
      </div>

      {/* Patient Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              My Medical Records
            </CardTitle>
            <CardDescription>View your medical history and records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patient/my-records">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                View Records
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              My Appointments
            </CardTitle>
            <CardDescription>Schedule and manage appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/appointments">
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
              <Activity className="h-5 w-5 text-purple-600" />
              Health Tracking
            </CardTitle>
            <CardDescription>Track your health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patient/my-records">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Activity className="h-4 w-4 mr-2" />
                View Health Data
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-orange-600" />
              My Prescriptions
            </CardTitle>
            <CardDescription>View your current medications</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patient/my-records">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Pill className="h-4 w-4 mr-2" />
                View Prescriptions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-indigo-600" />
              Telemedicine
            </CardTitle>
            <CardDescription>Join virtual consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/telemedicine">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Video className="h-4 w-4 mr-2" />
                Virtual Consultations
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              My Hospitalisations
            </CardTitle>
            <CardDescription>View your hospital admission history</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/hospitalisations">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <HeartPulse className="h-4 w-4 mr-2" />
                View Hospitalisations
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-yellow-600" />
              My Examinations
            </CardTitle>
            <CardDescription>View your examination results</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/examinations/results">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                <FlaskConical className="h-4 w-4 mr-2" />
                View Examinations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NurseDashboard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nurse Dashboard</h1>
        <p className="text-gray-600">Patient care and nursing management</p>
      </div>

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
            <Link href="/dashboard/monitoring">
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
            <CardDescription>View and manage patient care plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/nurse/care-plans">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <FileText className="h-4 w-4 mr-2" />
                View Care Plans
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              Hospitalisations
            </CardTitle>
            <CardDescription>View and manage hospital admissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/hospitalisations">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <HeartPulse className="h-4 w-4 mr-2" />
                View Hospitalisations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LabTechDashboard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lab Technician Dashboard</h1>
        <p className="text-gray-600">Laboratory tests and results management</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Analytics
            </CardTitle>
            <CardDescription>View performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/lab/analytics">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Test Results
            </CardTitle>
            <CardDescription>Enter and manage test results</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/lab/results">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Activity className="h-4 w-4 mr-2" />
                Manage Results
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Lab Reports
            </CardTitle>
            <CardDescription>Generate laboratory reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/lab/results">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-600" />
              Sample Tracking
            </CardTitle>
            <CardDescription>Track sample status</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/lab/results">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Search className="h-4 w-4 mr-2" />
                Track Samples
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-teal-600" />
              Inventory
            </CardTitle>
            <CardDescription>Manage lab supplies</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/lab/inventory">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <Boxes className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReceptionistDashboard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Receptionist Dashboard</h1>
        <p className="text-gray-600">Patient registration and appointments management</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Patient Registration
            </CardTitle>
            <CardDescription>Register new patients</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patients/new">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
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
            <CardDescription>Schedule and manage appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/appointments">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Insurance Verification
            </CardTitle>
            <CardDescription>Verify patient insurance</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/reception/insurance">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <FileText className="h-4 w-4 mr-2" />
                Verify Insurance
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Patient Records
            </CardTitle>
            <CardDescription>View and manage patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patients">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Users className="h-4 w-4 mr-2" />
                View Records
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Notifications
            </CardTitle>
            <CardDescription>View important notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/reception/notifications">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Bell className="h-4 w-4 mr-2" />
                View Notifications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              Hospitalisations
            </CardTitle>
            <CardDescription>Admit and view hospitalised patients</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/hospitalisations/admit">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <HeartPulse className="h-4 w-4 mr-2" />
                Admit Patient
              </Button>
            </Link>
            <Link href="/dashboard/hospitalisations">
              <Button className="w-full bg-teal-500 hover:bg-teal-600 mt-2">
                <HeartPulse className="h-4 w-4 mr-2" />
                View All Hospitalisations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CivilAuthorityDashboard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Certificates
          </CardTitle>
          <CardDescription>Manage birth and death certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/certificates">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              View Certificates
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-green-600" />
            Approve Certificates
          </CardTitle>
          <CardDescription>Review and approve certificate requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/certificates/approve">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <FileCheck className="h-4 w-4 mr-2" />
              Approve Requests
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-purple-600" />
            Reports
          </CardTitle>
          <CardDescription>View and generate reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/certificates/reports">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <ClipboardList className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-yellow-600" />
            Statistics
          </CardTitle>
          <CardDescription>View certificate statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/certificates/statistics">
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              <Activity className="h-4 w-4 mr-2" />
              View Statistics
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-red-600" />
            Settings
          </CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/settings">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

function DataManagerDashboard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Data Management
          </CardTitle>
          <CardDescription>Manage system data</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/admin/data-management">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Database className="h-4 w-4 mr-2" />
              Manage Data
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-green-600" />
            Export Data
          </CardTitle>
          <CardDescription>Export system data</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/admin/data-management/export">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-purple-600" />
            Import Data
          </CardTitle>
          <CardDescription>Import system data</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/admin/data-management/import">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
