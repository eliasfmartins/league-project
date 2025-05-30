import ChampionsPageClient from "@/components/champions-page-client"
import { getAllChampions, convertApiChampionsToAppFormat } from "@/lib/api"
import { championsData } from "@/lib/champions-data"

export default async function ChampionsPage() {
  // Tentar buscar dados atualizados da API
  let champions = championsData

  try {
    const apiChampions = await getAllChampions()
    if (apiChampions && Object.keys(apiChampions).length > 0) {
      champions = convertApiChampionsToAppFormat(apiChampions)
    }
  } catch (error) {
    console.error("Erro ao buscar campeões da API:", error)
    // Fallback para os dados estáticos
  }

  return <ChampionsPageClient champions={champions} />
}
