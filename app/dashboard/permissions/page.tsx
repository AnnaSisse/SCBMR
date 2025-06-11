"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, User, Lock, Clock, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PermissionsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
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

    const usersData = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(usersData)
  }, [router])

  const updateUserRole = (userId: string, newRole: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRole,
          roleUpdatedAt: new Date().toISOString(),
          roleUpdatedBy: currentUser.name,
        }
      }
      return user
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
  }

  const updateUserStatus = (userId: string, newStatus: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          status: newStatus,
          statusUpdatedAt: new Date().toISOString(),
          statusUpdatedBy: currentUser.name,
        }
      }
      return user
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
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
              User Permissions
            </h1>
            <p className="text-gray-600">Manage user roles and access</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Users</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Users</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Active Users
                </CardTitle>
                <CardDescription>Manage active user permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((user) => user.status === "active")
                    .map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium">{user.name}</h3>
                          </div>
                          <Badge variant="default">{user.role}</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>Email: {user.email}</p>
                          <p>Last Login: {new Date(user.lastLogin).toLocaleString()}</p>
                          {user.roleUpdatedAt && (
                            <>
                              <p>Role Updated by: {user.roleUpdatedBy}</p>
                              <p>Role Updated at: {new Date(user.roleUpdatedAt).toLocaleString()}</p>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <select
                            className="px-3 py-2 border rounded-md"
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                          >
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Civil Authority">Civil Authority</option>
                            <option value="Data Manager">Data Manager</option>
                          </select>
                          <Button onClick={() => updateUserStatus(user.id, "inactive")} variant="destructive">
                            Deactivate User
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Inactive Users
                </CardTitle>
                <CardDescription>Manage inactive user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((user) => user.status === "inactive")
                    .map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-600" />
                            <h3 className="font-medium">{user.name}</h3>
                          </div>
                          <Badge variant="secondary">Inactive</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>Email: {user.email}</p>
                          <p>Last Login: {new Date(user.lastLogin).toLocaleString()}</p>
                          <p>Deactivated by: {user.statusUpdatedBy}</p>
                          <p>Deactivated at: {new Date(user.statusUpdatedAt).toLocaleString()}</p>
                        </div>
                        <Button onClick={() => updateUserStatus(user.id, "active")} variant="outline">
                          Reactivate User
                        </Button>
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