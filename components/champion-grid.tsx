"use client"
import Link from "next/link"
import ChampionCard from "@/components/champion-card"
import { motion } from "framer-motion"

interface ChampionGridProps {
  champions: any[]
  isLoading?: boolean
  limit?: number
  fallbackToStatic?: boolean
}

export default function ChampionGrid({ champions, isLoading = false, limit }: ChampionGridProps) {
  // Aplicar limite se especificado, senão usar 8 como padrão
  const displayedChampions = limit ? champions.slice(0, limit) : champions.slice(0, 8)

  // Loading animation for champions
  const ChampionLoadingState = () => (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-sm border border-[#785A28]/30 bg-[#0A1428]/50 overflow-hidden">
            <div className="aspect-[3/4] relative bg-gradient-to-b from-[#0A1428] to-[#091428] animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-t-[#C8AA6E] border-r-[#C8AA6E]/50 border-b-[#C8AA6E]/30 border-l-[#C8AA6E]/10 animate-spin"></div>
              </div>
            </div>
            <div className="p-3">
              <div className="h-5 bg-[#C8AA6E]/20 rounded-sm animate-pulse mb-2"></div>
              <div className="h-4 bg-[#C8AA6E]/10 rounded-sm animate-pulse w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // No champions found state
  const NoChampionsFound = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl text-[#C8AA6E] mb-4">¯\_(ツ)_/¯</div>
      <h3 className="text-xl font-cyber text-[#C8AA6E] mb-2">No Champions Found</h3>
      <p className="text-[#A09B8C] max-w-md">
        We couldn't find any champions matching your search. Try adjusting your search criteria.
      </p>
    </div>
  )

  if (isLoading) {
    return <ChampionLoadingState />
  }

  if (displayedChampions.length === 0) {
    return <NoChampionsFound />
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedChampions.map((champion, index) => (
          <motion.div
            key={champion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/champions/${champion.id}`}>
              <ChampionCard champion={champion} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
