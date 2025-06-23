"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, MessageSquare, FileText, Clock, User } from "lucide-react"

export default function TelemedicineRoomPage() {
  const [consultation, setConsultation] = useState<any>(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)
  const [consultationNotes, setConsultationNotes] = useState("")
  const [sessionDuration, setSessionDuration] = useState(0)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
    loadConsultation()
    startSessionTimer()
  }, [])

  const loadConsultation = () => {
    const consultations = JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]")
    const currentConsultation = consultations.find((c: any) => c.id === params.id)
    if (currentConsultation) {
      setConsultation(currentConsultation)
      setConsultationNotes(currentConsultation.consultationNotes || "")
    }
  }

  const startSessionTimer = () => {
    const interval = setInterval(() => {
      setSessionDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartCall = () => {
    setIsCallActive(true)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    handleCompleteConsultation()
  }

  const handleCompleteConsultation = () => {
    if (!consultation) return

    const consultations = JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]")
    const updatedConsultations = consultations.map((c: any) =>
      c.id === consultation.id
        ? {
            ...c,
            status: "Completed",
            consultationNotes,
            actualDuration: sessionDuration,
            completedAt: new Date().toISOString(),
          }
        : c,
    )

    localStorage.setItem("telemedicineConsultations", JSON.stringify(updatedConsultations))
    router.push("/dashboard/telemedicine")
  }

  const handleSaveNotes = () => {
    if (!consultation) return

    const consultations = JSON.parse(localStorage.getItem("telemedicineConsultations") || "[]")
    const updatedConsultations = consultations.map((c: any) =>
      c.id === consultation.id ? { ...c, consultationNotes } : c,
    )

    localStorage.setItem("telemedicineConsultations", JSON.stringify(updatedConsultations))
  }

  if (!consultation || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Video className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-semibold">Virtual Consultation</h1>
              <p className="text-sm text-gray-300">
                {consultation.patientName} with Dr. {consultation.doctorName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-600">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(sessionDuration)}
            </Badge>
            <Badge variant="outline">{consultation.consultationType}</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Video */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
                  {isCallActive ? (
                    <div className="text-center">
                      <User className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">
                        {user.role === "Doctor" ? consultation.patientName : `Dr. ${consultation.doctorName}`}
                      </p>
                      <p className="text-sm text-gray-500">Video call in progress...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">Click "Start Call" to begin the consultation</p>
                    </div>
                  )}

                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-4 bg-gray-800 rounded-full px-6 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className={isVideoOn ? "text-white" : "text-red-400"}
                      >
                        {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAudioOn(!isAudioOn)}
                        className={isAudioOn ? "text-white" : "text-red-400"}
                      >
                        {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                      </Button>

                      {!isCallActive ? (
                        <Button onClick={handleStartCall} className="bg-green-600 hover:bg-green-700 rounded-full px-6">
                          <Phone className="h-5 w-5 mr-2" />
                          Start Call
                        </Button>
                      ) : (
                        <Button onClick={handleEndCall} className="bg-red-600 hover:bg-red-700 rounded-full px-6">
                          <PhoneOff className="h-5 w-5 mr-2" />
                          End Call
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Self Video */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center max-w-xs">
                  <div className="text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">You ({user.role})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Patient Info */}
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-medium">{consultation.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Consultation Type</p>
                  <p className="font-medium">{consultation.consultationType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Scheduled Duration</p>
                  <p className="font-medium">{consultation.duration} minutes</p>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Notes */}
            {user.role === "Doctor" && (
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Consultation Notes
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Document the consultation findings and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="Enter consultation notes, diagnosis, treatment plan, etc..."
                    rows={8}
                    className="bg-gray-900 border-gray-600 text-white"
                  />
                  <Button onClick={handleSaveNotes} variant="outline" className="w-full">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Chat */}
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4 h-32 overflow-y-auto">
                  <div className="text-sm text-gray-400">Chat messages will appear here...</div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
