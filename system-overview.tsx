"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserCheck,
  Stethoscope,
  Heart,
  FileText,
  Shield,
  Database,
  Activity,
  Phone,
  Brain,
  Smartphone,
  BarChart3,
  Pill,
  AlertTriangle,
} from "lucide-react"

export default function MedicalSystemOverview() {
  const primaryActors = [
    {
      role: "Admin",
      icon: Shield,
      color: "bg-red-500",
      responsibilities: [
        "System oversight and management",
        "User account management",
        "Security policy implementation",
        "Database backup and recovery",
        "Audit trail monitoring",
        "Compliance reporting",
      ],
    },
    {
      role: "Doctor",
      icon: Stethoscope,
      color: "bg-blue-500",
      responsibilities: [
        "Complete medical record access",
        "Diagnosis and treatment planning",
        "Prescription management",
        "Death certificate generation",
        "Specialist referrals",
        "Medical decision-making",
      ],
    },
    {
      role: "Patient",
      icon: Heart,
      color: "bg-green-500",
      responsibilities: [
        "View personal medical history",
        "Schedule appointments",
        "Update personal information",
        "Provide treatment consent",
        "Access educational materials",
        "Manage health data",
      ],
    },
  ]

  const secondaryActors = [
    {
      role: "Nurse",
      icon: UserCheck,
      responsibilities: [
        "Limited medical record access",
        "Vital signs documentation",
        "Medication administration tracking",
        "Patient education",
        "Care plan implementation",
      ],
    },
    {
      role: "Lab Technician",
      icon: Activity,
      responsibilities: [
        "Test result entry",
        "Laboratory report generation",
        "Sample tracking",
        "Quality control documentation",
        "Critical result flagging",
      ],
    },
    {
      role: "Receptionist",
      icon: Users,
      responsibilities: [
        "Patient registration",
        "Appointment scheduling",
        "Insurance verification",
        "Basic billing support",
        "Front-desk communication",
      ],
    },
  ]

  const proposedFeatures = [
    {
      title: "Telemedicine Integration",
      icon: Phone,
      description: "Video consultations with secure recording and remote monitoring",
      benefits: ["Remote patient care", "Reduced travel costs", "Improved accessibility"],
    },
    {
      title: "AI Clinical Decision Support",
      icon: Brain,
      description: "Machine learning for diagnosis assistance and risk assessment",
      benefits: ["Enhanced accuracy", "Drug interaction alerts", "Predictive analytics"],
    },
    {
      title: "Emergency Alert System",
      icon: AlertTriangle,
      description: "Critical notifications and automated emergency contacts",
      benefits: ["Faster response times", "Automated alerts", "Patient safety"],
    },
    {
      title: "Mobile Health Integration",
      icon: Smartphone,
      description: "Wearable device integration and patient mobile app",
      benefits: ["Real-time monitoring", "Patient engagement", "Health tracking"],
    },
    {
      title: "Advanced Analytics",
      icon: BarChart3,
      description: "Population health dashboards and clinical outcome tracking",
      benefits: ["Data-driven insights", "Quality metrics", "Performance tracking"],
    },
    {
      title: "Pharmacy Integration",
      icon: Pill,
      description: "Direct e-prescribing and medication adherence tracking",
      benefits: ["Streamlined prescriptions", "Adherence monitoring", "Inventory management"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Secure Cloud-Based Patient Medical Record Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive healthcare management platform designed for secure patient data handling, multi-role access
            control, and advanced medical workflow automation.
          </p>
        </div>

        <Tabs defaultValue="actors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="actors">System Actors</TabsTrigger>
            <TabsTrigger value="features">Proposed Features</TabsTrigger>
            <TabsTrigger value="architecture">System Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="actors" className="space-y-8">
            {/* Primary Actors */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Primary Actors
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {primaryActors.map((actor, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className={`${actor.color} text-white`}>
                          <AvatarFallback className="bg-transparent">
                            <actor.icon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle>{actor.role}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {actor.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Secondary Actors */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-green-600" />
                Secondary Actors
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {secondaryActors.map((actor, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="bg-gray-500 text-white">
                          <AvatarFallback className="bg-transparent">
                            <actor.icon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle>{actor.role}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {actor.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                Proposed New Features
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposedFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <feature.icon className="h-8 w-8 text-purple-600" />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Key Benefits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {feature.benefits.map((benefit, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Database className="h-6 w-6 text-indigo-600" />
                System Architecture Overview
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Core Components</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Database className="h-5 w-5 text-blue-600" />
                      <span>Secure Cloud Database</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span>Authentication & Authorization</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <span>Medical Records Management</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Activity className="h-5 w-5 text-orange-600" />
                      <span>Real-time Monitoring</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <Shield className="h-5 w-5 text-red-600" />
                      <span>HIPAA Compliance</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <FileText className="h-5 w-5 text-yellow-600" />
                      <span>End-to-End Encryption</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                      <span>Role-Based Access Control</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                      <Activity className="h-5 w-5 text-teal-600" />
                      <span>Audit Trail Logging</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Death Certificate Generation Workflow</CardTitle>
                  <CardDescription>
                    Automated process for generating death certificates when a patient passes away
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 items-center justify-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <span className="text-sm">Patient Status Update</span>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-sm">Doctor Verification</span>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <span className="text-sm">Certificate Generation</span>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="text-sm">Legal Compliance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready for Implementation</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              This comprehensive medical record management system addresses all critical healthcare workflows while
              maintaining the highest security standards and regulatory compliance.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg">
                View Technical Specifications
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                Download Project Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
