"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { ArrowLeft, Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { getItemImageUrl } from "@/lib/items-api"
import type { Item } from "@/lib/items-api"
import { motion } from "framer-motion"

// Item categories
const categories = [
  "All",
  "Armor",
  "AttackSpeed",
  "Consumable",
  "CriticalStrike",
  "Damage",
  "Health",
  "LifeSteal",
  "MagicResistance",
  "Mana",
  "MoveSpeed",
  "NonbootsMovement",
  "OnHit",
  "SpellDamage",
  "SpellVamp",
  "Tenacity",
  "Trinket",
  "Vision",
]

interface ItemsPageClientProps {
  version: string
  items: Record<string, Item>
  categorizedItems: Record<string, Item[]>
  champions: any[]
  itemChampionAssociations: Record<string, string[]>
}

export default function ItemsPageClient({
  version,
  items,
  categorizedItems,
  champions,
  itemChampionAssociations,
}: ItemsPageClientProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [visibleItemsCount, setVisibleItemsCount] = useState(20)
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [sortBy, setSortBy] = useState<string>("name")

  // Function to filter complete items - using useMemo to avoid unnecessary recalculations
  const filteredItems = useMemo(() => {
    if (!items) return []

    // Create a map to track unique items by name (keeping the most expensive version)
    const uniqueItemsMap = new Map<string, Item>()

    Object.values(items).forEach((item) => {
      if (!item || !item.gold || !item.name) return

      // If we already have this item name, keep the more expensive one
      if (uniqueItemsMap.has(item.name)) {
        const existingItem = uniqueItemsMap.get(item.name)!
        if (item.gold.total > existingItem.gold.total) {
          uniqueItemsMap.set(item.name, item)
        }
      } else {
        uniqueItemsMap.set(item.name, item)
      }
    })

    // Convert the map back to an array and apply filters
    return Array.from(uniqueItemsMap.values())
      .filter((item) => {
        // Check if the item has the necessary properties
        if (!item || !item.gold || !item.name) return false

        // Filter only complete items (not components)
        const isCompleteItem = item.gold.total >= 1000 || (item.gold.total >= 400 && !item.into)

        // Apply category filters
        const matchesCategory = selectedCategory === "All" || (item.tags && item.tags.includes(selectedCategory))

        // Apply search filter
        const matchesSearch =
          searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))

        return isCompleteItem && matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        // Sort by price or name
        if (sortBy === "price") {
          return b.gold.total - a.gold.total
        }
        return a.name.localeCompare(b.name)
      })
  }, [items, selectedCategory, searchTerm, sortBy])

  // Visible items based on pagination
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleItemsCount)
  }, [filteredItems, visibleItemsCount])

  // Reset visible items when filters change
  useEffect(() => {
    setVisibleItemsCount(20)
  }, [selectedCategory, searchTerm, sortBy])

  // Set up intersection observer for infinite loading
  useEffect(() => {
    // Clear previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create a new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loading && visibleItemsCount < filteredItems.length) {
          setLoading(true)
          // Use setTimeout to simulate loading and avoid UI blocking
          setTimeout(() => {
            setVisibleItemsCount((prev) => Math.min(prev + 20, filteredItems.length))
            setLoading(false)
          }, 500)
        }
      },
      { threshold: 0.1 },
    )

    // Observe the reference element
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    // Clean up the observer when the component is unmounted
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loading, visibleItemsCount, filteredItems.length])

  // Função para obter os componentes de um item
  const getItemComponents = (itemId: string) => {
    const item = items[itemId]
    if (!item || !item.from) return []
    return item.from.map((id) => items[id]).filter(Boolean)
  }

  // Função para obter os itens que este item compõe
  const getItemBuildsInto = (itemId: string) => {
    const item = items[itemId]
    if (!item || !item.into) return []
    return item.into.map((id) => items[id]).filter(Boolean)
  }

  // Function to handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  // Enhanced loading spinner component
  const EnhancedLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-t-[#C8AA6E] border-r-[#C8AA6E]/50 border-b-[#C8AA6E]/30 border-l-[#C8AA6E]/10 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-[#C8AA6E]/80 border-r-[#C8AA6E]/40 border-b-[#C8AA6E]/20 border-l-transparent rounded-full animate-spin animation-delay-150"></div>
        <div className="absolute inset-4 border-4 border-t-[#C8AA6E]/60 border-r-[#C8AA6E]/30 border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-300"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-[#C8AA6E] rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-4 text-[#C8AA6E] font-cyber">LOADING ITEMS...</p>
      <p className="text-[#A09B8C] text-sm mt-2">Gathering the finest equipment from the Summoner's Rift</p>
    </div>
  )

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
            LEAGUE OF LEGENDS ITEMS
          </h1>
          <p className="mt-2 text-[#A09B8C]">
            Explore all items in the game and find the best builds for your champions
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#C8AA6E]" />
            <Input
              type="search"
              placeholder="Search items..."
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
        </div>

        {/* Filter buttons by category with tech design */}
        <div className="mb-8">
          <h2 className="text-xl font-cyber font-bold text-[#C8AA6E] mb-4">Filter by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`
                  relative overflow-hidden group transition-all duration-300
                  ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-[#C8AA6E]/30 to-[#C8AA6E]/10 border-[#C8AA6E] text-[#F0E6D2]"
                      : "bg-[#091428]/60 border-[#785A28]/50 text-[#C8AA6E] hover:bg-[#091428]/80"
                  }
                  border px-3 py-3 rounded-sm
                `}
              >
                {/* Glow effect */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-r from-[#C8AA6E]/0 via-[#C8AA6E]/20 to-[#C8AA6E]/0 
                    transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000
                    ${selectedCategory === category ? "opacity-100" : "opacity-0"}
                  `}
                ></div>

                {/* Illuminated border effect */}
                {selectedCategory === category && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8AA6E] to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8AA6E] to-transparent"></div>
                    <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#C8AA6E] to-transparent"></div>
                    <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#C8AA6E] to-transparent"></div>
                  </>
                )}

                {/* Button content */}
                <div className="relative z-10 flex items-center justify-center">
                  <span className="font-medium">{category}</span>
                </div>

                {/* Selection indicator */}
                {selectedCategory === category && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-[#C8AA6E] transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <EnhancedLoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {visibleItems.map((item) => (
                <motion.div
                  key={item.id || item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-sm border border-[#785A28]/50 ${
                    isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
                  } p-4 hover:border-[#C8AA6E] hover:shadow-[0_0_10px_rgba(200,170,110,0.3)] transition-all cursor-pointer`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative h-16 w-16 mb-3">
                      <Image
                        src={getItemImageUrl(version, item.image?.full) || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-center text-sm font-medium text-[#C8AA6E] mb-1">{item.name}</h3>
                    <p className="text-center text-xs text-[#A09B8C]">{item.gold?.total || 0} gold</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reference element for infinite scroll */}
            {filteredItems.length > visibleItemsCount && (
              <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center mt-4">
                {loading && (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C8AA6E]"></div>
                    <p className="text-[#C8AA6E] mt-2">Loading more items...</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {filteredItems.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl text-[#C8AA6E] mb-4">¯\_(ツ)_/¯</div>
            <h3 className="text-xl font-cyber text-[#C8AA6E] mb-2">No Items Found</h3>
            <p className="text-[#A09B8C] max-w-md">
              We couldn't find any items matching your search. Try adjusting your search criteria.
            </p>
          </div>
        )}

        {/* Replace the entire modal section (when selectedItem is true) with this improved version */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className={`w-full max-w-2xl rounded-sm border border-[#785A28] ${
                isDark ? "bg-[#1a1a1a]" : "bg-[#091428]"
              } p-4 shadow-xl`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Header with item name and close button */}
              <div className="flex items-center justify-between mb-4 border-b border-[#785A28]/30 pb-2">
                <h2 className="text-xl font-bold text-[#C8AA6E]">{selectedItem.name}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-[#C8AA6E] hover:text-[#F0E6D2] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Item details in a compact layout */}
              <div className="flex gap-4">
                {/* Left column - Image and basic info */}
                <div className="flex-shrink-0">
                  <div className="relative h-16 w-16 mb-2 border border-[#785A28]/50 p-1 bg-[#0A1428]/50">
                    <Image
                      src={getItemImageUrl(version, selectedItem.image?.full) || "/placeholder.svg"}
                      alt={selectedItem.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#C8AA6E]">{selectedItem.gold?.total || 0} gold</p>
                    {selectedItem.gold?.sell > 0 && (
                      <p className="text-xs text-[#A09B8C]">Sells: {selectedItem.gold.sell}</p>
                    )}
                  </div>
                </div>

                {/* Right column - Description and tags */}
                <div className="flex-1">
                  <div
                    className="text-sm text-[#A09B8C] mb-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar"
                    dangerouslySetInnerHTML={{ __html: selectedItem.description || "" }}
                  />

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#0A323C]/50 px-2 py-0.5 text-xs font-medium text-[#C8AA6E] border border-[#C8AA6E]/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Item components and builds into */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Components section */}
                {selectedItem.from && selectedItem.from.length > 0 && (
                  <div className="border border-[#785A28]/30 rounded-sm p-2">
                    <h3 className="text-sm font-medium text-[#C8AA6E] mb-2 border-b border-[#785A28]/30 pb-1">
                      Builds From:
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {getItemComponents(selectedItem.id).map((component) => (
                        <div
                          key={component.id}
                          className="flex items-center gap-2 p-1 rounded-sm border border-[#785A28]/20 bg-[#0A1428]/30"
                        >
                          <div className="relative h-6 w-6 flex-shrink-0">
                            <Image
                              src={getItemImageUrl(version, component.image?.full) || "/placeholder.svg"}
                              alt={component.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-medium text-[#C8AA6E] truncate">{component.name}</p>
                            <p className="text-xs text-[#A09B8C]">{component.gold?.total || 0} g</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Builds into section */}
                {selectedItem.into && selectedItem.into.length > 0 && (
                  <div className="border border-[#785A28]/30 rounded-sm p-2">
                    <h3 className="text-sm font-medium text-[#C8AA6E] mb-2 border-b border-[#785A28]/30 pb-1">
                      Builds Into:
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {getItemBuildsInto(selectedItem.id).map((upgrade) => (
                        <div
                          key={upgrade.id}
                          className="flex items-center gap-2 p-1 rounded-sm border border-[#785A28]/20 bg-[#0A1428]/30"
                        >
                          <div className="relative h-6 w-6 flex-shrink-0">
                            <Image
                              src={getItemImageUrl(version, upgrade.image?.full) || "/placeholder.svg"}
                              alt={upgrade.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-medium text-[#C8AA6E] truncate">{upgrade.name}</p>
                            <p className="text-xs text-[#A09B8C]">{upgrade.gold?.total || 0} g</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
