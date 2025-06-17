"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DoctorDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/doctor/patient-records")
  }, [router])

  return null
} 