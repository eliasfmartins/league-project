import { ChampionRepository } from "./implementations/champion-repository"
import { ItemsRepository } from "./implementations/items-repository"

// Create singleton instances
const championRepository = new ChampionRepository()
const itemsRepository = new ItemsRepository(championRepository)

// Export repository instances
export { championRepository, itemsRepository }

// Export interfaces for type checking
export type { IChampionRepository } from "./interfaces/champion-repository.interface"
export type { IItemsRepository, Item } from "./interfaces/items-repository.interface"
