import ItemsPageClient from "@/components/items-page-client"
import { getAllItems, categorizeItems } from "@/lib/items-api"
import { getLatestVersion } from "@/lib/api"
import { getAllChampions, convertApiChampionsToAppFormat } from "@/lib/api"
import { championsData } from "@/lib/champions-data"

export default async function ItemsPage() {
  // Get the latest version
  const version = await getLatestVersion()

  // Get all items (always in English now)
  const items = await getAllItems()

  // Categorize the items
  const categorizedItems = categorizeItems(items)

  // Get champions to show who uses each item
  let champions = championsData
  try {
    const apiChampions = await getAllChampions()
    if (apiChampions && Object.keys(apiChampions).length > 0) {
      champions = convertApiChampionsToAppFormat(apiChampions)
    }
  } catch (error) {
    console.error("Error fetching champions from API:", error)
  }

  // Create simulated associations of items to champions
  const itemChampionAssociations: Record<string, string[]> = {}

  Object.keys(items).forEach((itemId) => {
    // Randomly select 3-6 champions who "use" this item
    const numChampions = Math.floor(Math.random() * 4) + 3
    const shuffled = [...champions].sort(() => 0.5 - Math.random())
    const selectedChampions = shuffled.slice(0, numChampions)

    itemChampionAssociations[itemId] = selectedChampions.map((c) => c.id)
  })

  return (
    <ItemsPageClient
      version={version}
      items={items}
      categorizedItems={categorizedItems}
      champions={champions}
      itemChampionAssociations={itemChampionAssociations}
    />
  )
}
