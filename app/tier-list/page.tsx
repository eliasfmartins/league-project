import TierListClient from "@/components/tier-list-client"
import { getAllChampions, convertApiChampionsToAppFormat } from "@/lib/api"
import { championsData } from "@/lib/champions-data"

export default async function TierListPage() {
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

  // Adicionar win rates simulados para cada campeão
  const championsWithWinRates = champions.map((champion) => {
    // Gerar win rate aleatório entre 45% e 55%
    const winRate = (45 + Math.random() * 10).toFixed(1)

    // Determinar tier com base no win rate
    let tier = "C"
    if (Number.parseFloat(winRate) >= 53) tier = "S"
    else if (Number.parseFloat(winRate) >= 51) tier = "A"
    else if (Number.parseFloat(winRate) >= 49) tier = "B"
    else if (Number.parseFloat(winRate) < 47) tier = "D"

    // Atribuir uma rota principal aleatória
    const lanes = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"]
    const mainLane = lanes[Math.floor(Math.random() * lanes.length)]

    // Atribuir rotas secundárias (0-2 rotas adicionais)
    const secondaryLanesCount = Math.floor(Math.random() * 3)
    const remainingLanes = lanes.filter((lane) => lane !== mainLane)
    const secondaryLanes = []

    for (let i = 0; i < secondaryLanesCount; i++) {
      if (remainingLanes.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingLanes.length)
        secondaryLanes.push(remainingLanes[randomIndex])
        remainingLanes.splice(randomIndex, 1)
      }
    }

    return {
      ...champion,
      winRate: `${winRate}%`,
      tier,
      pickRate: `${(1 + Math.random() * 15).toFixed(1)}%`,
      banRate: `${(Math.random() * 10).toFixed(1)}%`,
      mainLane,
      secondaryLanes,
    }
  })

  // Organizar campeões por rota
  const championsByLane = {
    TOP: championsWithWinRates
      .filter((c) => c.mainLane === "TOP" || c.secondaryLanes.includes("TOP"))
      .sort((a, b) => Number.parseFloat(b.winRate) - Number.parseFloat(a.winRate)),
    JUNGLE: championsWithWinRates
      .filter((c) => c.mainLane === "JUNGLE" || c.secondaryLanes.includes("JUNGLE"))
      .sort((a, b) => Number.parseFloat(b.winRate) - Number.parseFloat(a.winRate)),
    MID: championsWithWinRates
      .filter((c) => c.mainLane === "MID" || c.secondaryLanes.includes("MID"))
      .sort((a, b) => Number.parseFloat(b.winRate) - Number.parseFloat(a.winRate)),
    ADC: championsWithWinRates
      .filter((c) => c.mainLane === "ADC" || c.secondaryLanes.includes("ADC"))
      .sort((a, b) => Number.parseFloat(b.winRate) - Number.parseFloat(a.winRate)),
    SUPPORT: championsWithWinRates
      .filter((c) => c.mainLane === "SUPPORT" || c.secondaryLanes.includes("SUPPORT"))
      .sort((a, b) => Number.parseFloat(b.winRate) - Number.parseFloat(a.winRate)),
  }

  return <TierListClient champions={championsWithWinRates} championsByLane={championsByLane} />
}
