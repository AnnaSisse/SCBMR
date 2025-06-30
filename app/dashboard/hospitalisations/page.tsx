"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Calendar, User, Stethoscope, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HospitalisationsPage() {
  const [hospitalisations, setHospitalisations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = safeLocalStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(userData)
    setUser(currentUser)
    loadHospitalisations()
  }, [router])

  const loadHospitalisations = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/hospitalisations")
      if (!res.ok) throw new Error("Failed to fetch hospitalisations")
      const data = await res.json()
      
      const transformedHospitalisations = data.map((hosp: any) => ({
        ...hosp,
        patient_name: `Patient ${hosp.patient_id}`,
        status: hosp.discharge_date ? "Discharged" : "Active",
        admission_date_formatted: new Date(hosp.admission_date).toLocaleDateString(),
        discharge_date_formatted: hosp.discharge_date ? new Date(hosp.discharge_date).toLocaleDateString() : "N/A"
      }))
      
      setHospitalisations(transformedHospitalisations)
    } catch (error) {
      console.error('Error loading hospitalisations:', error)
      setHospitalisations([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              Hospitalisations
            </h1>
          </div>
          <p className="text-gray-600">View and manage patient hospitalisations</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hospitalisation Records</CardTitle>
                <CardDescription>View and manage patient hospitalisations</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search hospitalisations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Hospitalisation
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading hospitalisations...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Discharge Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitalisations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <p className="text-gray-500">No hospitalisations found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    hospitalisations.map((hospitalisation) => (
                      <TableRow key={hospitalisation.hospitalisation_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{hospitalisation.patient_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{hospitalisation.admission_date_formatted}</TableCell>
                        <TableCell>{hospitalisation.discharge_date_formatted}</TableCell>
                        <TableCell>{hospitalisation.diagnosis || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(hospitalisation.status)}>
                            {hospitalisation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 