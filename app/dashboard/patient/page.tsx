"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PatientDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/patient/portal")
  }, [router])

  return null
} 