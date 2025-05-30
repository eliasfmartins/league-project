import { Suspense } from "react"
import ChampionDetailClient from "@/components/champion-detail-client"
import { getChampionDetails, getLatestVersion } from "@/lib/api"
import ChampionLoading from "@/components/champion-loading"

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

// Obter as habilidades do campeão baseado no ID
const getAbilities = async (championId: string, apiData: any = null) => {
  const formattedId = formatChampionId(championId)

  // Se temos dados da API, usamos eles
  if (apiData && apiData.spells && apiData.passive) {
    const version = await getLatestVersion()

    return [
      {
        name: apiData.passive.name,
        description: apiData.passive.description,
        icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${apiData.passive.image.full}`,
      },
      ...apiData.spells.map((spell: any) => ({
        name: spell.name,
        description: spell.description,
        icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`,
      })),
    ]
  }

  // Caso contrário, usamos os dados estáticos
  return [
    {
      name: "Passive",
      description: "Unique passive ability that enhances the champion's gameplay.",
      icon: `/images/abilities/passive.jpg`,
    },
    {
      name: "Q Ability",
      description: "Primary damage or utility ability.",
      icon: `/images/abilities/q.jpg`,
    },
    {
      name: "W Ability",
      description: "Secondary ability providing crowd control, damage or defensive benefits.",
      icon: `/images/abilities/w.jpg`,
    },
    {
      name: "E Ability",
      description: "Tertiary ability often focused on mobility or utility.",
      icon: `/images/abilities/e.jpg`,
    },
    {
      name: "R Ultimate",
      description: "Powerful ultimate ability that defines the champion's playstyle.",
      icon: `/images/abilities/r.jpg`,
    },
  ]
}

// Obter a lore do campeão
const getChampionLore = (championId: string, apiData: any = null) => {
  // Se temos dados da API, usamos a lore da API
  if (apiData && apiData.lore) {
    return apiData.lore
  }

  // Caso contrário, usamos os dados estáticos
  return "Champion lore is currently unavailable. Please check back later for the complete story of this champion."
}

// Componente principal da página
const ChampionPage = async ({ params }: { params: { id: string } }) => {
  try {
    const championId = params.id.toLowerCase()

    // Formatar o ID do campeão para exibição
    const formattedChampionId = formatChampionId(championId)

    // Buscar detalhes do campeão
    const championDetails = await getChampionDetails(championId, { locale: "en_US" })

    // Preparar dados para o componente cliente
    const abilities = await getAbilities(championId, championDetails)
    const lore = getChampionLore(championId, championDetails)

    // Preparar estatísticas básicas
    const stats = {
      attack: championDetails?.info?.attack || 5,
      defense: championDetails?.info?.defense || 5,
      magic: championDetails?.info?.magic || 5,
      difficulty: championDetails?.info?.difficulty || 5,
    }

    // Preparar dados adicionais
    const additionalStats = championDetails?.stats
      ? {
          hp: Math.round(championDetails.stats.hp),
          mp: Math.round(championDetails.stats.mp),
          movespeed: championDetails.stats.movespeed,
          armor: Math.round(championDetails.stats.armor),
          spellblock: Math.round(championDetails.stats.spellblock),
          attackrange: championDetails.stats.attackrange,
          hpregen: championDetails.stats.hpregen.toFixed(1),
          mpregen: championDetails.stats.mpregen.toFixed(1),
          attackdamage: Math.round(championDetails.stats.attackdamage),
          attackspeed: championDetails.stats.attackspeed,
        }
      : null

    // Preparar dados do campeão
    const champion = {
      id: championId,
      name: championDetails?.name || formattedChampionId,
      title: championDetails?.title || "The Champion",
      roles: championDetails?.tags || ["Fighter"],
      image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedChampionId}_0.jpg`,
      splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedChampionId}_0.jpg`,
      difficulty: championDetails?.info?.difficulty > 7 ? 3 : championDetails?.info?.difficulty > 4 ? 2 : 1,
    }

    return (
      <Suspense fallback={<ChampionLoading />}>
        <ChampionDetailClient
          champion={champion}
          abilities={abilities}
          lore={lore}
          formattedChampionId={formattedChampionId}
          stats={stats}
          apiData={championDetails}
          additionalStats={additionalStats}
        />
      </Suspense>
    )
  } catch (error) {
    console.error(`Erro ao renderizar página do campeão ${params.id}:`, error)

    // Retornar uma página de erro amigável
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#091428] to-[#0A1428]">
        <div className="bg-[#0A1428]/80 border border-[#785A28] rounded-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#C8AA6E] mb-4">Champion not found</h1>
          <p className="text-[#A09B8C] mb-6">
            We couldn't load the details for champion "{params.id}". Please try again later.
          </p>
          <a
            href="/champions"
            className="inline-block bg-[#C8AA6E] hover:bg-[#F0E6D2] text-[#0A1428] font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Back to champions list
          </a>
        </div>
      </div>
    )
  }
}

export default ChampionPage
