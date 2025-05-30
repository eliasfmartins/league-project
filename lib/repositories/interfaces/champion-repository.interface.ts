export interface IChampionRepository {
  getLatestVersion(): Promise<string>
  getAllChampions(): Promise<any>
  getChampionDetails(championId: string, options?: any): Promise<any>
  convertApiChampionsToAppFormat(apiChampions: any): any[]
  getChampionStats(championId: string): Promise<any>
  getChampionMatchups(championId: string, allChampions: any[]): Promise<any>
  getChampionStatsByLane(championId: string, lane: string): Promise<any>
  getChampionBuilds(championId: string): Promise<any>
}
