import ChampionItemsClient from "@/components/champion-items-client"
import { getAllItems } from "@/lib/items-api"
import { getChampionDetails, getLatestVersion } from "@/lib/api"
import { getRecommendedBuilds } from "@/lib/items-api"

// Função para formatar o ID do campeão para o formato correto do DDragon
const formatChampionId = (id: string) => {
  // Casos especiais para nomes compostos
  const specialCases: Record<string, string> = {
    aurelionsol: "AurelionSol",
    drmundo: "DrMundo",
    jarvaniv: "JarvanIV",
    kogmaw: "KogMaw",
    leesin: "LeeSin",
    masteryi: "MasterYi",
    missfortune: "MissFortune",
    nunu: "Nunu",
    reksai: "RekSai",
    tahmkench: "TahmKench",
    twistedfate: "TwistedFate",
    xinzhao: "XinZhao",
    monkeyking: "MonkeyKing", // Wukong
    khazix: "Khazix",
    chogath: "Chogath",
    velkoz: "Velkoz",
  }

  if (specialCases[id.toLowerCase()]) {
    return specialCases[id.toLowerCase()]
  }

  return id.charAt(0).toUpperCase() + id.slice(1)
}

export default async function ChampionItemsPage({ params }: { params: { id: string } }) {
  // Buscar a versão mais recente
  const version = await getLatestVersion()

  // Buscar detalhes do campeão
  const formattedId = formatChampionId(params.id)
  const championDetails = await getChampionDetails(formattedId)

  // Buscar todos os itens
  const items = await getAllItems()

  // Buscar builds recomendadas para o campeão
  const recommendedBuilds = await getRecommendedBuilds(params.id)

  return (
    <ChampionItemsClient
      version={version}
      championId={params.id}
      formattedChampionId={formattedId}
      championDetails={championDetails}
      items={items}
      recommendedBuilds={recommendedBuilds}
    />
  )
}
