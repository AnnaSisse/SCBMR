"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, ArrowLeft, Users, Calendar, Pill, TrendingUp, TrendingDown, Activity, FileText } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>({})
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)

    if (currentUser.role !== "Admin" && currentUser.role !== "Doctor") {
      router.push("/dashboard")
      return
    }

    generateAnalytics()
  }, [router])

  const generateAnalytics = () => {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]")
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]")
    const consultations = JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]")

    // Patient Demographics
    const ageGroups = {
      "0-18": 0,
      "19-35": 0,
      "36-50": 0,
      "51-65": 0,
      "65+": 0,
    }

    patients.forEach((patient: any) => {
      const age = patient.age
      if (age <= 18) ageGroups["0-18"]++
      else if (age <= 35) ageGroups["19-35"]++
      else if (age <= 50) ageGroups["36-50"]++
      else if (age <= 65) ageGroups["51-65"]++
      else ageGroups["65+"]++
    })

    // Appointment Trends
    const appointmentsByMonth = {}
    appointments.forEach((apt: any) => {
      const month = new Date(apt.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      appointmentsByMonth[month] = (appointmentsByMonth[month] || 0) + 1
    })

    // Most Prescribed Medications
    const medicationCounts = {}
    prescriptions.forEach((rx: any) => {
      medicationCounts[rx.medication] = (medicationCounts[rx.medication] || 0) + 1
    })

    const topMedications = Object.entries(medicationCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)

    // Consultation Types
    const consultationTypes = {}
    consultations.forEach((consult: any) => {
      consultationTypes[consult.consultationType] = (consultationTypes[consult.consultationType] || 0) + 1
    })

    setAnalytics({
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      totalPrescriptions: prescriptions.length,
      totalConsultations: consultations.length,
      ageGroups,
      appointmentsByMonth,
      topMedications,
      consultationTypes,
    })
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
            <BarChart3 className="h-8 w-8" />
            Analytics & Reports
          </h1>
          <p className="text-gray-600">Healthcare data insights and performance metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPatients || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPrescriptions || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telemedicine</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConsultations || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +25% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="telemedicine">Telemedicine</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Age Distribution</CardTitle>
                <CardDescription>Breakdown of patients by age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.ageGroups &&
                    Object.entries(analytics.ageGroups).map(([ageGroup, count]) => (
                      <div key={ageGroup} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{ageGroup} years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  analytics.totalPatients > 0 ? ((count as number) / analytics.totalPatients) * 100 : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{count as number}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Status Overview</CardTitle>
                <CardDescription>Current status of all patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Patients</span>
                    <Badge className="bg-green-100 text-green-800">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Inactive Patients</span>
                    <Badge className="bg-gray-100 text-gray-800">12%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Critical Patients</span>
                    <Badge className="bg-red-100 text-red-800">3%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Monthly appointment volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.appointmentsByMonth &&
                  Object.entries(analytics.appointmentsByMonth).map(([month, count]) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(((count as number) / 20) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count as number}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Prescribed Medications</CardTitle>
              <CardDescription>Top 5 medications by prescription volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topMedications &&
                  analytics.topMedications.map(([medication, count], index) => (
                    <div key={medication} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="text-sm font-medium">{medication}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${
                                analytics.topMedications.length > 0
                                  ? ((count as number) / (analytics.topMedications[0][1] as number)) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count as number}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telemedicine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Types</CardTitle>
              <CardDescription>Distribution of telemedicine consultation types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.consultationTypes &&
                  Object.entries(analytics.consultationTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${
                                analytics.totalConsultations > 0
                                  ? ((count as number) / analytics.totalConsultations) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count as number}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Reports
          </CardTitle>
          <CardDescription>Download detailed reports for further analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Patient Report
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Analytics Report
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Export Appointment Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
