"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  Users,
  FileText,
  Activity,
  Shield,
  Heart,
  Video,
  Pill,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  Zap,
} from "lucide-react"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    successRate: 98,
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    loadStats()
  }, [])

  const loadStats = () => {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]")
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")

    setStats({
      totalPatients: patients.length,
      totalDoctors: users.filter((u: any) => u.role === "Doctor").length,
      totalAppointments: appointments.length,
      successRate: 98,
    })
  }

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }

  const features = [
    {
      icon: Shield,
      title: "HIPAA Compliant Security",
      description: "End-to-end encryption with military-grade security protocols",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      title: "Multi-Role Management",
      description: "Complete role-based access for all healthcare professionals",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Video,
      title: "Telemedicine Platform",
      description: "Secure virtual consultations with HD video and real-time monitoring",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Pill,
      title: "Smart Prescriptions",
      description: "AI-powered prescription management with drug interaction alerts",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights and comprehensive reporting dashboards",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: FileText,
      title: "Digital Certificates",
      description: "Automated birth and death certificate generation with civil authority integration",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MedRecord Pro
                </span>
                <p className="text-xs text-gray-500">Healthcare Management System</p>
              </div>
            </div>
            <div className="flex gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Activity className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                  <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                  <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/auth/login")}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button onClick={() => router.push("/auth/register")} className="bg-blue-600 hover:bg-blue-700">
                    <Users className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Next-Generation Healthcare
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Secure Cloud-Based
                  </span>
                  <br />
                  <span className="text-gray-900">Medical Records</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Revolutionary healthcare management platform with AI-powered insights, telemedicine capabilities, and
                  comprehensive patient care coordination for modern medical facilities in Cameroon.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalPatients}+</div>
                  <div className="text-sm text-gray-600">Patients Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.totalDoctors}+</div>
                  <div className="text-sm text-gray-600">Healthcare Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.totalAppointments}+</div>
                  <div className="text-sm text-gray-600">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 border-0 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Heart className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Patient Care</div>
                        <div className="text-xs text-gray-500">Real-time monitoring</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 border-0 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Video className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Telemedicine</div>
                        <div className="text-xs text-gray-500">Virtual consultations</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 border-0 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Analytics</div>
                        <div className="text-xs text-gray-500">Data insights</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 border-0 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Shield className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Security</div>
                        <div className="text-xs text-gray-500">HIPAA compliant</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <Star className="h-3 w-3 mr-1" />
              Advanced Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Modern Healthcare</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of tools designed to streamline healthcare operations and improve patient outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">MedRecord Pro</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing healthcare management with secure, intelligent, and user-friendly solutions for
                Cameroon.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Patient Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Telemedicine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Prescription Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Analytics & Reports
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Help Center</li>
                <li>Contact Support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  sissestephany0@gmail.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +237 696 162 344
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Douala, Cameroon
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 MedRecord Pro. All rights reserved. HIPAA Compliant Healthcare Management System for Cameroon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
