"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import {
  ArrowLeft,
  Search,
  X,
  Filter,
  ChevronDown,
  Sword,
  Shield,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface StatisticsClientProps {
  champions: any[]
}

export default function StatisticsClient({ champions }: StatisticsClientProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLane, setSelectedLane] = useState("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedChampion, setSelectedChampion] = useState<any>(null)
  const [allyTeam, setAllyTeam] = useState<any[]>([])
  const [enemyTeam, setEnemyTeam] = useState<any[]>([])
  const [recommendedPicks, setRecommendedPicks] = useState<any[]>([])
  const [showTeamBuilder, setShowTeamBuilder] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [carouselPosition, setCarouselPosition] = useState(0)

  const lanes = ["ALL", "TOP", "JUNGLE", "MID", "ADC", "SUPPORT"]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter champions by search term and lane
  const filteredChampions = champions.filter((champion) => {
    const matchesSearch = champion.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLane = selectedLane === "ALL" || champion.mainLane === selectedLane

    return matchesSearch && matchesLane
  })

  // Sort champions by win rate
  const sortedChampions = [...filteredChampions].sort(
    (a, b) => Number.parseFloat(b.winRate.replace("%", "")) - Number.parseFloat(a.winRate.replace("%", "")),
  )

  // Function to scroll the carousel
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    const container = carouselRef.current
    const scrollAmount = direction === "left" ? -200 : 200

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  // Function to add champion to ally team
  const addToAllyTeam = (champion: any) => {
    if (
      allyTeam.length < 5 &&
      !allyTeam.some((c) => c.id === champion.id) &&
      !enemyTeam.some((c) => c.id === champion.id)
    ) {
      setAllyTeam([...allyTeam, champion])
      updateRecommendedPicks([...allyTeam, champion], enemyTeam)
    }
  }

  // Function to add champion to enemy team
  const addToEnemyTeam = (champion: any) => {
    if (
      enemyTeam.length < 5 &&
      !enemyTeam.some((c) => c.id === champion.id) &&
      !allyTeam.some((c) => c.id === champion.id)
    ) {
      setEnemyTeam([...enemyTeam, champion])
      updateRecommendedPicks(allyTeam, [...enemyTeam, champion])
    }
  }

  // Function to remove champion from ally team
  const removeFromAllyTeam = (championId: string) => {
    const newAllyTeam = allyTeam.filter((c) => c.id !== championId)
    setAllyTeam(newAllyTeam)
    updateRecommendedPicks(newAllyTeam, enemyTeam)
  }

  // Function to remove champion from enemy team
  const removeFromEnemyTeam = (championId: string) => {
    const newEnemyTeam = enemyTeam.filter((c) => c.id !== championId)
    setEnemyTeam(newEnemyTeam)
    updateRecommendedPicks(allyTeam, newEnemyTeam)
  }

  // Function to update recommended picks based on team compositions
  const updateRecommendedPicks = (allies: any[], enemies: any[]) => {
    if (enemies.length === 0) {
      setRecommendedPicks([])
      return
    }

    // Filter out champions already in either team
    const availableChampions = champions.filter(
      (c) => !allies.some((ally) => ally.id === c.id) && !enemies.some((enemy) => enemy.id === c.id),
    )

    // Calculate score for each champion based on matchups
    const scoredChampions = availableChampions.map((champion) => {
      let score = 0

      // Add points for being strong against enemy champions
      enemies.forEach((enemy) => {
        const isStrongAgainst = champion.strongAgainst.some((c: any) => c.id === enemy.id)
        if (isStrongAgainst) {
          score += 2
        }
      })

      // Subtract points for being weak against enemy champions
      enemies.forEach((enemy) => {
        const isWeakAgainst = champion.weakAgainst.some((c: any) => c.id === enemy.id)
        if (isWeakAgainst) {
          score -= 1
        }
      })

      // Add points for synergy with ally champions (simplified)
      allies.forEach((ally) => {
        // Simple synergy check - if they're both strong against similar enemies
        const commonStrongAgainst = ally.strongAgainst.filter((c: any) =>
          champion.strongAgainst.some((sc: any) => sc.id === c.id),
        )
        score += commonStrongAgainst.length * 0.5
      })

      return {
        ...champion,
        score,
      }
    })

    // Sort by score and take top 5
    const recommendations = scoredChampions.sort((a, b) => b.score - a.score).slice(0, 5)

    setRecommendedPicks(recommendations)
  }

  // Reset team builder
  const resetTeamBuilder = () => {
    setAllyTeam([])
    setEnemyTeam([])
    setRecommendedPicks([])
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-32 h-32">
          {/* Hextech-inspired loading animation */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,5 95,25 95,75 50,95 5,75 5,25"
                fill="none"
                stroke="#C8AA6E"
                strokeWidth="2"
                className="animate-pulse"
              />
              <polygon
                points="50,15 85,30 85,70 50,85 15,70 15,30"
                fill="none"
                stroke="#C8AA6E"
                strokeWidth="1.5"
                className="animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <polygon
                points="50,25 75,35 75,65 50,75 25,65 25,35"
                fill="none"
                stroke="#C8AA6E"
                strokeWidth="1"
                className="animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "2s" }}
              />
              <circle
                cx="50"
                cy="50"
                r="5"
                fill="#C8AA6E"
                className="animate-ping"
                style={{ animationDuration: "1.5s" }}
              />
            </svg>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-xl font-cyber text-[#C8AA6E] mb-2">ANALYZING CHAMPION DATA</h3>
          <p className="text-[#A09B8C]">Calculating win rates and matchups...</p>
        </div>
      </div>
    )
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
          <h1 className="font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl">
            CHAMPION STATISTICS
          </h1>
          <p className="mt-2 text-[#A09B8C]">
            Explore detailed champion statistics, matchups, and get recommendations for your next game
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#C8AA6E]" />
            <Input
              type="search"
              placeholder="Search champions..."
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

          <div className="flex items-center gap-4">
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

            <button
              onClick={() => setShowTeamBuilder(!showTeamBuilder)}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm border ${
                showTeamBuilder ? "bg-[#C8AA6E]/20 border-[#C8AA6E]" : "border-[#785A28]/50 bg-transparent"
              } text-[#C8AA6E]`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Team Builder</span>
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
            <h3 className="mb-3 text-[#C8AA6E] font-medium">Filter by Lane</h3>
            <Tabs defaultValue={selectedLane} onValueChange={setSelectedLane}>
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-transparent">
                {lanes.map((lane) => (
                  <TabsTrigger key={lane} value={lane} className="text-[#C8AA6E] data-[state=active]:bg-[#C8AA6E]/20">
                    {lane}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        )}

        {showTeamBuilder && (
          <motion.div
            className={`mb-6 p-4 rounded-sm border border-[#785A28]/50 ${
              isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="mb-3 text-[#C8AA6E] font-medium">Your Team</h3>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const champion = allyTeam[index]
                    return (
                      <div
                        key={`ally-${index}`}
                        className={`h-16 w-16 rounded-full border ${
                          champion ? "border-[#C8AA6E]" : "border-dashed border-[#785A28]/50"
                        } flex items-center justify-center overflow-hidden`}
                      >
                        {champion ? (
                          <div className="relative w-full h-full group">
                            <Image
                              src={champion.image || "/placeholder.svg"}
                              alt={champion.name}
                              fill
                              className="object-cover"
                            />
                            <button
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                              onClick={() => removeFromAllyTeam(champion.id)}
                            >
                              <X className="h-6 w-6 text-white" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#785A28]/50 text-xs">Empty</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="mb-3 text-[#C8AA6E] font-medium">Enemy Team</h3>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const champion = enemyTeam[index]
                    return (
                      <div
                        key={`enemy-${index}`}
                        className={`h-16 w-16 rounded-full border ${
                          champion ? "border-red-500" : "border-dashed border-[#785A28]/50"
                        } flex items-center justify-center overflow-hidden`}
                      >
                        {champion ? (
                          <div className="relative w-full h-full group">
                            <Image
                              src={champion.image || "/placeholder.svg"}
                              alt={champion.name}
                              fill
                              className="object-cover"
                            />
                            <button
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                              onClick={() => removeFromEnemyTeam(champion.id)}
                            >
                              <X className="h-6 w-6 text-white" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#785A28]/50 text-xs">Empty</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {recommendedPicks.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-[#C8AA6E] font-medium">Recommended Picks</h3>
                <div className="flex flex-wrap gap-4">
                  {recommendedPicks.map((champion) => (
                    <div key={champion.id} className="flex flex-col items-center">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#C8AA6E] mb-2">
                        <Image
                          src={champion.image || "/placeholder.svg"}
                          alt={champion.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-[#C8AA6E]">{champion.name}</span>
                      <span className="text-xs text-green-400">Score: {champion.score.toFixed(1)}</span>
                      <button
                        onClick={() => addToAllyTeam(champion)}
                        className="mt-1 text-xs bg-[#C8AA6E]/20 hover:bg-[#C8AA6E]/30 px-2 py-1 rounded text-[#C8AA6E]"
                      >
                        Add to Team
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTeamBuilder}
                className="text-[#C8AA6E] border-[#C8AA6E]/50 hover:bg-[#C8AA6E]/20"
              >
                Reset Teams
              </Button>
            </div>
          </motion.div>
        )}

        {/* Champion Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {sortedChampions.map((champion, index) => (
            <motion.div
              key={champion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
              className={`rounded-sm border border-[#785A28]/50 ${
                isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
              } p-4 cursor-pointer hover:border-[#C8AA6E] transition-all`}
              onClick={() => setSelectedChampion(champion)}
            >
              <div className="flex flex-col items-center">
                <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-[#785A28]/50 mb-2 group perspective-500">
                  <Image
                    src={champion.image || "/placeholder.svg"}
                    alt={champion.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Lane icon */}
                  <div className="absolute bottom-0 right-0 bg-[#0A1428]/80 rounded-full p-1 border border-[#785A28]/50">
                    <span className="text-[10px] text-[#C8AA6E] font-bold">{champion.mainLane}</span>
                  </div>
                </div>

                <h3 className="text-center text-sm font-medium text-[#C8AA6E] truncate w-full">{champion.name}</h3>

                <div className="mt-2 w-full">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[#A09B8C]">Win Rate:</span>
                    <span
                      className={`font-medium ${
                        Number.parseFloat(champion.winRate) > 52
                          ? "text-green-400"
                          : Number.parseFloat(champion.winRate) < 48
                            ? "text-red-400"
                            : "text-yellow-400"
                      }`}
                    >
                      {champion.winRate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[#A09B8C]">Pick Rate:</span>
                    <span className="text-[#C8AA6E]">{champion.pickRate}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#A09B8C]">KDA:</span>
                    <span className="text-[#C8AA6E]">{champion.kda}</span>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addToAllyTeam(champion)
                    }}
                    className="text-xs bg-[#C8AA6E]/20 hover:bg-[#C8AA6E]/30 px-2 py-1 rounded text-[#C8AA6E]"
                  >
                    Ally
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addToEnemyTeam(champion)
                    }}
                    className="text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-400"
                  >
                    Enemy
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Champion Detail Modal */}
        {selectedChampion && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedChampion(null)}
          >
            <motion.div
              className={`w-full max-w-6xl rounded-sm border border-[#785A28] ${
                isDark ? "bg-[#1a1a1a]" : "bg-[#091428]"
              } shadow-xl max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${selectedChampion.id.charAt(0).toUpperCase() + selectedChampion.id.slice(1)}_0.jpg`}
                  alt={selectedChampion.name}
                  fill
                  className="object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = selectedChampion.image || "/placeholder.svg"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-3xl font-cyber font-bold text-[#C8AA6E]">{selectedChampion.name}</h2>
                      <p className="text-[#A09B8C]">{selectedChampion.title}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 bg-[#0A1428]/80 px-3 py-1 rounded-sm border border-[#785A28]/50">
                        <span className="text-[#A09B8C]">Main Lane:</span>
                        <span className="text-[#C8AA6E] font-medium">{selectedChampion.mainLane}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stats Column */}
                  <div>
                    <h3 className="text-xl font-cyber font-bold text-[#C8AA6E] mb-4">Champion Statistics</h3>

                    <div
                      className={`p-4 rounded-sm border border-[#785A28]/50 ${
                        isDark ? "bg-[#1a1a1a]/50" : "bg-[#0A1428]/50"
                      } mb-4`}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[#A09B8C] text-sm">Win Rate</p>
                          <p
                            className={`text-lg font-bold ${
                              Number.parseFloat(selectedChampion.winRate) > 52
                                ? "text-green-400"
                                : Number.parseFloat(selectedChampion.winRate) < 48
                                  ? "text-red-400"
                                  : "text-yellow-400"
                            }`}
                          >
                            {selectedChampion.winRate}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#A09B8C] text-sm">Pick Rate</p>
                          <p className="text-lg font-bold text-[#C8AA6E]">{selectedChampion.pickRate}</p>
                        </div>
                        <div>
                          <p className="text-[#A09B8C] text-sm">Ban Rate</p>
                          <p className="text-lg font-bold text-[#C8AA6E]">{selectedChampion.banRate}</p>
                        </div>
                        <div>
                          <p className="text-[#A09B8C] text-sm">KDA</p>
                          <p className="text-lg font-bold text-[#C8AA6E]">{selectedChampion.kda}</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-sm border border-[#785A28]/50 ${
                        isDark ? "bg-[#1a1a1a]/50" : "bg-[#0A1428]/50"
                      } mb-4`}
                    >
                      <h4 className="text-[#C8AA6E] font-medium mb-2">Performance Metrics</h4>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#A09B8C]">CS per min</span>
                            <span className="text-[#C8AA6E]">{selectedChampion.csPerMin}</span>
                          </div>
                          <div
                            className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                          >
                            <motion.div
                              className="h-full rounded-full bg-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(Number.parseFloat(selectedChampion.csPerMin) / 10) * 100}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#A09B8C]">Avg. Kills</span>
                            <span className="text-[#C8AA6E]">{selectedChampion.averageKills}</span>
                          </div>
                          <div
                            className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                          >
                            <motion.div
                              className="h-full rounded-full bg-red-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(Number.parseFloat(selectedChampion.averageKills) / 15) * 100}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#A09B8C]">Avg. Deaths</span>
                            <span className="text-[#C8AA6E]">{selectedChampion.averageDeaths}</span>
                          </div>
                          <div
                            className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                          >
                            <motion.div
                              className="h-full rounded-full bg-yellow-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(Number.parseFloat(selectedChampion.averageDeaths) / 10) * 100}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#A09B8C]">Avg. Assists</span>
                            <span className="text-[#C8AA6E]">{selectedChampion.averageAssists}</span>
                          </div>
                          <div
                            className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                          >
                            <motion.div
                              className="h-full rounded-full bg-green-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(Number.parseFloat(selectedChampion.averageAssists) / 15) * 100}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#A09B8C]">Avg. Damage</span>
                            <span className="text-[#C8AA6E]">{selectedChampion.averageDamage.toLocaleString()}</span>
                          </div>
                          <div
                            className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                          >
                            <motion.div
                              className="h-full rounded-full bg-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(selectedChampion.averageDamage / 25000) * 100}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strong Against Column */}
                  <div>
                    <h3 className="text-xl font-cyber font-bold text-[#C8AA6E] mb-4">
                      <Sword className="inline-block mr-2 h-5 w-5 text-green-400" />
                      Strong Against
                    </h3>

                    <div
                      className={`p-4 rounded-sm border border-[#785A28]/50 ${
                        isDark ? "bg-[#1a1a1a]/50" : "bg-[#0A1428]/50"
                      }`}
                    >
                      <div className="space-y-3">
                        {selectedChampion.strongAgainst.map((enemy: any) => (
                          <div
                            key={`strong-${enemy.id}`}
                            className="flex items-center justify-between p-2 rounded-sm border border-[#785A28]/30 hover:border-[#C8AA6E]/50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#785A28]/50">
                                <Image
                                  src={enemy.image || "/placeholder.svg"}
                                  alt={enemy.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-[#C8AA6E]">{enemy.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-medium">{enemy.winRateAgainst}</span>
                              <ArrowUp className="h-4 w-4 text-green-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Weak Against Column */}
                  <div>
                    <h3 className="text-xl font-cyber font-bold text-[#C8AA6E] mb-4">
                      <Shield className="inline-block mr-2 h-5 w-5 text-red-400" />
                      Weak Against
                    </h3>

                    <div
                      className={`p-4 rounded-sm border border-[#785A28]/50 ${
                        isDark ? "bg-[#1a1a1a]/50" : "bg-[#0A1428]/50"
                      }`}
                    >
                      <div className="space-y-3">
                        {selectedChampion.weakAgainst.map((enemy: any) => (
                          <div
                            key={`weak-${enemy.id}`}
                            className="flex items-center justify-between p-2 rounded-sm border border-[#785A28]/30 hover:border-[#C8AA6E]/50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#785A28]/50">
                                <Image
                                  src={enemy.image || "/placeholder.svg"}
                                  alt={enemy.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-[#C8AA6E]">{enemy.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-400 font-medium">{enemy.winRateAgainst}</span>
                              <ArrowDown className="h-4 w-4 text-red-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Builds Section */}
                <div className="mt-6">
                  <h3 className="text-xl font-cyber font-bold text-[#C8AA6E] mb-4">Recommended Builds</h3>

                  <div
                    className={`p-4 rounded-sm border border-[#785A28]/50 ${
                      isDark ? "bg-[#1a1a1a]/50" : "bg-[#0A1428]/50"
                    }`}
                  >
                    <div className="relative">
                      <button
                        onClick={() => scrollCarousel("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#0A1428]/80 dark:bg-[#1a1a1a]/80 rounded-full p-2 border border-[#C8AA6E]/30 text-[#C8AA6E] hover:bg-[#C8AA6E]/20"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div
                        ref={carouselRef}
                        className="flex overflow-x-auto scrollbar-hide gap-4 py-2 px-10"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {/* Generate 3 random builds */}
                        {Array.from({ length: 3 }).map((_, buildIndex) => (
                          <div
                            key={`build-${buildIndex}`}
                            className={`flex-shrink-0 p-4 rounded-sm border border-[#785A28]/50 ${
                              isDark ? "bg-[#1a1a1a]/30" : "bg-[#0A1428]/30"
                            } min-w-[300px]`}
                          >
                            <h4 className="text-[#C8AA6E] font-medium mb-3">
                              {buildIndex === 0
                                ? "Most Popular Build"
                                : buildIndex === 1
                                  ? "Highest Win Rate Build"
                                  : "Situational Build"}
                            </h4>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {/* Generate 6 random items */}
                              {Array.from({ length: 6 }).map((_, itemIndex) => (
                                <div
                                  key={`build-${buildIndex}-item-${itemIndex}`}
                                  className="relative h-12 w-12 rounded-sm overflow-hidden border border-[#785A28]/50"
                                >
                                  <Image
                                    src={`/placeholder.svg?height=48&width=48`}
                                    alt="Item"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-[#A09B8C]">Win Rate:</span>
                              <span className="text-green-400 font-medium">
                                {(50 + Math.random() * 10).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#A09B8C]">Pick Rate:</span>
                              <span className="text-[#C8AA6E]">{(5 + Math.random() * 20).toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => scrollCarousel("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#0A1428]/80 dark:bg-[#1a1a1a]/80 rounded-full p-2 border border-[#C8AA6E]/30 text-[#C8AA6E] hover:bg-[#C8AA6E]/20"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex justify-end border-t border-[#785A28]/30">
                <Button
                  onClick={() => setSelectedChampion(null)}
                  className="bg-[#C8AA6E] text-[#0A1428] hover:bg-[#F0E6D2]"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
