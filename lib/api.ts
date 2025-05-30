// Atualizar o arquivo lib/api.ts para usar os repositories
import { championRepository } from "./repositories"

// Re-export all functions from the repository to maintain compatibility
export const getLatestVersion = () => championRepository.getLatestVersion()
export const getAllChampions = () => championRepository.getAllChampions()
export const getChampionDetails = (championId: string, options?: any) =>
  championRepository.getChampionDetails(championId, options)
export const convertApiChampionsToAppFormat = (apiChampions: any) =>
  championRepository.convertApiChampionsToAppFormat(apiChampions)
export const getChampionStats = (championId: string) => championRepository.getChampionStats(championId)
export const getChampionMatchups = (championId: string, allChampions: any[]) =>
  championRepository.getChampionMatchups(championId, allChampions)
export const getChampionStatsByLane = (championId: string, lane: string) =>
  championRepository.getChampionStatsByLane(championId, lane)
export const getChampionBuilds = (championId: string) => championRepository.getChampionBuilds(championId)
