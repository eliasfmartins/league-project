"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { featuredChampions } from "@/lib/featured-champions"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import { getAllChampions, convertApiChampionsToAppFormat } from "@/lib/api"

// Flatten the array for carousel
const ALL_FEATURED = Object.values(featuredChampions).flat()

export default function FeaturedCarousel() {
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageHeight, setImageHeight] = useState("md:h-[550px] h-[450px]") 
  const carouselRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { t } = useLanguage()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [champions, setChampions] = useState(ALL_FEATURED)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch champions with highest win rates
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        setIsLoading(true)
        const apiChampions = await getAllChampions()
        if (apiChampions && Object.keys(apiChampions).length > 0) {
          const formattedChampions = convertApiChampionsToAppFormat(apiChampions)

          // Simulate win rates for demonstration
          const withWinRates = formattedChampions.map((champ) => ({
            ...champ,
            winRate: (50 + Math.random() * 10).toFixed(1) + "%",
            role: ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"][Math.floor(Math.random() * 5)],
          }))

          withWinRates.sort(
            (a, b) => Number.parseFloat(b.winRate.replace("%", "")) - Number.parseFloat(a.winRate.replace("%", "")),
          )

          const topByRole: Record<string, any[]> = {
            TOP: [],
            JUNGLE: [],
            MID: [],
            ADC: [],
            SUPPORT: [],
          }

          withWinRates.forEach((champ) => {
            if (topByRole[champ.role].length < 3) {
              topByRole[champ.role].push(champ)
            }
          })

          const featuredChamps = Object.values(topByRole).flat()
          setChampions(featuredChamps.length > 0 ? featuredChamps : ALL_FEATURED)
        }
      } catch (error) {
        console.error("Error fetching champions for carousel:", error)
        // Fallback to static data
        setChampions(ALL_FEATURED)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChampions()
  }, [])

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % champions.length
    setActiveIndex(newIndex)
  }

  const handlePrev = () => {
    const newIndex = (activeIndex - 1 + champions.length) % champions.length
    setActiveIndex(newIndex)
  }

  const navigateToChampion = (championId: string) => {
    router.push(`/champions/${championId}`)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (!isPaused) {
      interval = setInterval(() => {
        handleNext()
      }, 5000)
    }

    return () => clearInterval(interval)
  }, [isPaused, activeIndex, champions.length])

  useEffect(() => {
    controls.start({
      x: -activeIndex * 100 + "%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    })
  }, [activeIndex, controls])

  // Ajustar a altura do carrossel para mostrar a imagem completa
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setImageHeight("md:h-[550px] h-[450px]")
      } else {
        setImageHeight("h-[450px]")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return

    const rect = carouselRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const mouseX = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const mouseY = Math.max(0, Math.min(100, (y / rect.height) * 100))

    setMousePosition({ x: mouseX, y: mouseY })
  }

  if (isLoading) {
    return (
      <div className="carousel-container relative overflow-hidden border border-[#785A28]/50 shadow-lg rounded-md max-w-[1200px] mx-auto">
        <div className={`w-full ${imageHeight} relative overflow-hidden flex items-center justify-center`}>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C8AA6E]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="carousel-container relative overflow-hidden border border-[#785A28]/50 shadow-lg rounded-md max-w-[1200px] mx-auto">
      <div
        className={`w-full ${imageHeight} relative overflow-hidden`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false)
          setMousePosition({ x: 50, y: 50 })
          setHoveredIndex(null)
        }}
        onMouseMove={handleMouseMove}
        ref={carouselRef}
      >
        <AnimatePresence initial={false}>
          <motion.div className="flex h-full" animate={controls} initial={{ x: 0 }}>
            {champions.map((champion, index) => (
              <motion.div
                key={champion.id + index}
                className={`carousel-item relative min-w-full h-full transition-all duration-300 ${hoveredIndex === index ? "border-2 border-[#C8AA6E]" : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-3d-content relative h-full w-full overflow-hidden">
                  <Image
                    src={champion.image || "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg"}
                    alt={champion.name}
                    fill
                    className={`object-cover object-top transition-transform duration-500 ${hoveredIndex === index ? "scale-105" : ""}`} // Alterado para object-contain para mostrar a imagem inteira
                    sizes="100vw"
                    priority={index < 2}
                    onLoad={() => {
                      if (index === 0) setIsLoaded(true)
                    }}
                    onError={(e) => {
                      // Fallback to default image
                      e.currentTarget.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id.charAt(0).toUpperCase() + champion.id.slice(1)}_0.jpg`
                    }}
                  />
                  <div
                    className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-[#121212]/80 via-[#121212]/60 to-transparent" : "bg-gradient-to-r from-[#091428]/80 via-[#091428]/60 to-transparent"}`}
                  />
                </div>

                <div className="absolute bottom-0 left-0 p-6 text-white md:p-8 z-10">
                  <div
                    className={`mb-2 inline-block rounded-sm ${isDark ? "bg-[#1a1a1a]/20" : "bg-[#C8AA6E]/20"} px-2 py-1 text-xs font-bold backdrop-blur-sm border border-[#C8AA6E]/30`}
                  >
                    {t(champion.role.toLowerCase())}
                  </div>
                  <h3 className="font-cyber text-2xl font-bold tracking-wider text-[#C8AA6E] md:text-3xl">
                    {champion.name}
                  </h3>
                  <p className="mb-2 text-sm text-[#A09B8C] md:text-base">{champion.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#A09B8C]">{t("winRate")}:</span>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        Number.parseFloat(champion.winRate) > 51
                          ? "text-green-400"
                          : Number.parseFloat(champion.winRate) < 50
                            ? "text-red-400"
                            : "text-yellow-400",
                      )}
                    >
                      {champion.winRate}
                    </span>
                  </div>
                  <button
                    onClick={() => navigateToChampion(champion.id)}
                    className="mt-4 inline-flex items-center rounded-sm bg-[#C8AA6E] px-4 py-2 text-sm font-medium text-[#091428] transition-colors hover:bg-[#F0E6D2]"
                  >
                    {t("viewDetails")}
                  </button>
                </div>

                {/* Efeito de brilho que segue o mouse */}
                <div
                  className="card-3d-shine rounded-lg"
                  style={
                    {
                      "--mouse-x": `${mousePosition.x}%`,
                      "--mouse-y": `${mousePosition.y}%`,
                      opacity: hoveredIndex === index ? 1 : 0,
                    } as React.CSSProperties
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={handlePrev}
        className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full ${isDark ? "bg-[#121212]/50" : "bg-[#091428]/50"} p-2 text-[#C8AA6E] backdrop-blur-sm transition-colors ${isDark ? "hover:bg-[#121212]/70" : "hover:bg-[#091428]/70"} border border-[#C8AA6E]/30 z-20`}
        aria-label="Previous champion"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={handleNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full ${isDark ? "bg-[#121212]/50" : "bg-[#091428]/50"} p-2 text-[#C8AA6E] backdrop-blur-sm transition-colors ${isDark ? "hover:bg-[#121212]/70" : "hover:bg-[#091428]/70"} border border-[#C8AA6E]/30 z-20`}
        aria-label="Next champion"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 z-10">
        {champions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              activeIndex === index ? "bg-[#C8AA6E] w-4" : "bg-[#A09B8C]/50",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
