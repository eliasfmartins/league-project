"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = theme === "dark" || (!theme && resolvedTheme === "dark")

  // Evitar hidratação incorreta
  useEffect(() => {
    setMounted(true)
  }, [])

  const buttonStyle = {
    border: "none",
    background: "transparent",
    boxShadow: "none",
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" style={buttonStyle}>
        <Sun className="h-[1.2rem] w-[1.2rem] text-[#C8AA6E]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" style={buttonStyle}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#C8AA6E]" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#C8AA6E]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#091428",
          borderColor: "#785A28",
        }}
      >
        <DropdownMenuItem
          onClick={() => {
            document.documentElement.classList.remove("dark")
            document.documentElement.classList.add("light")
            setTheme("light")
          }}
          className="text-[#C8AA6E]"
          style={{
            backgroundColor: "transparent",
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.documentElement.classList.remove("light")
            document.documentElement.classList.add("dark")
            setTheme("dark")
          }}
          className="text-[#C8AA6E]"
          style={{
            backgroundColor: "transparent",
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="text-[#C8AA6E]"
          style={{
            backgroundColor: "transparent",
          }}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
