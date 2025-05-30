import type { IItemsRepository, Item } from "../interfaces/items-repository.interface"

export class ItemsRepository implements IItemsRepository {
  private championRepository: any

  constructor(championRepository: any) {
    this.championRepository = championRepository
  }

  async getAllItems(): Promise<Record<string, Item>> {
    try {
      const version = await this.championRepository.getLatestVersion()
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`)

      if (!response.ok) throw new Error("Failed to fetch items")

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching items:", error)
      return {} // Return empty object in case of error
    }
  }

  getItemImageUrl(version: string, itemImage: string): string {
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemImage}`
  }

  async getRecommendedBuilds(championId: string): Promise<any> {
    // Dados simulados de builds recomendadas
    const recommendedBuilds = {
      aatrox: {
        starter: ["1054", "2003"],
        core: ["3074", "3053", "3071"],
        situational: ["3026", "3065", "3143"],
        boots: ["3111", "3047"],
        winRate: "52.3%",
        pickRate: "8.7%",
        lanes: [
          { name: "Top", winRate: "53.1%", pickRate: "92.3%" },
          { name: "Jungle", winRate: "48.7%", pickRate: "7.7%" },
        ],
      },
      ahri: {
        starter: ["1056", "2003"],
        core: ["3165", "3089", "3157"],
        situational: ["3135", "3116", "3152"],
        boots: ["3020", "3158"],
        winRate: "51.8%",
        pickRate: "7.2%",
        lanes: [
          { name: "Mid", winRate: "51.9%", pickRate: "98.1%" },
          { name: "Support", winRate: "47.2%", pickRate: "1.9%" },
        ],
      },
      yasuo: {
        starter: ["1055", "2003"],
        core: ["3031", "3036", "3072"],
        situational: ["3139", "3156", "3026"],
        boots: ["3006", "3047"],
        winRate: "49.5%",
        pickRate: "12.3%",
        lanes: [
          { name: "Mid", winRate: "49.8%", pickRate: "67.4%" },
          { name: "Top", winRate: "48.9%", pickRate: "32.6%" },
        ],
      },
      // Dados genéricos para outros campeões
      default: {
        starter: ["1055", "2003"],
        core: ["3031", "3036", "3072"],
        situational: ["3139", "3156", "3026"],
        boots: ["3006", "3047"],
        winRate: "50.0%",
        pickRate: "5.0%",
        lanes: [
          { name: "Mid", winRate: "50.0%", pickRate: "50.0%" },
          { name: "Top", winRate: "50.0%", pickRate: "50.0%" },
        ],
      },
    }

    // Retorna os dados específicos do campeão ou os dados padrão
    return recommendedBuilds[championId as keyof typeof recommendedBuilds] || recommendedBuilds.default
  }

  categorizeItems(items: Record<string, Item>): Record<string, Item[]> {
    const categories: Record<string, Item[]> = {
      Starter: [],
      Basic: [],
      Epic: [],
      Legendary: [],
      Mythic: [],
      Boots: [],
      Consumable: [],
      Trinket: [],
    }

    // Track items by name to remove duplicates (keep most expensive)
    const uniqueItems: Record<string, Item> = {}

    Object.values(items).forEach((item) => {
      // Skip items without gold data
      if (!item.gold) return

      // Handle duplicates - keep the most expensive version
      if (uniqueItems[item.name]) {
        if (item.gold.total > uniqueItems[item.name].gold.total) {
          uniqueItems[item.name] = { ...item, id: item.id }
        }
      } else {
        uniqueItems[item.name] = { ...item, id: item.id }
      }
    })

    // Now categorize the unique items
    Object.values(uniqueItems).forEach((item) => {
      const itemWithId = { ...item, id: item.id }

      if (item.tags && item.tags.includes("Boots")) {
        categories.Boots.push(itemWithId)
      } else if (item.tags && item.tags.includes("Consumable")) {
        categories.Consumable.push(itemWithId)
      } else if (item.tags && item.tags.includes("Trinket")) {
        categories.Trinket.push(itemWithId)
      } else if (item.description && item.description.includes("Mythic")) {
        categories.Mythic.push(itemWithId)
      } else if (!item.from && item.into) {
        categories.Basic.push(itemWithId)
      } else if (item.from && !item.into) {
        categories.Legendary.push(itemWithId)
      } else if (item.from && item.into) {
        categories.Epic.push(itemWithId)
      } else if (item.gold.total < 500) {
        categories.Starter.push(itemWithId)
      } else {
        categories.Basic.push(itemWithId)
      }
    })

    return categories
  }
}
