"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Search,
  ArrowLeft,
  Baby,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Calendar,
  BarChart,
  PieChart,
  LineChart,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function ReportsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [birthCertificates, setBirthCertificates] = useState<any[]>([])
  const [deathCertificates, setDeathCertificates] = useState<any[]>([])
  const [dateRange, setDateRange] = useState("all")
  const [reportType, setReportType] = useState("summary")
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

  const getFilteredCertificates = () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    return {
      birth: birthCertificates.filter((cert) => {
        const certDate = new Date(cert.createdAt)
        switch (dateRange) {
          case "30days":
            return certDate >= thirtyDaysAgo
          case "90days":
            return certDate >= ninetyDaysAgo
          default:
            return true
        }
      }),
      death: deathCertificates.filter((cert) => {
        const certDate = new Date(cert.createdAt)
        switch (dateRange) {
          case "30days":
            return certDate >= thirtyDaysAgo
          case "90days":
            return certDate >= ninetyDaysAgo
          default:
            return true
        }
      }),
    }
  }

  const getStatistics = () => {
    const { birth, death } = getFilteredCertificates()
    const total = birth.length + death.length

    return {
      total,
      birth: {
        total: birth.length,
        approved: birth.filter((cert) => cert.status === "Approved").length,
        rejected: birth.filter((cert) => cert.status === "Rejected").length,
        pending: birth.filter((cert) => cert.status === "Pending Review").length,
      },
      death: {
        total: death.length,
        approved: death.filter((cert) => cert.status === "Approved").length,
        rejected: death.filter((cert) => cert.status === "Rejected").length,
        pending: death.filter((cert) => cert.status === "Pending Review").length,
      },
    }
  }

  const generateReport = () => {
    const stats = getStatistics()
    const report = {
      title: "Certificate Report",
      dateRange: dateRange === "all" ? "All Time" : dateRange === "30days" ? "Last 30 Days" : "Last 90 Days",
      generatedAt: new Date().toLocaleString(),
      statistics: stats,
    }

    // In a real application, this would generate a PDF or Excel file
    console.log("Generated Report:", report)
    toast.success("Report generated successfully")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  const stats = getStatistics()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart className="h-8 w-8 text-blue-600" />
              Reports
            </h1>
            <p className="text-gray-600">View and generate certificate reports</p>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Birth Certificates</CardTitle>
              <Baby className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.birth.total}</div>
              <div className="text-sm text-gray-500">
                {stats.birth.approved} approved, {stats.birth.pending} pending
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Death Certificates</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.death.total}</div>
              <div className="text-sm text-gray-500">
                {stats.death.approved} approved, {stats.death.pending} pending
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  ((stats.birth.approved + stats.death.approved) /
                    (stats.birth.total + stats.death.total)) *
                    100
                )}
                %
              </div>
              <div className="text-sm text-gray-500">
                {stats.birth.approved + stats.death.approved} approved certificates
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Select options to generate a report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="statistics">Statistics Report</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={generateReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      Certificate Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Birth Certificates</span>
                        <span className="text-sm text-gray-500">{stats.birth.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Death Certificates</span>
                        <span className="text-sm text-gray-500">{stats.death.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-green-600" />
                      Status Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Approved</span>
                        <span className="text-sm text-gray-500">
                          {stats.birth.approved + stats.death.approved}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pending</span>
                        <span className="text-sm text-gray-500">
                          {stats.birth.pending + stats.death.pending}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Rejected</span>
                        <span className="text-sm text-gray-500">
                          {stats.birth.rejected + stats.death.rejected}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 