"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LabDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/lab/results")
  }, [router])

  return null
} 