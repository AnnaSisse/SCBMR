"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Video, Plus, ArrowLeft, Clock, User, Phone } from "lucide-react"
import Link from "next/link"

export default function TelemedicinePage() {
  const [consultations, setConsultations] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
    loadConsultations()
  }, [router])

  const loadConsultations = () => {
    const storedConsultations = JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]")
    setConsultations(storedConsultations)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleJoinConsultation = (consultationId: string) => {
    // Update consultation status to "In Progress"
    const updatedConsultations = consultations.map((consultation) =>
      consultation.id === consultationId ? { ...consultation, status: "In Progress" } : consultation,
    )
    setConsultations(updatedConsultations)
    localStorage.setItem("telemedicineConsultations", JSON.stringify(updatedConsultations))

    // Navigate to consultation room
    router.push(`/dashboard/telemedicine/room/${consultationId}`)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Video className="h-8 w-8" />
              Telemedicine
            </h1>
            <p className="text-gray-600">Virtual consultations and remote patient care</p>
          </div>
        </div>

        {(user.role === "Doctor" || user.role === "Admin") && (
          <Link href="/dashboard/telemedicine/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                consultations.filter((c) => new Date(c.scheduledDate).toDateString() === new Date().toDateString())
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.filter((c) => c.status === "In Progress").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                consultations.filter(
                  (c) =>
                    c.status === "Completed" && new Date(c.scheduledDate).toDateString() === new Date().toDateString(),
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Consultations ({consultations.length})</CardTitle>
          <CardDescription>
            {consultations.length === 0
              ? "No consultations scheduled"
              : `Showing ${consultations.length} consultations`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {consultations.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations scheduled</h3>
              <p className="text-gray-600 mb-4">Schedule your first virtual consultation</p>
              {(user.role === "Doctor" || user.role === "Admin") && (
                <Link href="/dashboard/telemedicine/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule First Consultation
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{new Date(consultation.scheduledDate).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{consultation.scheduledTime}</div>
                        </div>
                      </TableCell>
                      <TableCell>{consultation.patientName}</TableCell>
                      <TableCell>Dr. {consultation.doctorName}</TableCell>
                      <TableCell>{consultation.consultationType}</TableCell>
                      <TableCell>{consultation.duration} min</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(consultation.status)}>{consultation.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {consultation.status === "Scheduled" && (
                            <Button variant="outline" size="sm" onClick={() => handleJoinConsultation(consultation.id)}>
                              <Video className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                          )}
                          {consultation.status === "In Progress" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => router.push(`/dashboard/telemedicine/room/${consultation.id}`)}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Continue
                            </Button>
                          )}
                          {consultation.status === "Completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/telemedicine/notes/${consultation.id}`)}
                            >
                              View Notes
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
