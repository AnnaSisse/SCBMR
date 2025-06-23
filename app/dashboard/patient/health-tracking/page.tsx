"use client"

import { useState, useEffect } from "react"
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
  Clock,
  TrendingUp,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function HealthTrackingPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [healthData, setHealthData] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Patient") {
      router.push("/dashboard")
      return
    }

    // Load health data from localStorage
    const storedHealthData = JSON.parse(localStorage.getItem("healthData") || "[]")
    const userHealthData = storedHealthData.filter((data: any) => data.patientId === user.id)
    setHealthData(userHealthData)

    // Start real-time monitoring
    startHealthMonitoring()

    return () => {
      // Cleanup intervals when component unmounts
    }
  }, [router])

  const startHealthMonitoring = () => {
    // Simulate real-time health data updates
    const updateHealthData = () => {
      const newData = {
        id: `health_${Date.now()}`,
        patientId: currentUser?.id,
        timestamp: new Date().toISOString(),
        vitals: {
          heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
          bloodPressure: {
            systolic: Math.floor(Math.random() * 40) + 110, // 110-150
            diastolic: Math.floor(Math.random() * 20) + 70, // 70-90
          },
          temperature: (Math.random() * 2 + 36.5).toFixed(1), // 36.5-38.5°C
          oxygenSaturation: Math.floor(Math.random() * 5) + 95, // 95-100%
        },
        status: Math.random() > 0.8 ? "Critical" : Math.random() > 0.6 ? "Warning" : "Normal",
      }

      setHealthData((prevData) => [newData, ...prevData].slice(0, 10)) // Keep last 10 readings
    }

    // Initial load
    updateHealthData()

    // Set up interval for real-time updates
    const healthInterval = setInterval(updateHealthData, 5000) // Every 5 seconds

    // Cleanup function
    return () => {
      clearInterval(healthInterval)
    }
  }

  const getVitalStatus = (status: string) => {
    if (status === "Critical") return "text-red-600 bg-red-50 border-red-200"
    if (status === "Warning") return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-green-600 bg-green-50 border-green-200"
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              Health Tracking
            </h1>
            <p className="text-gray-600">Monitor your vital signs and health metrics</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Current Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {healthData[0]?.vitals.heartRate || "--"} bpm
              </div>
              <p className="text-xs text-blue-600">Last updated: {new Date(healthData[0]?.timestamp).toLocaleTimeString()}</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Blood Pressure</CardTitle>
              <Droplets className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {healthData[0]?.vitals.bloodPressure ? 
                  `${healthData[0].vitals.bloodPressure.systolic}/${healthData[0].vitals.bloodPressure.diastolic}` : 
                  "--/--"}
              </div>
              <p className="text-xs text-red-600">mmHg</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">
                {healthData[0]?.vitals.temperature || "--"}°C
              </div>
              <p className="text-xs text-orange-600">Body temperature</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Oxygen Saturation</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {healthData[0]?.vitals.oxygenSaturation || "--"}%
              </div>
              <p className="text-xs text-green-600">SpO2 level</p>
            </CardContent>
          </Card>
        </div>

        {/* Health History */}
        <Card>
          <CardHeader>
            <CardTitle>Health History</CardTitle>
            <CardDescription>Recent vital sign measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData.map((data) => (
                <Card key={data.id} className={getVitalStatus(data.status)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(data.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <Badge variant={data.status === "Normal" ? "success" : data.status === "Warning" ? "warning" : "destructive"}>
                        {data.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Heart Rate</p>
                        <p className="text-lg">{data.vitals.heartRate} bpm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Blood Pressure</p>
                        <p className="text-lg">
                          {data.vitals.bloodPressure.systolic}/{data.vitals.bloodPressure.diastolic}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Temperature</p>
                        <p className="text-lg">{data.vitals.temperature}°C</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Oxygen Saturation</p>
                        <p className="text-lg">{data.vitals.oxygenSaturation}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 