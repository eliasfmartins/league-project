"use client"
import SearchFilter from "@/components/search-filter"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "@/components/theme-provider"
import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

export default function ChampionsPageClient({ champions }: { champions: any[] }) {
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8) // Reduzido para 8 cards iniciais
  const [isLoading, setIsLoading] = useState(false)

  const LOAD_INCREMENT = 8 // Reduzido para 8 por vez

  // Filter champions based on search term
  const filteredChampions = useMemo(() => {
    if (!searchTerm) return champions

    return champions.filter(
      (champion) =>
        champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        champion.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [champions, searchTerm])

  // Campeões que serão renderizados
  const visibleChampions = useMemo(() => {
    return filteredChampions.slice(0, visibleCount)
  }, [filteredChampions, visibleCount])

  // Handle search term changes
  const handleSearch = useCallback((term: string) => {
    setIsSearching(true)
    setSearchTerm(term)
    setVisibleCount(8) // Reset para 8 cards

    setTimeout(() => {
      setIsSearching(false)
    }, 300)
  }, [])

  // Função para carregar mais campeões
  const loadMore = useCallback(() => {
    if (isLoading || visibleCount >= filteredChampions.length) return

    setIsLoading(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + LOAD_INCREMENT, filteredChampions.length))
      setIsLoading(false)
    }, 300)
  }, [isLoading, visibleCount, filteredChampions.length])

  // Scroll event handler
  const handleScroll = useCallback(() => {
    if (isLoading || visibleCount >= filteredChampions.length) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Carregar mais quando estiver próximo do final (200px antes)
    if (scrollTop + windowHeight >= documentHeight - 200) {
      loadMore()
    }
  }, [loadMore, isLoading, visibleCount, filteredChampions.length])

  // Adicionar/remover scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Reset visible count when search changes
  useEffect(() => {
    if (searchTerm) {
      setVisibleCount(8)
    }
  }, [searchTerm])

  return (
    <div
      className="min-h-screen"
      style={{
        background: isDark
          ? "linear-gradient(to bottom, #121212, #1a1a1a)"
          : "linear-gradient(to bottom, #091428, #0A1428)",
        borderTop: !isDark ? "1px solid rgba(200, 170, 110, 0.3)" : "none",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row max-w-[1200px] mx-auto">
          <div>
            <Link
              href="/"
              className="mb-2 inline-flex items-center text-sm text-[#C8AA6E] hover:text-[#F0E6D2]"
              style={{ border: "none" }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToHome")}
            </Link>
            <h1 className="font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl">
              {t("allChampions")}
            </h1>
            <p className="mt-2 text-[#A09B8C]">
              Showing {visibleChampions.length} of {filteredChampions.length} champions
            </p>
          </div>
          <SearchFilter onSearch={handleSearch} />
        </div>

        {/* Container com max-width para os cards */}
        <div className="mx-auto max-w-[1200px]">
          {/* Grid de campeões com animação - 4 cards por linha */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" layout>
            {visibleChampions.map((champion, index) => (
              <motion.div
                key={champion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index > visibleCount - LOAD_INCREMENT ? (index - (visibleCount - LOAD_INCREMENT)) * 0.05 : 0,
                }}
                layout
              >
                <Link href={`/champions/${champion.id}`}>
                  <motion.div
                    className={`card-3d relative h-80 cursor-pointer overflow-hidden rounded-lg border border-[#785A28]/30 ${
                      isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
                    } shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(200,170,110,0.3)]`}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={champion.image || "/placeholder.svg"}
                        alt={champion.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="font-cyber text-xl font-bold tracking-wider text-[#C8AA6E]">{champion.name}</h3>
                        <p className="text-sm text-[#A09B8C]">{champion.title}</p>
                      </motion.div>

                      <motion.div
                        className="mt-2 flex flex-wrap gap-2"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {champion.roles?.map((role: string) => (
                          <span
                            key={role}
                            className={`rounded-full ${
                              isDark ? "bg-[#222222]/50" : "bg-[#0A323C]/50"
                            } px-2 py-1 text-xs font-medium text-[#C8AA6E] backdrop-blur-sm border border-[#C8AA6E]/30`}
                          >
                            {role}
                          </span>
                        ))}
                      </motion.div>
                    </div>

                    <div
                      className={`absolute right-3 top-3 rounded-full ${
                        isDark ? "bg-[#222222]/30" : "bg-[#0A323C]/30"
                      } p-1 backdrop-blur-sm border border-[#C8AA6E]/30`}
                    >
                      <div className="h-2 w-2 rounded-full bg-[#C8AA6E] animate-pulse" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center">
              <motion.div
                className="h-8 w-8 rounded-full border-t-2 border-b-2 border-[#C8AA6E]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <p className="text-[#C8AA6E] mt-2 text-sm">Loading more champions...</p>
            </div>
          </motion.div>
        )}

        {/* Mensagem quando todos os campeões foram carregados */}
        {!isLoading && visibleCount >= filteredChampions.length && filteredChampions.length > 0 && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#785A28]/50 bg-[#0A1428]/50 px-4 py-2">
              <motion.div
                className="h-2 w-2 rounded-full bg-[#C8AA6E]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-[#C8AA6E] text-sm">
                {searchTerm
                  ? `Found ${filteredChampions.length} ${filteredChampions.length === 1 ? "champion" : "champions"}`
                  : `All ${filteredChampions.length} champions loaded`}
              </span>
            </div>
          </motion.div>
        )}

        {/* No champions found */}
        {!isSearching && filteredChampions.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-4xl text-[#C8AA6E] mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              ¯\_(ツ)_/¯
            </motion.div>
            <h3 className="text-xl font-cyber text-[#C8AA6E] mb-2">No Champions Found</h3>
            <p className="text-[#A09B8C] max-w-md">
              We couldn't find any champions matching your search. Try adjusting your search criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
