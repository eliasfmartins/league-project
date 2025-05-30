import StatisticsClient from "@/components/statistics-client"
import { getAllChampions, convertApiChampionsToAppFormat } from "@/lib/api"
import { championsData } from "@/lib/champions-data"

export default async function StatisticsPage() {
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

  // Simular dados de estatísticas para cada campeão
  const championsWithStats = champions.map((champion) => {
    // Gerar win rate aleatório entre 45% e 55%
    const winRate = (45 + Math.random() * 10).toFixed(1)

    // Gerar pick rate aleatório entre 1% e 15%
    const pickRate = (1 + Math.random() * 14).toFixed(1)

    // Gerar ban rate aleatório entre 0% e 10%
    const banRate = (Math.random() * 10).toFixed(1)

    // Selecionar campeões contra os quais este campeão tem vantagem
    const strongAgainst = [...champions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((c) => ({
        ...c,
        winRateAgainst: (55 + Math.random() * 15).toFixed(1) + "%",
      }))

    // Selecionar campeões contra os quais este campeão tem desvantagem
    const weakAgainst = [...champions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((c) => ({
        ...c,
        winRateAgainst: (30 + Math.random() * 15).toFixed(1) + "%",
      }))

    // Atribuir uma rota principal aleatória
    const lanes = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"]
    const mainLane = lanes[Math.floor(Math.random() * lanes.length)]

    return {
      ...champion,
      winRate: `${winRate}%`,
      pickRate: `${pickRate}%`,
      banRate: `${banRate}%`,
      strongAgainst,
      weakAgainst,
      mainLane,
      kda: (2 + Math.random() * 2).toFixed(2),
      csPerMin: (6 + Math.random() * 3).toFixed(1),
      goldPerMin: (300 + Math.random() * 150).toFixed(0),
      averageDamage: Math.floor(15000 + Math.random() * 10000),
      averageKills: (5 + Math.random() * 7).toFixed(1),
      averageDeaths: (3 + Math.random() * 4).toFixed(1),
      averageAssists: (4 + Math.random() * 8).toFixed(1),
    }
  })

  return <StatisticsClient champions={championsWithStats} />
}
