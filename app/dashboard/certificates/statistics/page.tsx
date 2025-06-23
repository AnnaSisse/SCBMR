"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  ArrowLeft,
  Baby,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CertificatesStatisticsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [birthCertificates, setBirthCertificates] = useState<any[]>([])
  const [deathCertificates, setDeathCertificates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Civil Authority") {
      router.push("/dashboard")
      return
    }

    loadCertificates()
  }, [router])

  const loadCertificates = () => {
    try {
      const birthCerts = JSON.parse(localStorage.getItem("birthCertificates") || "[]")
      const deathCerts = JSON.parse(localStorage.getItem("deathCertificates") || "[]")
      setBirthCertificates(birthCerts)
      setDeathCertificates(deathCerts)
    } catch (error) {
      console.error("Error loading certificates:", error)
      toast.error("Failed to load certificates")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate statistics
  const allCertificates = [...birthCertificates, ...deathCertificates]
  
  const stats = {
    total: allCertificates.length,
    birth: birthCertificates.length,
    death: deathCertificates.length,
    pending: allCertificates.filter(cert => cert.status === "Pending Review").length,
    approved: allCertificates.filter(cert => cert.status === "Approved").length,
    rejected: allCertificates.filter(cert => cert.status === "Rejected").length,
  }

  // Monthly statistics
  const getMonthlyStats = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyData = months.map((month, index) => {
      const monthCertificates = allCertificates.filter(cert => {
        const certDate = new Date(cert.createdAt)
        return certDate.getMonth() === index
      })
      
      return {
        month,
        birth: monthCertificates.filter(cert => cert.type === "birth").length,
        death: monthCertificates.filter(cert => cert.type === "death").length,
        total: monthCertificates.length
      }
    })
    
    return monthlyData
  }

  // Status distribution
  const statusDistribution = [
    { status: "Pending Review", count: stats.pending, color: "bg-yellow-500" },
    { status: "Approved", count: stats.approved, color: "bg-green-500" },
    { status: "Rejected", count: stats.rejected, color: "bg-red-500" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Certificate Statistics
            </h1>
            <p className="text-gray-600">Analytics and insights for certificates</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={loadCertificates}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/dashboard/certificates">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Certificates
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Birth Certificates</CardTitle>
              <Baby className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.birth}</div>
              <p className="text-xs text-gray-500">
                {stats.total > 0 ? `${((stats.birth / stats.total) * 100).toFixed(1)}%` : "0%"} of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Death Certificates</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.death}</div>
              <p className="text-xs text-gray-500">
                {stats.total > 0 ? `${((stats.death / stats.total) * 100).toFixed(1)}%` : "0%"} of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total > 0 ? `${((stats.approved / stats.total) * 100).toFixed(1)}%` : "0%"}
              </div>
              <p className="text-xs text-gray-500">Approved certificates</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
            <TabsTrigger value="status">Status Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Overview</CardTitle>
                  <CardDescription>Distribution of certificate statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusDistribution.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium">{item.status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.count}</span>
                          <span className="text-xs text-gray-500">
                            ({stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(1) : "0"}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certificate Types</CardTitle>
                  <CardDescription>Birth vs Death certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Baby className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Birth Certificates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{stats.birth}</span>
                        <span className="text-xs text-gray-500">
                          ({stats.total > 0 ? ((stats.birth / stats.total) * 100).toFixed(1) : "0"}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Death Certificates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{stats.death}</span>
                        <span className="text-xs text-gray-500">
                          ({stats.total > 0 ? ((stats.death / stats.total) * 100).toFixed(1) : "0"}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Certificate submissions by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getMonthlyStats().map((monthData) => (
                    <div key={monthData.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="font-medium w-12">{monthData.month}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Baby className="h-3 w-3 text-green-500" />
                            <span className="text-sm">{monthData.birth}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span className="text-sm">{monthData.death}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{monthData.total}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Details</CardTitle>
                <CardDescription>Detailed breakdown of certificate statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {statusDistribution.map((item) => (
                    <div key={item.status} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.status}</span>
                        </div>
                        <Badge variant="outline">{item.count} certificates</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color.replace('bg-', 'bg-')}`}
                          style={{
                            width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 