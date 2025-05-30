"use client"

// Create a more impressive loading spinner
import { useTheme } from "@/components/theme-provider"

export default function LoadingSpinner() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-t-[#C8AA6E] border-r-[#C8AA6E]/50 border-b-[#C8AA6E]/30 border-l-[#C8AA6E]/10 rounded-full animate-spin"></div>

        {/* Middle ring */}
        <div
          className="absolute inset-4 border-4 border-t-[#C8AA6E]/80 border-r-[#C8AA6E]/40 border-b-[#C8AA6E]/20 border-l-transparent rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>

        {/* Inner ring */}
        <div
          className="absolute inset-8 border-4 border-t-[#C8AA6E]/60 border-r-[#C8AA6E]/30 border-b-transparent border-l-transparent rounded-full animate-spin"
          style={{ animationDuration: "2s" }}
        ></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-[#C8AA6E] rounded-full animate-pulse"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-[#C8AA6E]/70"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-[#C8AA6E]/70"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-[#C8AA6E]/70"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-[#C8AA6E]/70"></div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-cyber text-[#C8AA6E] mb-2">LOADING</h3>
        <p className="text-[#A09B8C]">Summoning data from the Rift...</p>
      </div>
    </div>
  )
}
