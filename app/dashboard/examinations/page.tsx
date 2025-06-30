"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, User, Stethoscope, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ExaminationsPage() {
  const [examinations, setExaminations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    const currentUser = JSON.parse(userData)
    setUser(currentUser)
    loadExaminations()
  }, [router])

  const loadExaminations = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/examinations")
      if (!res.ok) throw new Error("Failed to fetch examinations")
      const data = await res.json()
      const transformedExaminations = data.map((exam: any) => ({
        ...exam,
        patient_name: exam.patient_name || `Patient ${exam.patient_id}`,
        doctor_name: exam.doctor_name || `Doctor ${exam.doctor_id}`,
        date_formatted: exam.examination_date ? new Date(exam.examination_date).toLocaleDateString() : 'N/A',
        type: exam.examination_type || exam.type || 'N/A',
        result: exam.result || exam.findings || 'N/A',
      }))
      setExaminations(transformedExaminations)
    } catch (error) {
      console.error('Error loading examinations:', error)
      setExaminations([])
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div>Loading...</div>

  const filteredExaminations = examinations.filter(
    (exam) =>
      exam.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.type && exam.type.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
              Examinations
            </h1>
          </div>
          <p className="text-gray-600">View and manage patient examinations</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Examination Records</CardTitle>
                <CardDescription>View and manage patient examinations</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search examinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Examination
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading examinations...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExaminations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <p className="text-gray-500">No examinations found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExaminations.map((exam) => (
                      <TableRow key={exam.examination_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{exam.patient_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{exam.doctor_name}</TableCell>
                        <TableCell>{exam.date_formatted}</TableCell>
                        <TableCell>{exam.type}</TableCell>
                        <TableCell>{exam.result}</TableCell>
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