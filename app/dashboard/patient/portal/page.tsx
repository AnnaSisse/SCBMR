"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  FileText,
  Calendar,
  BookOpen,
  Shield,
  Star,
  Send,
  Download,
  Eye,
  Clock,
  CheckCircle,
  Pill,
  Activity,
} from "lucide-react"
import Link from "next/link"

export default function PatientPortalPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [feedback, setFeedback] = useState({ rating: 0, comment: "" })

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }

    // Load patient messages
    const messagesData = JSON.parse(localStorage.getItem("patientMessages") || "[]")
    setMessages(messagesData)
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: `msg${Date.now()}`,
      patientId: currentUser?.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "outgoing",
      status: "sent",
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)
    localStorage.setItem("patientMessages", JSON.stringify(updatedMessages))
    setNewMessage("")

    // Simulate doctor response after 2 seconds
    setTimeout(() => {
      const response = {
        id: `msg${Date.now() + 1}`,
        patientId: currentUser?.id,
        content: "Thank you for your message. I'll review your question and get back to you within 24 hours.",
        timestamp: new Date().toISOString(),
        type: "incoming",
        from: "Dr. Sarah Johnson",
        status: "received",
      }

      const newMessages = [...updatedMessages, response]
      setMessages(newMessages)
      localStorage.setItem("patientMessages", JSON.stringify(newMessages))
    }, 2000)
  }

  const submitFeedback = () => {
    if (feedback.rating === 0) {
      alert("Please provide a rating")
      return
    }

    const feedbackData = {
      id: `fb${Date.now()}`,
      patientId: currentUser?.id,
      rating: feedback.rating,
      comment: feedback.comment,
      timestamp: new Date().toISOString(),
    }

    const existingFeedback = JSON.parse(localStorage.getItem("patientFeedback") || "[]")
    localStorage.setItem("patientFeedback", JSON.stringify([...existingFeedback, feedbackData]))

    setFeedback({ rating: 0, comment: "" })
    alert("Thank you for your feedback!")
  }

  const educationalResources = [
    {
      title: "Managing Diabetes",
      description: "Comprehensive guide to diabetes management and lifestyle changes",
      type: "PDF Guide",
      downloadUrl: "#",
    },
    {
      title: "Heart-Healthy Diet",
      description: "Nutritional guidelines for cardiovascular health",
      type: "Video Series",
      downloadUrl: "#",
    },
    {
      title: "Medication Safety",
      description: "Important information about taking medications safely",
      type: "Interactive Guide",
      downloadUrl: "#",
    },
    {
      title: "Exercise for Seniors",
      description: "Safe exercise routines for older adults",
      type: "Video Tutorial",
      downloadUrl: "#",
    },
  ]

  const consentItems = [
    {
      id: "data_sharing",
      title: "Health Data Sharing",
      description: "Allow sharing of health data with specialists for consultation",
      status: "granted",
    },
    {
      id: "research",
      title: "Medical Research Participation",
      description: "Participate in anonymized medical research studies",
      status: "pending",
    },
    {
      id: "marketing",
      title: "Health Information Communications",
      description: "Receive health tips and wellness information via email",
      status: "denied",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Patient Portal
          </h1>
          <p className="text-gray-600">Your comprehensive health management platform</p>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="messages">Secure Messages</TabsTrigger>
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="consent">Consent</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Secure Messaging
                    </CardTitle>
                    <CardDescription>Communicate securely with your healthcare team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "outgoing" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.type === "outgoing" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.type === "outgoing" ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {message.from && `${message.from} • `}
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <Button onClick={sendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Request Records
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Forms
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Medical Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/dashboard/patient/my-records">
                      <Button className="w-full" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Medical Records
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/dashboard/prescriptions">
                      <Button className="w-full" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Prescriptions
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Health Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/dashboard/patient/health-tracking">
                      <Button className="w-full" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Health Tracking
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {educationalResources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {resource.title}
                    </CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">{resource.type}</Badge>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Consent Management
                </CardTitle>
                <CardDescription>Manage your healthcare data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consentItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.status === "granted"
                              ? "default"
                              : item.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {item.status === "granted" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {item.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {item.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Modify
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Provide Feedback
                </CardTitle>
                <CardDescription>Help us improve your healthcare experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Overall Experience Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className={`p-1 ${feedback.rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comments (Optional)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts about your care experience..."
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                  />
                </div>

                <Button onClick={submitFeedback} className="w-full">
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
