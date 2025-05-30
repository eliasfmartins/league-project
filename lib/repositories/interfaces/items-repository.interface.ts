export interface Item {
  id: string
  name: string
  description: string
  plaintext: string
  gold: {
    base: number
    total: number
    sell: number
    purchasable: boolean
  }
  image: {
    full: string
    sprite: string
    group: string
  }
  tags: string[]
  stats: Record<string, number>
  effect?: {
    Effect1Amount: string
    Effect2Amount?: string
    Effect3Amount?: string
    Effect4Amount?: string
    Effect5Amount?: string
  }
  maps: Record<string, boolean>
  depth?: number
  from?: string[]
  into?: string[]
}

export interface IItemsRepository {
  getAllItems(): Promise<Record<string, Item>>
  getItemImageUrl(version: string, itemImage: string): string
  getRecommendedBuilds(championId: string): Promise<any>
  categorizeItems(items: Record<string, Item>): Record<string, Item[]>
}
