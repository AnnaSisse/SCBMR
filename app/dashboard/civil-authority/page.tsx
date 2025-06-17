"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CivilAuthorityDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/civil-authority/birth-certificates")
  }, [router])

  return null
}
