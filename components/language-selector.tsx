"use client"

import { useTheme } from "@/components/theme-provider"

export function LanguageSelector() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="relative">
      <button
        className="language-selector hextech-button"
        disabled
        type="button"
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#091428",
          border: "none",
          opacity: 0.7,
          cursor: "default",
        }}
      >
        EN
      </button>
    </div>
  )
}
