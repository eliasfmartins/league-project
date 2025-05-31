import ChampionGrid from "@/components/champion-grid"
import FeaturedCarousel from "@/components/featured-carousel"
import { HeroSection } from "@/components/hero-section"
import SearchFilter from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getAllChampions, convertApiChampionsToAppFormat } from "@/lib/api"
import { championsData } from "@/lib/champions-data"
import { Suspense } from "react"
import LoadingSpinner from "@/components/loading-spinner"

export default async function Home() {
  // Tentar buscar dados atualizados da API
  let champions = championsData
  let error = false

  try {
    const apiChampions = await getAllChampions()
    if (apiChampions && Object.keys(apiChampions).length > 0) {
      champions = convertApiChampionsToAppFormat(apiChampions)
    }
  } catch (e) {
    console.error("Erro ao buscar campeões da API:", e)
    error = true
    // Fallback para os dados estáticos
  }

  return (
    <main className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto max-w-[1200px] px-4 py-12">
        <section className="mb-16">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="relative">
              <h2 className="font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl text-center">
                TOP CHAMPIONS BY ROLE
              </h2>
              <div className="absolute -bottom-2 left-0 h-0.5 w-24 bg-[#785A28]"></div>
            </div>
            <div className="w-full md:w-auto">
              <SearchFilter />
            </div>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedCarousel />
          </Suspense>
        </section>

        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between flex-col sm:flex-row gap-8">
            <div className="relative">
              <h2 className="font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl text-center">
                CHAMPION ROSTER
              </h2>
              <div className="absolute -bottom-2 left-0 h-0.5 w-24 bg-[#785A28] mx-auto"></div>
            </div>
            <Link href="/champions">
              <Button variant="outline" className="hextech-button group">
                View All Champions
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <ChampionGrid champions={champions} limit={8} fallbackToStatic={error} />
          </Suspense>

          {/* Botão adicional para ver mais campeões */}
          <div className="mt-8 flex justify-center">
            <Link href="/champions">
              <Button className="hextech-button group">
                Explore All {champions.length} Champions
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-16 rounded-sm border border-[#785A28]/50 dark:bg-[#1a1a1a]/50 bg-[#0A1428]/50 p-8 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="mb-4 font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl">
                JOIN THE COMMUNITY
              </h2>
              <p className="mb-6 text-lg text-[#A09B8C]">
                Share your strategies, discuss the latest patches, and connect with other summoners in our community
                forum.
              </p>
              <Link href="/forum">
                <Button className="hextech-button group">
                  Visit Forum
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-[#C8AA6E]/20 md:h-64 md:w-64">
              <div className="absolute inset-0 flex items-center justify-center dark:bg-[#222222]/30 bg-[#0A323C]/30 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8AA6E]/10 to-transparent animate-rotate opacity-70"></div>
                <span className="font-cyber text-4xl font-bold text-[#C8AA6E] md:text-5xl">FORUM</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
