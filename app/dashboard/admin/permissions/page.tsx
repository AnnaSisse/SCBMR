"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Settings, Edit, Save, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PermissionsPage() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [permissions, setPermissions] = useState<any>({})

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(userData)
  }, [])

  const permissionCategories = {
    patients: {
      name: "Patient Management",
      permissions: ["view", "create", "edit", "delete", "export"],
    },
    appointments: {
      name: "Appointments",
      permissions: ["view", "create", "edit", "delete", "reschedule"],
    },
    prescriptions: {
      name: "Prescriptions",
      permissions: ["view", "create", "edit", "delete", "approve"],
    },
    labResults: {
      name: "Lab Results",
      permissions: ["view", "create", "edit", "delete", "flag"],
    },
    certificates: {
      name: "Certificates",
      permissions: ["view", "create", "edit", "delete", "approve"],
    },
    billing: {
      name: "Billing",
      permissions: ["view", "create", "edit", "delete", "process"],
    },
    reports: {
      name: "Reports",
      permissions: ["view", "create", "export", "schedule"],
    },
    system: {
      name: "System Administration",
      permissions: ["view", "configure", "backup", "audit", "monitor"],
    },
  }

  const handlePermissionChange = (category: string, permission: string, checked: boolean) => {
    setPermissions((prev: any) => ({
      ...prev,
      [selectedUser?.id]: {
        ...prev[selectedUser?.id],
        [category]: {
          ...prev[selectedUser?.id]?.[category],
          [permission]: checked,
        },
      },
    }))
  }

  const savePermissions = () => {
    localStorage.setItem("userPermissions", JSON.stringify(permissions))
    alert("Permissions saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              User Management
            </h1>
            <p className="text-gray-600">Manage all system users and their permissions</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Details and Permissions */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    User Details & Permissions
                  </CardTitle>
                  <CardDescription>Manage permissions for {selectedUser.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="text-sm text-gray-600">{selectedUser.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    </div>
                    <div>
                      <Label>Role</Label>
                      <p className="text-sm text-gray-600">{selectedUser.role}</p>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <p className="text-sm text-gray-600">{selectedUser.department || "N/A"}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={savePermissions} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a user to manage their details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
