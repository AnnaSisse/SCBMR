"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Lock, AlertTriangle, Clock, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SecurityPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    if (user.role !== "Admin") {
      router.push("/dashboard")
      return
    }

    const logsData = JSON.parse(localStorage.getItem("securityLogs") || "[]")
    setLogs(logsData)
  }, [router])

  const clearLogs = () => {
    if (confirm("Are you sure you want to clear all security logs? This action cannot be undone.")) {
      localStorage.setItem("securityLogs", "[]")
      setLogs([])
    }
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
              <Shield className="h-8 w-8 text-blue-600" />
              Security Logs
            </h1>
            <p className="text-gray-600">Monitor system security and access logs</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={clearLogs} variant="destructive">
              Clear Logs
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="login">Login Attempts</TabsTrigger>
            <TabsTrigger value="access">Access Changes</TabsTrigger>
            <TabsTrigger value="data">Data Changes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  All Security Logs
                </CardTitle>
                <CardDescription>View all system security logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {log.type === "login" ? (
                            <Lock className="h-5 w-5 text-blue-600" />
                          ) : log.type === "access" ? (
                            <Shield className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                          <h3 className="font-medium">{log.action}</h3>
                        </div>
                        <Badge
                          variant={
                            log.severity === "high"
                              ? "destructive"
                              : log.severity === "medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {log.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>User: {log.user}</p>
                        <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
                        <p>IP Address: {log.ipAddress}</p>
                        <p>Details: {log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="login" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Login Attempts
                </CardTitle>
                <CardDescription>Monitor user login activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs
                    .filter((log) => log.type === "login")
                    .map((log) => (
                      <div key={log.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium">{log.action}</h3>
                          </div>
                          <Badge
                            variant={
                              log.severity === "high"
                                ? "destructive"
                                : log.severity === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {log.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>User: {log.user}</p>
                          <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
                          <p>IP Address: {log.ipAddress}</p>
                          <p>Details: {log.details}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Access Changes
                </CardTitle>
                <CardDescription>Track permission and role modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs
                    .filter((log) => log.type === "access")
                    .map((log) => (
                      <div key={log.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            <h3 className="font-medium">{log.action}</h3>
                          </div>
                          <Badge
                            variant={
                              log.severity === "high"
                                ? "destructive"
                                : log.severity === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {log.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>User: {log.user}</p>
                          <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
                          <p>IP Address: {log.ipAddress}</p>
                          <p>Details: {log.details}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Data Changes
                </CardTitle>
                <CardDescription>Monitor sensitive data modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs
                    .filter((log) => log.type === "data")
                    .map((log) => (
                      <div key={log.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h3 className="font-medium">{log.action}</h3>
                          </div>
                          <Badge
                            variant={
                              log.severity === "high"
                                ? "destructive"
                                : log.severity === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {log.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>User: {log.user}</p>
                          <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
                          <p>IP Address: {log.ipAddress}</p>
                          <p>Details: {log.details}</p>
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