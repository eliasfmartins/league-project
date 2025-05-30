"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

interface ChampionCardProps {
  champion: {
    id: string
    name: string
    title: string
    roles: string[]
    image: string
    difficulty: number
  }
}

export default function ChampionCard({ champion }: ChampionCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const { t } = useLanguage()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Função para determinar a imagem correta com fallback
  const getChampionImage = () => {
    // Se já tentamos e falhou, ou se não tem imagem, usar padrão
    if (imageError || !champion.image) {
      return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id.charAt(0).toUpperCase() + champion.id.slice(1)}_0.jpg`
    }
    // Tente a imagem original
    return champion.image
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const mouseX = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const mouseY = Math.max(0, Math.min(100, (y / rect.height) * 100))

    setMousePosition({ x: mouseX, y: mouseY })

    // Aplicar efeito 3D
    if (cardRef.current) {
      const rotateY = ((mouseX - 50) / 50) * 10 // -10 a 10 graus
      const rotateX = ((50 - mouseY) / 50) * 10 // -10 a 10 graus

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Resetar a transformação quando o mouse sai
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
    }
  }

  const navigateToChampion = () => {
    router.push(`/champions/${champion.id}`)
  }

  return (
    <div
      ref={cardRef}
      className={`card-3d relative h-80 cursor-pointer overflow-hidden rounded-lg border border-[#785A28]/30 ${isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"} shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(200,170,110,0.3)]`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={navigateToChampion}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}
    >
      <div
        className="card-3d-content relative h-full w-full"
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={getChampionImage() || "/placeholder.svg"}
            alt={champion.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              setImageError(true)
            }}
            priority={champion.id === "aatrox" || champion.id === "ahri"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className={`transform transition-transform duration-300 ${isHovered ? "translate-y-[-20px]" : ""}`}>
            <h3 className="font-cyber text-xl font-bold tracking-wider text-[#C8AA6E]">{champion.name}</h3>
            <p className="text-sm text-[#A09B8C]">{champion.title}</p>
          </div>

          <div
            className={`mt-2 flex flex-wrap gap-2 transform transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
            }`}
          >
            {champion.roles.map((role) => (
              <span
                key={role}
                className={`rounded-full ${isDark ? "bg-[#222222]/50" : "bg-[#0A323C]/50"} px-2 py-1 text-xs font-medium text-[#C8AA6E] backdrop-blur-sm border border-[#C8AA6E]/30`}
              >
                {t(role.toLowerCase())}
              </span>
            ))}
            <div className="mt-3 flex w-full items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-[#A09B8C]">{t("difficultyLabel")}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        i < champion.difficulty ? "bg-[#C8AA6E]" : isDark ? "bg-[#333333]" : "bg-[#3C3C41]",
                      )}
                    />
                  ))}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#C8AA6E]" />
            </div>
          </div>
        </div>

        <div
          className={`absolute right-3 top-3 rounded-full ${isDark ? "bg-[#222222]/30" : "bg-[#0A323C]/30"} p-1 backdrop-blur-sm border border-[#C8AA6E]/30`}
        >
          <div className="h-2 w-2 rounded-full bg-[#C8AA6E] animate-pulse-gold" />
        </div>

        {/* Borda brilhante quando hover */}
        <div
          className={`absolute inset-0 border-2 rounded-lg transition-all duration-300 ${
            isHovered ? "border-[#C8AA6E]/70" : "border-transparent"
          }`}
        />

        {/* Efeito de brilho que segue o mouse */}
        <div
          className="card-3d-shine rounded-lg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 80%)`,
            opacity: isHovered ? 1 : 0,
            pointerEvents: "none",
            transition: "opacity 0.3s",
          }}
        />
      </div>
    </div>
  )
}
