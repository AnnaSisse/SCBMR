"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ReceptionDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/reception/insurance")
  }, [router])

  return null
} 