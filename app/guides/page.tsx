import GuidesClient from "@/components/guides-client"
import { getAllChampions, convertApiChampionsToAppFormat } from "@/lib/api"
import { championsData } from "@/lib/champions-data"

export default async function GuidesPage() {
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

  // Selecionar alguns campeões aleatórios para guias em destaque
  const shuffled = [...champions].sort(() => 0.5 - Math.random())
  const featuredGuides = shuffled.slice(0, 6)

  // Criar guias simulados para todos os campeões
  const allGuides = champions.map((champion) => ({
    id: `guide-${champion.id}`,
    championId: champion.id,
    title: `Ultimate ${champion.name} Guide: Dominate with ${champion.roles[0]}`,
    author: `Pro${champion.name}`,
    date: `${Math.floor(Math.random() * 30) + 1} days ago`,
    difficulty: champion.difficulty,
    views: Math.floor(Math.random() * 10000) + 1000,
    likes: Math.floor(Math.random() * 1000) + 100,
    description: `Learn how to master ${champion.name} with our comprehensive guide. Includes builds, runes, matchups, and advanced strategies.`,
  }))

  return <GuidesClient featuredGuides={featuredGuides} allGuides={allGuides} champions={champions} />
}
