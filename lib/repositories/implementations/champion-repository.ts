import type { IChampionRepository } from "../interfaces/champion-repository.interface"

export class ChampionRepository implements IChampionRepository {
  async getLatestVersion(): Promise<string> {
    try {
      const response = await fetch("https://ddragon.leagueoflegends.com/api/versions.json")
      if (!response.ok) {
        throw new Error(`API retornou status ${response.status}`)
      }
      const versions = await response.json()
      return versions[0]
    } catch (error) {
      console.error("Erro ao buscar a versão mais recente:", error)
      return "13.1.1" // Versão padrão como fallback
    }
  }

  async getAllChampions(): Promise<any> {
    try {
      const version = await this.getLatestVersion()
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching all champions:", error)
      return null
    }
  }

  async getChampionDetails(championId: string, options?: any): Promise<any> {
    try {
      const version = await this.getLatestVersion()

      // Format the champion ID correctly (first letter uppercase)
      const formattedChampionId = championId.charAt(0).toUpperCase() + championId.slice(1).toLowerCase()

      // Check special cases
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

      const finalChampionId = specialCases[championId.toLowerCase()] || formattedChampionId

      // Make the request with enhanced error handling
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${finalChampionId}.json`,
        {
          headers: { Accept: "application/json" },
          cache: "force-cache",
        },
      )

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      // Check content type before parsing
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Unexpected content type: ${contentType}`)
      }

      // Try to parse the JSON with error handling
      try {
        const text = await response.text()
        const data = JSON.parse(text)
        return data.data[finalChampionId]
      } catch (parseError) {
        console.error(`Error parsing JSON for ${championId}:`, parseError)
        throw new Error(`Failed to process champion data: ${parseError.message}`)
      }
    } catch (error) {
      console.error(`Error fetching champion details for ${championId}:`, error)

      // Return simulated data as fallback
      return {
        id: championId,
        name: championId.charAt(0).toUpperCase() + championId.slice(1),
        title: "The Champion",
        lore: "This champion is currently unavailable. Please try again later.",
        blurb: "Data temporarily unavailable.",
        info: { attack: 5, defense: 5, magic: 5, difficulty: 5 },
        image: { full: `${championId}.png` },
        tags: ["Fighter"],
        stats: {
          hp: 600,
          mp: 300,
          movespeed: 335,
          armor: 30,
          spellblock: 30,
          attackrange: 150,
          hpregen: 8,
          mpregen: 7,
          attackdamage: 65,
          attackspeed: 0.65,
        },
        spells: [
          { name: "Q Ability", description: "Description unavailable", image: { full: "ability.png" } },
          { name: "W Ability", description: "Description unavailable", image: { full: "ability.png" } },
          { name: "E Ability", description: "Description unavailable", image: { full: "ability.png" } },
          { name: "R Ability", description: "Description unavailable", image: { full: "ability.png" } },
        ],
        passive: { name: "Passive", description: "Description unavailable", image: { full: "passive.png" } },
        skins: [
          { id: "0", num: 0, name: "default", chromas: false },
          {
            id: "1",
            num: 1,
            name: `${championId.charAt(0).toUpperCase() + championId.slice(1)} Skin 1`,
            chromas: false,
          },
          {
            id: "2",
            num: 2,
            name: `${championId.charAt(0).toUpperCase() + championId.slice(1)} Skin 2`,
            chromas: false,
          },
        ],
      }
    }
  }

  convertApiChampionsToAppFormat(apiChampions: any): any[] {
    return Object.values(apiChampions).map((champion: any) => ({
      id: champion.id.toLowerCase(),
      name: champion.name,
      title: champion.title,
      roles: champion.tags,
      image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`,
      splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`,
      difficulty: champion.info.difficulty > 7 ? 3 : champion.info.difficulty > 4 ? 2 : 1,
    }))
  }

  async getChampionStats(championId: string): Promise<any> {
    // Simular uma chamada de API
    return {
      winRate: (45 + Math.random() * 10).toFixed(1) + "%",
      pickRate: (1 + Math.random() * 15).toFixed(1) + "%",
      banRate: (Math.random() * 10).toFixed(1) + "%",
      kda: (2 + Math.random() * 2).toFixed(2),
      averageKills: (5 + Math.random() * 7).toFixed(1),
      averageDeaths: (3 + Math.random() * 4).toFixed(1),
      averageAssists: (4 + Math.random() * 8).toFixed(1),
      csPerMin: (6 + Math.random() * 3).toFixed(1),
      goldPerMin: (300 + Math.random() * 150).toFixed(0),
      averageDamage: Math.floor(15000 + Math.random() * 10000),
    }
  }

  async getChampionMatchups(championId: string, allChampions: any[]): Promise<any> {
    // Selecionar campeões contra os quais este campeão tem vantagem
    const strongAgainst = [...allChampions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((c) => ({
        ...c,
        winRateAgainst: (55 + Math.random() * 15).toFixed(1) + "%",
      }))

    // Selecionar campeões contra os quais este campeão tem desvantagem
    const weakAgainst = [...allChampions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((c) => ({
        ...c,
        winRateAgainst: (30 + Math.random() * 15).toFixed(1) + "%",
      }))

    return {
      strongAgainst,
      weakAgainst,
    }
  }

  async getChampionStatsByLane(championId: string, lane: string): Promise<any> {
    // Simular uma chamada de API
    return {
      lane,
      winRate: (45 + Math.random() * 10).toFixed(1) + "%",
      pickRate: (1 + Math.random() * 15).toFixed(1) + "%",
      banRate: (Math.random() * 10).toFixed(1) + "%",
      kda: (2 + Math.random() * 2).toFixed(2),
    }
  }

  async getChampionBuilds(championId: string): Promise<any> {
    // Simular uma chamada de API
    return [
      {
        name: "Most Popular Build",
        items: ["3078", "3111", "3053", "3065", "3026", "3194"],
        winRate: (50 + Math.random() * 5).toFixed(1) + "%",
        pickRate: (15 + Math.random() * 10).toFixed(1) + "%",
      },
      {
        name: "Highest Win Rate Build",
        items: ["3078", "3047", "3053", "3071", "3026", "3143"],
        winRate: (55 + Math.random() * 5).toFixed(1) + "%",
        pickRate: (5 + Math.random() * 5).toFixed(1) + "%",
      },
      {
        name: "Situational Build",
        items: ["3078", "3047", "3065", "3071", "3156", "3139"],
        winRate: (48 + Math.random() * 7).toFixed(1) + "%",
        pickRate: (3 + Math.random() * 5).toFixed(1) + "%",
      },
    ]
  }
}
