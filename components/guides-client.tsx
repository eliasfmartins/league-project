"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { ArrowLeft, Search, X, Filter, ChevronDown, Eye, ThumbsUp, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "./loading-spinner"
import { motion } from "framer-motion"

interface GuidesClientProps {
  featuredGuides: any[]
  allGuides: any[]
  champions: any[]
}

export default function GuidesClient({ featuredGuides, allGuides, champions }: GuidesClientProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const difficulties = ["ALL", "EASY", "MEDIUM", "HARD"]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter guides by search term and difficulty
  const filteredGuides = allGuides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDifficulty =
      selectedDifficulty === "ALL" ||
      (selectedDifficulty === "EASY" && guide.difficulty === 1) ||
      (selectedDifficulty === "MEDIUM" && guide.difficulty === 2) ||
      (selectedDifficulty === "HARD" && guide.difficulty === 3)

    return matchesSearch && matchesDifficulty
  })

  // Find champion by ID
  const getChampionById = (id: string) => {
    return champions.find((champion) => champion.id === id) || null
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gradient-to-b from-[#121212] to-[#1a1a1a]" : "bg-gradient-to-b from-[#091428] to-[#0A1428]"
      }`}
    >
      <div className="container mx-auto max-w-[1200px] px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-2 inline-flex items-center text-sm bg-[#C8AA6E]/10 hover:bg-[#C8AA6E]/20 px-3 py-2 rounded-sm border border-[#C8AA6E]/30 text-[#C8AA6E] hover:text-[#F0E6D2] transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl">CHAMPION GUIDES</h1>
          <p className="mt-2 text-[#A09B8C]">Master your favorite champions with our comprehensive guides</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#C8AA6E]" />
            <Input
              type="search"
              placeholder="Search guides..."
              className={`w-full rounded-md border ${
                isDark ? "bg-[#1a1a1a]" : "bg-[#091428]"
              } pl-9 pr-4 py-2 text-[#C8AA6E]`}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm border ${
                showFilters ? "bg-[#C8AA6E]/20 border-[#C8AA6E]" : "border-[#785A28]/50 bg-transparent"
              } text-[#C8AA6E]`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            className={`mb-6 p-4 rounded-sm border border-[#785A28]/50 ${
              isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="mb-3 text-[#C8AA6E] font-medium">Filter by Difficulty</h3>
            <Tabs defaultValue={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <TabsList className="grid w-full grid-cols-4 bg-transparent">
                {difficulties.map((difficulty) => (
                  <TabsTrigger
                    key={difficulty}
                    value={difficulty}
                    className="text-[#C8AA6E] data-[state=active]:bg-[#C8AA6E]/20"
                  >
                    {difficulty}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        )}

        {/* Featured Guides */}
        <section className="mb-12">
          <h2 className="font-cyber text-2xl font-bold text-[#C8AA6E] mb-6">FEATURED GUIDES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map((champion, index) => {
              const guide = allGuides.find((g) => g.championId === champion.id)
              if (!guide) return null

              return (
                <motion.div
                  key={champion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`rounded-sm border border-[#785A28]/50 ${
                    isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
                  } overflow-hidden hover:border-[#C8AA6E] transition-all duration-300`}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={champion.image || "/placeholder.svg"}
                      alt={champion.name}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold text-[#C8AA6E]">{champion.name}</h3>
                      <p className="text-sm text-[#A09B8C]">{champion.title}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-[#C8AA6E] mb-2">{guide.title}</h4>
                    <p className="text-sm text-[#A09B8C] mb-4 line-clamp-2">{guide.description}</p>
                    <div className="flex items-center justify-between text-xs text-[#A09B8C]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{guide.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{guide.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{guide.likes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* All Guides */}
        <section>
          <h2 className="font-cyber text-2xl font-bold text-[#C8AA6E] mb-6">ALL GUIDES</h2>
          <div className="space-y-4">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide, index) => {
                const champion = getChampionById(guide.championId)
                if (!champion) return null

                return (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                    className={`flex flex-col md:flex-row gap-4 p-4 rounded-sm border border-[#785A28]/50 ${
                      isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
                    } hover:border-[#C8AA6E]/50 transition-all`}
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 rounded-sm overflow-hidden">
                      <Image
                        src={champion.image || "/placeholder.svg"}
                        alt={champion.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3 className="text-lg font-medium text-[#C8AA6E]">{guide.title}</h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              guide.difficulty === 1
                                ? "bg-green-500/20 text-green-400"
                                : guide.difficulty === 2
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {guide.difficulty === 1 ? "EASY" : guide.difficulty === 2 ? "MEDIUM" : "HARD"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-[#A09B8C] my-2">{guide.description}</p>
                      <div className="flex items-center justify-between text-xs text-[#A09B8C]">
                        <div className="flex items-center gap-2">
                          <span>By {guide.author}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{guide.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{guide.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{guide.likes.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl text-[#C8AA6E] mb-4">¯\_(ツ)_/¯</div>
                <h3 className="text-xl font-cyber text-[#C8AA6E] mb-2">No Guides Found</h3>
                <p className="text-[#A09B8C] max-w-md">
                  We couldn't find any guides matching your search criteria. Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
