"use client"

import {
  ArrowLeft,
  Shield,
  Sword,
  Zap,
  Heart,
  Droplet,
  FastForward,
  Crosshair,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface ChampionDetailClientProps {
  champion: {
    id: string
    name: string
    title: string
    roles: string[]
    image?: string
    splash?: string
    difficulty: number
  }
  abilities: {
    name: string
    description: string
    icon: string
  }[]
  lore: string
  formattedChampionId: string
  stats: {
    attack: number
    defense: number
    magic: number
    difficulty: number
  }
  apiData?: any
  additionalStats?: {
    hp: number
    mp: number
    movespeed: number
    armor: number
    spellblock: number
    attackrange: number
    hpregen: number
    mpregen: number
    attackdamage: number
    attackspeed: number
  } | null
}

export default function ChampionDetailClient({
  champion,
  abilities,
  lore,
  formattedChampionId,
  stats,
  apiData,
  additionalStats,
}: ChampionDetailClientProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [selectedSkin, setSelectedSkin] = useState(0)
  const [showFullLore, setShowFullLore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [preloadedImages, setPreloadedImages] = useState<Record<number, boolean>>({})
  const [backgroundTransition, setBackgroundTransition] = useState(false)

  // Obter skins do campeão da API ou usar padrão
  const skins = apiData?.skins || [
    { id: "0", num: 0, name: "default", chromas: false },
    { id: "1", num: 1, name: `${champion.name} Skin 1`, chromas: false },
    { id: "2", num: 2, name: `${champion.name} Skin 2`, chromas: false },
  ]

  // Rolar para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo(0, 0)

    // Simular tempo de carregamento para garantir que todos os dados estejam prontos
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Pré-carregar todas as imagens de skins
  useEffect(() => {
    if (!pageLoaded) return

    // Função para pré-carregar uma imagem
    const preloadImage = (skinNum: number) => {
      const img = new window.Image()
      img.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedChampionId}_${skinNum}.jpg`

      img.onload = () => {
        setPreloadedImages((prev) => ({ ...prev, [skinNum]: true }))

        // Se for a primeira skin, desativar o loading
        if (skinNum === selectedSkin) {
          setIsLoading(false)
        }
      }

      img.onerror = () => {
        setPreloadedImages((prev) => ({ ...prev, [skinNum]: true }))

        // Mesmo com erro, desativar o loading para a skin atual
        if (skinNum === selectedSkin) {
          setIsLoading(false)
        }
      }
    }

    // Pré-carregar todas as skins, começando pela selecionada
    preloadImage(selectedSkin)

    // Depois pré-carregar as outras skins
    skins.forEach((skin) => {
      if (skin.num !== selectedSkin) {
        setTimeout(() => preloadImage(skin.num), 300 * (skin.num + 1))
      }
    })
  }, [pageLoaded, formattedChampionId, selectedSkin, skins])

  // Função para truncar a lore para exibição inicial
  const truncateLore = (text: string, maxLength = 300) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const goBackToChampions = () => {
    router.push("/champions")
  }

  // Funções para o carrossel de skins
  const scrollCarousel = (direction: "left" | "right") => {
    // Calcular o próximo índice de skin a ser selecionado
    const currentIndex = skins.findIndex((skin) => skin.num === selectedSkin)
    let nextIndex = currentIndex

    if (direction === "left") {
      nextIndex = Math.max(0, currentIndex - 1)
    } else {
      nextIndex = Math.min(skins.length - 1, currentIndex + 1)
    }

    // Ativar transição de fundo
    setBackgroundTransition(true)

    // Atualizar a skin selecionada
    setSelectedSkin(skins[nextIndex].num)

    // Desativar transição após um tempo
    setTimeout(() => {
      setBackgroundTransition(false)
    }, 1000)
  }

  // Função para selecionar uma skin específica
  const handleSkinSelect = (skinNum: number) => {
    if (skinNum === selectedSkin) return

    // Ativar transição de fundo
    setBackgroundTransition(true)

    // Atualizar a skin selecionada
    setSelectedSkin(skinNum)

    // Desativar transição após um tempo
    setTimeout(() => {
      setBackgroundTransition(false)
    }, 1000)
  }

  // Mostrar tela de carregamento enquanto os dados não estão prontos
  if (!pageLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#091428] to-[#0A1428]">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Hexágono central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-[#091428] border-2 border-[#C8AA6E] rotate-45 animate-pulse"></div>
            </div>

            {/* Logo LoL */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-[#C8AA6E] text-3xl font-bold">LoL</span>
            </div>

            {/* Hexágonos orbitando */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-[#C8AA6E]"
                style={{
                  top: `${50 + 35 * Math.sin((2 * Math.PI * i) / 6 + Date.now() / 1000)}%`,
                  left: `${50 + 35 * Math.cos((2 * Math.PI * i) / 6 + Date.now() / 1000)}%`,
                  animation: `orbit ${2 + i * 0.5}s infinite linear`,
                }}
              ></div>
            ))}
          </div>

          <h2 className="text-[#C8AA6E] text-xl font-bold mb-2">Carregando Campeão</h2>
          <p className="text-[#A09B8C] mb-4">Preparando detalhes épicos...</p>

          {/* Barra de progresso estilizada */}
          <div className="w-64 h-2 bg-[#1E2328] rounded-full mx-auto overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-[#C8AA6E] to-[#F0E6D2] animate-progress-bar"></div>
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-white/30 animate-shimmer"></div>
          </div>

          {/* Dica aleatória */}
          <p className="mt-8 text-sm text-[#A09B8C] max-w-xs mx-auto italic">
            "Conhecer os detalhes de cada campeão é o primeiro passo para a maestria."
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gradient-to-b from-[#121212] to-[#1a1a1a]" : "bg-gradient-to-b from-[#091428] to-[#0A1428]"}`}
    >
      <div className="relative h-[90vh] w-full overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C8AA6E]"></div>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSkin}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              y: backgroundTransition ? -20 : 0, // Movimento sutil para cima durante a transição
            }}
            exit={{ opacity: 0, filter: "blur(8px)", scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedChampionId}_${selectedSkin}.jpg`}
              alt={champion.name}
              fill
              className="object-cover object-top"
              priority
              onError={(e) => {
                e.currentTarget.src = `/images/champions/default.jpg`
              }}
              onLoad={() => setIsLoading(false)}
            />

            {/* Efeito de partículas/brilho aprimorado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay"></div>

            {/* Efeito de transição especial */}
            {backgroundTransition && (
              <motion.div
                className="absolute inset-0 bg-[#C8AA6E]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            )}

            {/* Partículas flutuantes */}
            {backgroundTransition &&
              [...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-[#C8AA6E]"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    y: [null, -100 - Math.random() * 200],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1 + Math.random(), 0],
                  }}
                  transition={{
                    duration: 1 + Math.random() * 1.5,
                  }}
                />
              ))}
          </motion.div>
        </AnimatePresence>

        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-transparent via-[#121212]/30 to-[#121212]" : "bg-gradient-to-b from-transparent via-[#091428]/30 to-[#091428]"}`}
        />

        {/* Decorative elements */}
        <div
          className={`absolute inset-x-0 bottom-0 h-16 ${isDark ? "bg-gradient-to-t from-[#121212] to-transparent" : "bg-gradient-to-t from-[#091428] to-transparent"}`}
        />
        <div
          className={`absolute left-0 top-0 h-full w-64 ${isDark ? "bg-gradient-to-r from-[#121212]/80 to-transparent" : "bg-gradient-to-r from-[#091428]/80 to-transparent"}`}
        />

        <div className="absolute bottom-0 left-0 p-6 md:p-10 z-10 w-full">
          <div className="max-w-[1200px] mx-auto">
            {/* Melhorar o botão de voltar na página de campeão */}
            <motion.button
              onClick={goBackToChampions}
              className="mb-4 inline-flex items-center text-sm bg-[#C8AA6E]/10 hover:bg-[#C8AA6E]/20 px-4 py-3 rounded-md border border-[#C8AA6E]/30 text-[#C8AA6E] hover:text-[#F0E6D2] transition-all duration-300 group"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:mr-3 transition-all" />
              <span className="font-medium">{t("backToChampions")}</span>
            </motion.button>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <motion.h1
                  className="font-cyber text-4xl font-bold tracking-wider text-[#C8AA6E] md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {champion.name}
                </motion.h1>

                <motion.p
                  className="text-xl text-[#A09B8C]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {champion.title}
                </motion.p>

                <motion.div
                  className="mt-4 flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {champion.roles &&
                    champion.roles.map((role) => (
                      <span
                        key={role}
                        className={`rounded-sm ${isDark ? "bg-[#1a1a1a]/50" : "bg-[#0A323C]/50"} px-3 py-1 text-sm font-medium text-[#C8AA6E] backdrop-blur-sm border border-[#C8AA6E]/30`}
                      >
                        {t(role.toLowerCase())}
                      </span>
                    ))}
                </motion.div>
              </div>

              {/* Seção de skins - Carrossel 3D aprimorado */}
              <div className="mt-6 md:mt-0 md:w-[50%] lg:w-[40%] relative" style={{ marginTop: "20px" }}>
                <div className="relative">
                  <button
                    onClick={() => scrollCarousel("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 rounded-full p-2 text-[#C8AA6E] hover:bg-[#C8AA6E]/20 backdrop-blur-sm"
                    disabled={selectedSkin === skins[0].num}
                    style={{ opacity: selectedSkin === skins[0].num ? 0.5 : 1 }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Carrossel 3D aprimorado */}
                  <div className="h-[360px] relative flex items-center justify-center perspective-1000 overflow-visible">
                    {skins.map((skin, index) => {
                      // Calcular a posição relativa ao skin selecionado
                      const currentIndex = skins.findIndex((s) => s.num === selectedSkin)
                      const distance = index - currentIndex
                      const absDistance = Math.abs(distance)

                      // Não renderizar skins muito distantes do atual para melhorar performance
                      if (absDistance > 2) return null

                      // Definir transformações 3D baseadas na distância
                      const zIndex = 20 - absDistance
                      const opacity = 1 - absDistance * 0.2 // Menos transparência
                      const scale = 1.2 - absDistance * 0.15 // Aumentado em 20%
                      const rotateY = distance * 25 // Rotação em graus
                      const translateZ = -100 * absDistance // Profundidade
                      const translateX = distance * 80 // Deslocamento horizontal aumentado

                      return (
                        <motion.div
                          key={skin.id}
                          className="absolute flex-shrink-0 w-48 cursor-pointer" // Aumentado de w-40 para w-48
                          style={{
                            zIndex,
                            opacity,
                            transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                            transformStyle: "preserve-3d",
                            transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            pointerEvents: absDistance > 0 ? "none" : "auto", // Desativar interação para cards não selecionados
                          }}
                          onClick={() => handleSkinSelect(skin.num)}
                        >
                          <div
                            className={`relative h-72 w-48 rounded-md overflow-hidden transform transition-all duration-500 ${
                              selectedSkin === skin.num
                                ? "border-2 border-[#C8AA6E] shadow-[0_0_15px_rgba(200,170,110,0.7)]"
                                : "border border-[#785A28]/50"
                            }`}
                          >
                            <Image
                              src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${formattedChampionId}_${skin.num}.jpg`}
                              alt={skin.name !== "default" ? skin.name : `${champion.name} Default`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback para a imagem padrão se a skin não existir
                                e.currentTarget.src = `/images/champions/default.jpg`
                              }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent`} />

                            {selectedSkin === skin.num && (
                              <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-[#C8AA6E] animate-pulse-gold" />
                            )}

                            {/* Nome da skin */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-center">
                              <p className="text-xs text-white truncate">
                                {skin.name !== "default" ? skin.name : `Default`}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => scrollCarousel("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 rounded-full p-2 text-[#C8AA6E] hover:bg-[#C8AA6E]/20 backdrop-blur-sm"
                    disabled={selectedSkin === skins[skins.length - 1].num}
                    style={{ opacity: selectedSkin === skins[skins.length - 1].num ? 0.5 : 1 }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Miniaturas para seleção direta */}
                <div className="flex justify-center mt-4 gap-2">
                  {skins.slice(0, Math.min(5, skins.length)).map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => handleSkinSelect(skin.num)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedSkin === skin.num ? "bg-[#C8AA6E] w-4" : "bg-[#785A28]/50 hover:bg-[#C8AA6E]/50"
                      }`}
                      aria-label={`Select skin ${skin.name}`}
                    />
                  ))}
                  {skins.length > 5 && <span className="text-[#C8AA6E] text-xs">+{skins.length - 5}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 py-8 mt-20 relative z-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <section
              className={`mb-8 rounded-sm border border-[#785A28]/50 ${isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"} p-6 shadow-lg backdrop-blur-sm`}
            >
              <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-2xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                {t("lore")}
              </h2>
              <div>
                <p className="text-[#A09B8C] leading-relaxed">{showFullLore ? lore : truncateLore(lore, 500)}</p>
                {lore && lore.length > 500 && (
                  <Button
                    onClick={() => setShowFullLore(!showFullLore)}
                    variant="outline"
                    className="mt-4 hextech-button"
                  >
                    {showFullLore ? "Show Less" : "Read Full Lore"}
                  </Button>
                )}
              </div>
            </section>

            <section
              className={`mb-8 rounded-sm border border-[#785A28]/50 ${isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"} p-6 shadow-lg backdrop-blur-sm`}
            >
              <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-2xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                {t("abilities")}
              </h2>
              <div className="space-y-6">
                {abilities &&
                  abilities.map((ability, index) => (
                    <motion.div
                      key={ability.name || index}
                      className={`flex gap-4 transition-all duration-300 hover:${isDark ? "bg-[#222222]/30" : "bg-[#0A323C]/30"} p-3 rounded-sm`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm border border-[#785A28]">
                        <Image
                          src={ability.icon || "/placeholder.svg"}
                          alt={ability.name || `Ability ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `/images/abilities/${index === 0 ? "passive" : ["q", "w", "e", "r"][index - 1]}.jpg`
                          }}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br from-transparent to-${isDark ? "[#121212]" : "[#091428]"}/30`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[#C8AA6E]">{ability.name || `Ability ${index + 1}`}</h3>
                        <p className="text-sm text-[#A09B8C]">{ability.description || "No description available."}</p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </section>
          </div>

          <div>
            <section
              className={`mb-8 rounded-sm border border-[#785A28]/50 ${isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"} p-6 shadow-lg backdrop-blur-sm`}
            >
              <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                {t("championStats")}
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sword className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-[#A09B8C]">{t("attack")}</span>
                    </div>
                    <span className="text-sm font-medium text-[#C8AA6E]">{stats?.attack || 0}/10</span>
                  </div>
                  <div
                    className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                  >
                    <motion.div
                      className="h-full rounded-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats?.attack || 0) * 10}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-[#A09B8C]">{t("defense")}</span>
                    </div>
                    <span className="text-sm font-medium text-[#C8AA6E]">{stats?.defense || 0}/10</span>
                  </div>
                  <div
                    className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                  >
                    <motion.div
                      className="h-full rounded-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats?.defense || 0) * 10}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-[#A09B8C]">{t("magic")}</span>
                    </div>
                    <span className="text-sm font-medium text-[#C8AA6E]">{stats?.magic || 0}/10</span>
                  </div>
                  <div
                    className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                  >
                    <motion.div
                      className="h-full rounded-full bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats?.magic || 0) * 10}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#A09B8C]">{t("difficulty")}</span>
                    </div>
                    <span className="text-sm font-medium text-[#C8AA6E]">{stats?.difficulty || 0}/10</span>
                  </div>
                  <div
                    className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                  >
                    <motion.div
                      className="h-full rounded-full bg-[#C8AA6E]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats?.difficulty || 0) * 10}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {additionalStats && (
              <section
                className={`mb-8 rounded-sm border border-[#785A28]/50 ${isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"} p-6 shadow-lg backdrop-blur-sm`}
              >
                <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                  Detailed Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-[#A09B8C]">Health:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.hp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-[#A09B8C]">Mana:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.mp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FastForward className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-[#A09B8C]">Move Speed:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.movespeed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-[#A09B8C]">Armor:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.armor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-[#A09B8C]">Magic Resist:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.spellblock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-[#A09B8C]">Attack Range:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.attackrange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-[#A09B8C]">HP Regen:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.hpregen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm text-[#A09B8C]">MP Regen:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.mpregen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sword className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-[#A09B8C]">Attack Damage:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.attackdamage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FastForward className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-[#A09B8C]">Attack Speed:</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{additionalStats.attackspeed.toFixed(2)}</span>
                  </div>
                </div>
              </section>
            )}

            {apiData?.allytips && apiData.allytips.length > 0 && (
              <section
                className={`mb-8 rounded-sm border border-[#785A28]/50 ${isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"} p-6 shadow-lg backdrop-blur-sm`}
              >
                <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                  Playing as {champion.name}
                </h2>
                <ul className="space-y-2 list-disc pl-5">
                  {apiData.allytips.map((tip: string, index: number) => (
                    <li key={index} className="text-sm text-[#A09B8C]">
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {apiData?.enemytips && apiData.enemytips.length > 0 && (
              <section
                className={`mb-8 rounded-sm border border-[#785A28]/50 ${isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"} p-6 shadow-lg backdrop-blur-sm`}
              >
                <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                  Playing against {champion.name}
                </h2>
                <ul className="space-y-2 list-disc pl-5">
                  {apiData.enemytips.map((tip: string, index: number) => (
                    <li key={index} className="text-sm text-[#A09B8C]">
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
