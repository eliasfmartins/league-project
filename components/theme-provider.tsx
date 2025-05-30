"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  attribute?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: Theme
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "dark",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = true,
  attribute = "class",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<Theme>("dark")

  useEffect(() => {
    // Tentar recuperar o tema salvo no localStorage
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system")) {
        setTheme(savedTheme)
      }
    } catch (e) {
      console.error("Failed to read theme from localStorage:", e)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    // Remover todas as classes de tema primeiro
    root.classList.remove("light", "dark")

    // Determinar o tema a ser aplicado
    let resolvedTheme: Theme = theme

    if (theme === "system" && enableSystem) {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    // Aplicar a classe do tema
    root.classList.add(resolvedTheme)
    setResolvedTheme(resolvedTheme)

    // Adicionar um atributo data-theme para facilitar a depuração
    root.setAttribute("data-theme", resolvedTheme)
  }, [theme, enableSystem])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
      // Salvar a preferência do usuário
      try {
        localStorage.setItem("theme", newTheme)
      } catch (e) {
        console.error("Failed to save theme to localStorage:", e)
      }
    },
    resolvedTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
