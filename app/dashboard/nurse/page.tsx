"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NurseDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/nurse/assigned-patients")
  }, [router])

  return null
} 