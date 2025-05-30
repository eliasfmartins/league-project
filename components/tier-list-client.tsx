"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { ArrowLeft, Search, X, Filter, ChevronDown, ArrowUp, ArrowDown, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "./loading-spinner"
import { motion, AnimatePresence } from "framer-motion"

interface TierListClientProps {
  champions: any[]
  championsByLane: Record<string, any[]>
}

export default function TierListClient({ champions, championsByLane }: TierListClientProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("ALL")
  const [isLoading, setIsLoading] = useState(true)

  const [visibleTiers, setVisibleTiers] = useState(["S"])
  const [loadingMore, setLoadingMore] = useState(false)
  const tierListRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const [showFilters, setShowFilters] = useState(false)

  const roles = ["ALL", "TOP", "JUNGLE", "MID", "ADC", "SUPPORT"]
  const tiers = ["S", "A", "B", "C", "D"]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && !loadingMore && visibleTiers.length < tiers.length) {
        setLoadingMore(true)

        // Determinar o próximo tier a ser carregado
        const nextTierIndex = tiers.findIndex((tier) => tier === visibleTiers[visibleTiers.length - 1]) + 1

        if (nextTierIndex < tiers.length) {
          setTimeout(() => {
            setVisibleTiers((prev) => [...prev, tiers[nextTierIndex]])
            setLoadingMore(false)
          }, 800)
        } else {
          setLoadingMore(false)
        }
      }
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    })

    if (tierListRef.current) {
      observerRef.current.observe(tierListRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadingMore, visibleTiers, tiers])

  // Filter champions by search term and role
  const filteredChampions = champions.filter((champion) => {
    const matchesSearch = champion.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole =
      selectedRole === "ALL" || champion.mainLane === selectedRole || champion.secondaryLanes.includes(selectedRole)

    return matchesSearch && matchesRole
  })

  // Group champions by tier
  const championsByTier = tiers.reduce(
    (acc, tier) => {
      acc[tier] = filteredChampions.filter((champion) => champion.tier === tier)
      return acc
    },
    {} as Record<string, any[]>,
  )

  // Get top champions for each lane
  const getTopChampionsByLane = (lane: string, count = 10) => {
    return championsByLane[lane]?.slice(0, count) || []
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
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-2 inline-flex items-center text-sm bg-[#C8AA6E]/10 hover:bg-[#C8AA6E]/20 px-3 py-2 rounded-sm border border-[#C8AA6E]/30 text-[#C8AA6E] hover:text-[#F0E6D2] transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl">
            CHAMPION TIER LIST
          </h1>
          <p className="mt-2 text-[#A09B8C]">Find the strongest champions in the current meta</p>
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
            <h3 className="mb-3 text-[#C8AA6E] font-medium">Filter by Role</h3>
            <Tabs defaultValue={selectedRole} onValueChange={setSelectedRole}>
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-transparent">
                {roles.map((role) => (
                  <TabsTrigger key={role} value={role} className="text-[#C8AA6E] data-[state=active]:bg-[#C8AA6E]/20">
                    {role}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        )}

        {selectedRole === "ALL" ? (
          <div className="space-y-8">
            {tiers
              .filter((tier) => visibleTiers.includes(tier))
              .map((tier) => (
                <AnimatePresence key={tier}>
                  {championsByTier[tier] && championsByTier[tier].length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`rounded-sm border border-[#785A28]/50 ${
                        isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
                      } overflow-hidden`}
                    >
                      <div
                        className={`p-4 ${
                          tier === "S"
                            ? "bg-gradient-to-r from-[#FFD700]/20 to-transparent"
                            : tier === "A"
                              ? "bg-gradient-to-r from-[#C0C0C0]/20 to-transparent"
                              : tier === "B"
                                ? "bg-gradient-to-r from-[#CD7F32]/20 to-transparent"
                                : tier === "C"
                                  ? "bg-gradient-to-r from-[#0397AB]/20 to-transparent"
                                  : "bg-gradient-to-r from-[#FF4500]/20 to-transparent"
                        }`}
                      >
                        <h2 className="font-cyber text-2xl font-bold text-[#C8AA6E]">TIER {tier}</h2>
                        <p className="text-sm text-[#A09B8C]">
                          {tier === "S"
                            ? "Overpowered champions that dominate the meta"
                            : tier === "A"
                              ? "Strong picks that perform consistently well"
                              : tier === "B"
                                ? "Balanced champions with good potential"
                                : tier === "C"
                                  ? "Average performers that require skill to excel"
                                  : "Underperforming champions that need buffs"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 p-4">
                        {championsByTier[tier].map((champion, index) => (
                          <motion.div
                            key={champion.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`p-2 rounded-sm border border-[#785A28]/30 ${
                              isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                            } hover:border-[#C8AA6E]/50 transition-all`}
                          >
                            <Link href={`/champions/${champion.id}`} className="flex flex-col items-center">
                              <div className="relative h-16 w-16 mb-2 rounded-full overflow-hidden border-2 border-[#785A28]/50">
                                <Image
                                  src={champion.image || "/placeholder.svg"}
                                  alt={champion.name}
                                  fill
                                  className="object-cover object-center"
                                />
                              </div>
                              <h3 className="text-center text-sm font-medium text-[#C8AA6E] truncate w-full">
                                {champion.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-xs ${
                                    Number.parseFloat(champion.winRate) > 52
                                      ? "text-green-400"
                                      : Number.parseFloat(champion.winRate) < 48
                                        ? "text-red-400"
                                        : "text-yellow-400"
                                  }`}
                                >
                                  {champion.winRate}
                                </span>
                                <span className="text-xs text-[#A09B8C]">{champion.pickRate}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-[#C8AA6E] bg-[#C8AA6E]/10 px-1 rounded">
                                  {champion.mainLane}
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              ))}

            {/* Elemento de referência para o infinite scroll */}
            <div ref={tierListRef} className="w-full h-20 flex items-center justify-center">
              {loadingMore && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C8AA6E]"></div>
                  <p className="text-[#C8AA6E] mt-2">Loading more tiers...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-sm border border-[#785A28]/50 ${
                isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
              } overflow-hidden`}
            >
              <div className="p-4 bg-gradient-to-r from-[#C8AA6E]/20 to-transparent">
                <h2 className="font-cyber text-2xl font-bold text-[#C8AA6E]">TOP {selectedRole} CHAMPIONS</h2>
                <p className="text-sm text-[#A09B8C]">
                  The most powerful champions for the {selectedRole} role in the current meta
                </p>
              </div>

              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#785A28]/30">
                        <th className="px-4 py-2 text-left text-[#C8AA6E]">Rank</th>
                        <th className="px-4 py-2 text-left text-[#C8AA6E]">Champion</th>
                        <th className="px-4 py-2 text-center text-[#C8AA6E]">Tier</th>
                        <th className="px-4 py-2 text-center text-[#C8AA6E]">Win Rate</th>
                        <th className="px-4 py-2 text-center text-[#C8AA6E]">Pick Rate</th>
                        <th className="px-4 py-2 text-center text-[#C8AA6E]">Ban Rate</th>
                        <th className="px-4 py-2 text-center text-[#C8AA6E]">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getTopChampionsByLane(selectedRole).map((champion, index) => (
                        <motion.tr
                          key={champion.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`border-b border-[#785A28]/10 hover:bg-[#C8AA6E]/5`}
                        >
                          <td className="px-4 py-3 text-[#C8AA6E] font-bold">{index + 1}</td>
                          <td className="px-4 py-3">
                            <Link href={`/champions/${champion.id}`} className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#785A28]/50">
                                <Image
                                  src={champion.image || "/placeholder.svg"}
                                  alt={champion.name}
                                  fill
                                  className="object-cover object-center"
                                />
                              </div>
                              <span className="font-medium text-[#C8AA6E]">{champion.name}</span>
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                                champion.tier === "S"
                                  ? "bg-[#FFD700]/20 text-[#FFD700]"
                                  : champion.tier === "A"
                                    ? "bg-[#C0C0C0]/20 text-[#C0C0C0]"
                                    : champion.tier === "B"
                                      ? "bg-[#CD7F32]/20 text-[#CD7F32]"
                                      : champion.tier === "C"
                                        ? "bg-[#0397AB]/20 text-[#0397AB]"
                                        : "bg-[#FF4500]/20 text-[#FF4500]"
                              }`}
                            >
                              {champion.tier}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-3 text-center font-medium ${
                              Number.parseFloat(champion.winRate) > 52
                                ? "text-green-400"
                                : Number.parseFloat(champion.winRate) < 48
                                  ? "text-red-400"
                                  : "text-yellow-400"
                            }`}
                          >
                            {champion.winRate}
                          </td>
                          <td className="px-4 py-3 text-center text-[#A09B8C]">{champion.pickRate}</td>
                          <td className="px-4 py-3 text-center text-[#A09B8C]">{champion.banRate}</td>
                          <td className="px-4 py-3 text-center">
                            {Math.random() > 0.6 ? (
                              <ArrowUp className="h-4 w-4 text-green-400 inline-block" />
                            ) : Math.random() > 0.3 ? (
                              <Minus className="h-4 w-4 text-yellow-400 inline-block" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-red-400 inline-block" />
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </div>
    </div>
  )
}
