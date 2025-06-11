"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Activity, CheckCircle, Plus, Save, User, AlertTriangle } from "lucide-react"

export default function FunctionalCarePlansPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [carePlans, setCarePlans] = useState<any[]>([])
  const [activeCarePlan, setActiveCarePlan] = useState<any>(null)
  const [vitals, setVitals] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",
    painLevel: "",
  })

  useEffect(() => {
    const patientsData = JSON.parse(localStorage.getItem("patients") || "[]")
    const carePlansData = JSON.parse(localStorage.getItem("carePlans") || "[]")
    setPatients(patientsData)
    setCarePlans(carePlansData)
  }, [])

  const createCarePlan = (templateId: string) => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    const templates = {
      diabetes: {
        name: "Diabetes Management",
        interventions: [
          { id: 1, task: "Monitor blood glucose levels every 4 hours", completed: false, priority: "high" },
          { id: 2, task: "Administer insulin as prescribed", completed: false, priority: "high" },
          { id: 3, task: "Provide diabetic diet education", completed: false, priority: "medium" },
          { id: 4, task: "Monitor for signs of hypoglycemia", completed: false, priority: "high" },
          { id: 5, task: "Encourage regular exercise", completed: false, priority: "low" },
          { id: 6, task: "Check feet for wounds daily", completed: false, priority: "medium" },
        ],
      },
      hypertension: {
        name: "Hypertension Management",
        interventions: [
          { id: 1, task: "Monitor blood pressure every 2 hours", completed: false, priority: "high" },
          { id: 2, task: "Administer antihypertensive medications", completed: false, priority: "high" },
          { id: 3, task: "Provide low-sodium diet education", completed: false, priority: "medium" },
          { id: 4, task: "Monitor for headaches and dizziness", completed: false, priority: "medium" },
          { id: 5, task: "Encourage stress reduction techniques", completed: false, priority: "low" },
        ],
      },
      postop: {
        name: "Post-Operative Care",
        interventions: [
          { id: 1, task: "Monitor surgical site for infection", completed: false, priority: "high" },
          { id: 2, task: "Assess pain levels every 2 hours", completed: false, priority: "high" },
          { id: 3, task: "Encourage deep breathing exercises", completed: false, priority: "medium" },
          { id: 4, task: "Monitor vital signs every 2 hours", completed: false, priority: "high" },
          { id: 5, task: "Assist with mobility as tolerated", completed: false, priority: "medium" },
          { id: 6, task: "Monitor intake and output", completed: false, priority: "medium" },
        ],
      },
    }

    const template = templates[templateId as keyof typeof templates]
    if (!template) return

    const newCarePlan = {
      id: `CP${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      planName: template.name,
      interventions: template.interventions,
      createdBy: "Nurse Mary Wilson",
      createdAt: new Date().toISOString(),
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }

    const updatedCarePlans = [...carePlans, newCarePlan]
    setCarePlans(updatedCarePlans)
    localStorage.setItem("carePlans", JSON.stringify(updatedCarePlans))
    setActiveCarePlan(newCarePlan)

    alert(`Care plan "${template.name}" created successfully for ${selectedPatient.name}!`)
  }

  const updateInterventionStatus = (carePlanId: string, interventionId: number, completed: boolean) => {
    const updatedCarePlans = carePlans.map((plan) => {
      if (plan.id === carePlanId) {
        const updatedInterventions = plan.interventions.map((intervention: any) => {
          if (intervention.id === interventionId) {
            return {
              ...intervention,
              completed,
              completedAt: completed ? new Date().toISOString() : null,
              completedBy: completed ? "Nurse Mary Wilson" : null,
            }
          }
          return intervention
        })
        return { ...plan, interventions: updatedInterventions }
      }
      return plan
    })

    setCarePlans(updatedCarePlans)
    localStorage.setItem("carePlans", JSON.stringify(updatedCarePlans))

    if (activeCarePlan?.id === carePlanId) {
      const updatedActivePlan = updatedCarePlans.find((plan) => plan.id === carePlanId)
      setActiveCarePlan(updatedActivePlan)
    }
  }

  const recordVitals = () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    const vitalRecord = {
      id: `vital${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      ...vitals,
      recordedBy: "Nurse Mary Wilson",
      recordedAt: new Date().toISOString(),
      alerts: generateVitalAlerts(vitals),
    }

    const existingVitals = JSON.parse(localStorage.getItem("patientVitals") || "[]")
    localStorage.setItem("patientVitals", JSON.stringify([...existingVitals, vitalRecord]))

    // Reset form
    setVitals({
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "",
      height: "",
      painLevel: "",
    })

    alert("Vital signs recorded successfully!")
  }

  const generateVitalAlerts = (vitals: any) => {
    const alerts = []

    if (
      vitals.temperature &&
      (Number.parseFloat(vitals.temperature) > 101.3 || Number.parseFloat(vitals.temperature) < 95)
    ) {
      alerts.push("Temperature abnormal - notify physician")
    }

    if (vitals.heartRate && (Number.parseInt(vitals.heartRate) > 100 || Number.parseInt(vitals.heartRate) < 60)) {
      alerts.push("Heart rate abnormal - monitor closely")
    }

    if (vitals.oxygenSaturation && Number.parseInt(vitals.oxygenSaturation) < 95) {
      alerts.push("Low oxygen saturation - immediate attention required")
    }

    if (vitals.painLevel && Number.parseInt(vitals.painLevel) > 7) {
      alerts.push("High pain level - assess pain management")
    }

    return alerts
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const patientCarePlans = carePlans.filter((plan) => (selectedPatient ? plan.patientId === selectedPatient.id : false))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-600" />
            Functional Care Management
          </h1>
          <p className="text-gray-600">Complete patient care planning and vital signs monitoring</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-500">Room: {patient.room || "N/A"}</p>
                    <p className="text-sm text-gray-500">Age: {patient.age}</p>
                    {patientCarePlans.length > 0 && (
                      <Badge variant="outline" className="mt-1">
                        {patientCarePlans.length} active plan(s)
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Record Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Temp (°F)</Label>
                  <Input
                    placeholder="98.6"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">BP (mmHg)</Label>
                  <Input
                    placeholder="120/80"
                    value={vitals.bloodPressure}
                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">HR (bpm)</Label>
                  <Input
                    placeholder="72"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">RR (/min)</Label>
                  <Input
                    placeholder="16"
                    value={vitals.respiratoryRate}
                    onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">O2 Sat (%)</Label>
                  <Input
                    placeholder="98"
                    value={vitals.oxygenSaturation}
                    onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Pain (0-10)</Label>
                  <Select
                    value={vitals.painLevel}
                    onValueChange={(value) => setVitals({ ...vitals, painLevel: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={recordVitals} className="w-full" size="sm" disabled={!selectedPatient}>
                <Save className="h-3 w-3 mr-1" />
                Record Vitals
              </Button>
            </CardContent>
          </Card>

          {/* Care Plan Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Care Plan Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "diabetes", name: "Diabetes Management", color: "bg-blue-50 border-blue-200" },
                { id: "hypertension", name: "Hypertension Management", color: "bg-red-50 border-red-200" },
                { id: "postop", name: "Post-Operative Care", color: "bg-green-50 border-green-200" },
              ].map((template) => (
                <div key={template.id} className={`p-3 rounded-lg border ${template.color}`}>
                  <h4 className="font-medium text-sm mb-2">{template.name}</h4>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => createCarePlan(template.id)}
                    disabled={!selectedPatient}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create Plan
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Care Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Active Care Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPatient ? (
                patientCarePlans.length > 0 ? (
                  <div className="space-y-3">
                    {patientCarePlans.map((plan) => (
                      <div key={plan.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{plan.planName}</h4>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Created: {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                        <div className="space-y-2">
                          {plan.interventions.map((intervention: any) => (
                            <div key={intervention.id} className="flex items-start gap-2">
                              <Checkbox
                                id={`${plan.id}-${intervention.id}`}
                                checked={intervention.completed}
                                onCheckedChange={(checked) =>
                                  updateInterventionStatus(plan.id, intervention.id, checked as boolean)
                                }
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`${plan.id}-${intervention.id}`}
                                  className={`text-xs cursor-pointer ${
                                    intervention.completed ? "line-through text-gray-500" : ""
                                  }`}
                                >
                                  {intervention.task}
                                </Label>
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge className={getPriorityColor(intervention.priority)} variant="outline">
                                    {intervention.priority}
                                  </Badge>
                                  {intervention.completed && (
                                    <span className="text-xs text-green-600">✓ Completed</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              Progress: {plan.interventions.filter((i: any) => i.completed).length}/
                              {plan.interventions.length}
                            </span>
                            <span>
                              {Math.round(
                                (plan.interventions.filter((i: any) => i.completed).length /
                                  plan.interventions.length) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No active care plans</p>
                    <p className="text-xs text-gray-500">Create a plan using templates</p>
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Select a patient</p>
                  <p className="text-xs text-gray-500">Choose a patient to view care plans</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Vital Signs */}
        {selectedPatient && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Vital Signs - {selectedPatient.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {JSON.parse(localStorage.getItem("patientVitals") || "[]")
                  .filter((vital: any) => vital.patientId === selectedPatient.id)
                  .slice(-5)
                  .reverse()
                  .map((vital: any) => (
                    <div key={vital.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Temp:</span> {vital.temperature}°F
                          </div>
                          <div>
                            <span className="text-gray-500">BP:</span> {vital.bloodPressure}
                          </div>
                          <div>
                            <span className="text-gray-500">HR:</span> {vital.heartRate} bpm
                          </div>
                          <div>
                            <span className="text-gray-500">O2:</span> {vital.oxygenSaturation}%
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(vital.recordedAt).toLocaleString()}</div>
                      </div>
                      {vital.alerts && vital.alerts.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {vital.alerts.map((alert: string, index: number) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {alert}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
