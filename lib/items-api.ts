// API para buscar itens do League of Legends - usando repositories
import { itemsRepository } from "./repositories"

// Re-export types and functions from the repository to maintain compatibility
export type { Item } from "./repositories/interfaces/items-repository.interface"

export const getAllItems = () => itemsRepository.getAllItems()
export const getItemImageUrl = (version: string, itemImage: string) =>
  itemsRepository.getItemImageUrl(version, itemImage)
export const getRecommendedBuilds = (championId: string) => itemsRepository.getRecommendedBuilds(championId)
export const categorizeItems = (items: Record<string, any>) => itemsRepository.categorizeItems(items)
