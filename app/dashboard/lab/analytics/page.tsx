"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Clock, TestTube, TrendingUp, AlertTriangle, Settings, FlaskConical } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function LabAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    // Fetch data from localStorage and compute analytics
    const labOrders = JSON.parse(localStorage.getItem("labOrders") || "[]")
    const labResults = JSON.parse(localStorage.getItem("labResults") || "[]")
    generateAnalytics(labOrders, labResults)
  }, [])

  const generateAnalytics = (orders: any[], results: any[]) => {
    // 1. Average Turnaround Time
    const completedOrders = orders.filter((o) => o.status === "completed" && o.orderedAt && o.completedAt)
    let totalTurnaround = 0
    if (completedOrders.length > 0) {
      totalTurnaround = completedOrders.reduce((acc, order) => {
        const start = new Date(order.orderedAt).getTime()
        const end = new Date(order.completedAt).getTime()
        return acc + (end - start)
      }, 0)
    }
    const averageTurnaroundHours =
      completedOrders.length > 0 ? totalTurnaround / completedOrders.length / (1000 * 60 * 60) : 0

    // 2. Test Volume
    const testVolume = orders.reduce((acc, order) => {
      acc[order.testType] = (acc[order.testType] || 0) + 1
      return acc
    }, {})
    const testVolumeData = Object.keys(testVolume).map((key) => ({ name: key, count: testVolume[key] }))

    // 3. Critical Results
    const criticalResultsCount = results.filter((r) => r.flagged).length
    const criticalResultsPercentage = results.length > 0 ? (criticalResultsCount / results.length) * 100 : 0

    // 4. Equipment Efficiency (mock data)
    const equipmentData = [
      { name: "Hematology Analyzer", uptime: 98, downtime: 2 },
      { name: "Chemistry Analyzer", uptime: 95, downtime: 5 },
      { name: "Microscope", uptime: 100, downtime: 0 },
    ]

    setAnalyticsData({
      averageTurnaroundHours: averageTurnaroundHours.toFixed(2),
      testVolumeData,
      totalTests: orders.length,
      criticalResultsPercentage: criticalResultsPercentage.toFixed(2),
      criticalResultsCount,
      totalResults: results.length,
      equipmentData,
    })
  }

  if (!analyticsData) {
    return <div>Loading analytics...</div>
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Laboratory Analytics
            </h1>
            <p className="text-gray-600">Insights into laboratory performance and efficiency.</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Turnaround Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.averageTurnaroundHours} hours</div>
              <p className="text-xs text-muted-foreground">from order to result</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests Performed</CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalTests}</div>
              <p className="text-xs text-muted-foreground">across all categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Results</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.criticalResultsPercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.criticalResultsCount} of {analyticsData.totalResults} results flagged
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment Uptime</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">97.6%</div>
              <p className="text-xs text-muted-foreground">average uptime across all analyzers</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test Volume by Type
              </CardTitle>
              <CardDescription>Number of tests performed for each category.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.testVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Equipment Performance
              </CardTitle>
              <CardDescription>Uptime vs. Downtime percentage for key equipment.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={analyticsData.equipmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="uptime"
                    nameKey="name"
                  >
                    {analyticsData.equipmentData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 