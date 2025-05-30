// Update the SearchFilter component to pass search term to parent
"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"

interface SearchFilterProps {
  onSearch?: (term: string) => void
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Pass search term to parent component when it changes
  useEffect(() => {
    if (onSearch) {
      onSearch(searchTerm)
    }
  }, [searchTerm, onSearch])

  return (
    <div className="relative w-full md:w-auto md:min-w-[300px]">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#C8AA6E]" />
      <Input
        type="search"
        placeholder="Search champions..."
        className={`w-full rounded-md border ${isDark ? "bg-[#1a1a1a]" : "bg-[#091428]"} pl-9 pr-4 py-2 text-[#C8AA6E]`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#091428",
          borderColor: "#785A28",
        }}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-2.5 top-2.5 text-[#C8AA6E] hover:text-[#F0E6D2]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
