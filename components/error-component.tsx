"use client"

import { useTheme } from "@/components/theme-provider"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ErrorComponentProps {
  message: string
}

export default function ErrorComponent({ message }: ErrorComponentProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const router = useRouter()

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gradient-to-b from-[#121212] to-[#1a1a1a]" : "bg-gradient-to-b from-[#091428] to-[#0A1428]"
      }`}
    >
      <div
        className={`max-w-md w-full p-8 rounded-sm border border-[#785A28]/50 ${
          isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
        } shadow-lg backdrop-blur-sm text-center`}
      >
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-500/20 p-3">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-cyber font-bold text-[#C8AA6E] mb-4">Error Loading Data</h2>
        <p className="text-[#A09B8C] mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.reload()} className="bg-[#C8AA6E] text-[#0A1428] hover:bg-[#F0E6D2]">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-[#C8AA6E]/50 text-[#C8AA6E] hover:bg-[#C8AA6E]/10">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
