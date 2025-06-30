"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Beaker } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ExaminationResultsPage() {
  const [examinations, setExaminations] = useState<any[]>([])
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [resultForm, setResultForm] = useState({ result_data: "", notes: "" })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [labResults, setLabResults] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = safeLocalStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    const currentUser = JSON.parse(userData)
    setUser(currentUser)
    loadExaminations()
    fetchLabResults()
  }, [router])

  const loadExaminations = async () => {
    try {
      const res = await fetch("/api/examinations")
      if (!res.ok) throw new Error("Failed to fetch examinations")
      const data = await res.json()
      setExaminations(data)
    } catch (error) {
      toast.error("Failed to load examinations")
    }
  }

  const fetchLabResults = async () => {
    try {
      const res = await fetch('/api/lab-results')
      if (!res.ok) return
      const data = await res.json()
      setLabResults(Array.isArray(data) ? data : [])
    } catch {}
  }

  const handleSubmitResults = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedExam) return

    setLoading(true)
    try {
      const res = await fetch("/api/examinations/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examination_id: selectedExam.examination_id,
          technician_id: user.id,
          ...resultForm
        })
      })

      if (res.ok) {
        toast.success("Results recorded successfully!")
        setSelectedExam(null)
        setResultForm({ result_data: "", notes: "" })
        loadExaminations()
      } else {
        toast.error("Failed to record results")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) return <div>Loading...</div>

  const pendingExams = examinations.filter(exam => exam.status === "ordered")
  const completedExams = examinations.filter(exam => exam.status === "completed")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/examinations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Examinations
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Examination Results
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Examinations ({pendingExams.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingExams.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending examinations</p>
              ) : (
                <div className="space-y-4">
                  {pendingExams.map((exam) => (
                    <div key={exam.examination_id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-semibold">{exam.examination_type}</h3>
                          <p className="text-sm text-gray-600">Patient {exam.patient_id}</p>
                        </div>
                        <Badge className={getStatusColor(exam.status)}>
                          {exam.status}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSelectedExam(exam)}
                      >
                        Enter Results
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedExam && (
            <Card>
              <CardHeader>
                <CardTitle>Enter Results</CardTitle>
                <CardDescription>
                  {selectedExam.examination_type} for Patient {selectedExam.patient_id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitResults} className="space-y-4">
                  <div>
                    <Label>Result Data *</Label>
                    <Textarea
                      value={resultForm.result_data}
                      onChange={(e) => setResultForm(prev => ({ ...prev, result_data: e.target.value }))}
                      rows={6}
                      required
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={resultForm.notes}
                      onChange={(e) => setResultForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedExam(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Recording..." : "Record Results"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Completed Examinations ({completedExams.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedExams.map((exam) => (
                  <TableRow key={exam.examination_id}>
                    <TableCell>{exam.examination_type}</TableCell>
                    <TableCell>{exam.patient_id}</TableCell>
                    <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {labResults.filter(lab => lab.patient_id === exam.patient_id && lab.examination_id === exam.examination_id).length > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="bg-gray-50 p-2">
                      <div className="flex items-center gap-2"><Beaker className="h-4 w-4 text-blue-600" /> Lab Results:</div>
                      <ul className="ml-6 mt-1">
                        {labResults.filter(lab => lab.patient_id === exam.patient_id && lab.examination_id === exam.examination_id).map(lab => (
                          <li key={lab.result_id}>{lab.test_name}: <b>{lab.result_value || 'Pending'}</b> ({lab.result_date ? new Date(lab.result_date).toLocaleDateString() : 'N/A'})</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 