"use client"

import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getItemImageUrl } from "@/lib/items-api"
import type { Item } from "@/lib/items-api"

interface ChampionItemsClientProps {
  version: string
  championId: string
  formattedChampionId: string
  championDetails: any
  items: Record<string, Item>
  recommendedBuilds: any
}

export default function ChampionItemsClient({
  version,
  championId,
  formattedChampionId,
  championDetails,
  items,
  recommendedBuilds,
}: ChampionItemsClientProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { t } = useLanguage()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  // Função para obter o item pelo ID
  const getItemById = (itemId: string) => {
    return items[itemId]
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gradient-to-b from-[#121212] to-[#1a1a1a]" : "bg-gradient-to-b from-[#091428] to-[#0A1428]"
      }`}
    >
      <div className="relative h-[40vh] w-full overflow-hidden">
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedChampionId}_0.jpg`}
          alt={championDetails?.name || championId}
          fill
          className="object-cover object-top"
          priority
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-b from-transparent via-[#121212]/30 to-[#121212]"
              : "bg-gradient-to-b from-transparent via-[#091428]/30 to-[#091428]"
          }`}
        />

        <div className="absolute bottom-0 left-0 p-6 md:p-10 z-10">
          <Link
            href={`/champions/${championId}`}
            className="mb-4 inline-flex items-center text-sm bg-[#C8AA6E]/10 hover:bg-[#C8AA6E]/20 px-3 py-2 rounded-sm border border-[#C8AA6E]/30 text-[#C8AA6E] hover:text-[#F0E6D2] transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Champion
          </Link>
          <h1 className="font-cyber text-4xl font-bold tracking-wider text-[#C8AA6E] md:text-5xl">
            {championDetails?.name || championId.charAt(0).toUpperCase() + championId.slice(1)}
          </h1>
          <p className="text-xl text-[#A09B8C]">Recommended Items & Builds</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <section
              className={`mb-8 rounded-sm border border-[#785A28]/50 ${
                isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
              } p-6 shadow-lg backdrop-blur-sm`}
            >
              <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-2xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                Recommended Build
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-medium text-[#C8AA6E]">Starter Items</h3>
                  <div className="flex flex-wrap gap-4">
                    {recommendedBuilds.starter.map((itemId: string) => {
                      const item = getItemById(itemId)
                      return item ? (
                        <div
                          key={itemId}
                          className={`rounded-sm border border-[#785A28]/50 ${
                            isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                          } p-3 cursor-pointer transition-all duration-300 hover:border-[#C8AA6E]`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative h-12 w-12 mb-2">
                              <Image
                                src={getItemImageUrl(version, item.image.full) || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <h4 className="text-center text-xs font-medium text-[#C8AA6E]">{item.name}</h4>
                            <p className="text-center text-xs text-[#A09B8C]">{item.gold.total} gold</p>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-[#C8AA6E]">Core Items</h3>
                  <div className="flex flex-wrap gap-4">
                    {recommendedBuilds.core.map((itemId: string) => {
                      const item = getItemById(itemId)
                      return item ? (
                        <div
                          key={itemId}
                          className={`rounded-sm border border-[#785A28]/50 ${
                            isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                          } p-3 cursor-pointer transition-all duration-300 hover:border-[#C8AA6E]`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative h-12 w-12 mb-2">
                              <Image
                                src={getItemImageUrl(version, item.image.full) || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <h4 className="text-center text-xs font-medium text-[#C8AA6E]">{item.name}</h4>
                            <p className="text-center text-xs text-[#A09B8C]">{item.gold.total} gold</p>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-[#C8AA6E]">Boots</h3>
                  <div className="flex flex-wrap gap-4">
                    {recommendedBuilds.boots.map((itemId: string) => {
                      const item = getItemById(itemId)
                      return item ? (
                        <div
                          key={itemId}
                          className={`rounded-sm border border-[#785A28]/50 ${
                            isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                          } p-3 cursor-pointer transition-all duration-300 hover:border-[#C8AA6E]`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative h-12 w-12 mb-2">
                              <Image
                                src={getItemImageUrl(version, item.image.full) || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <h4 className="text-center text-xs font-medium text-[#C8AA6E]">{item.name}</h4>
                            <p className="text-center text-xs text-[#A09B8C]">{item.gold.total} gold</p>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-[#C8AA6E]">Situational Items</h3>
                  <div className="flex flex-wrap gap-4">
                    {recommendedBuilds.situational.map((itemId: string) => {
                      const item = getItemById(itemId)
                      return item ? (
                        <div
                          key={itemId}
                          className={`rounded-sm border border-[#785A28]/50 ${
                            isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                          } p-3 cursor-pointer transition-all duration-300 hover:border-[#C8AA6E]`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative h-12 w-12 mb-2">
                              <Image
                                src={getItemImageUrl(version, item.image.full) || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <h4 className="text-center text-xs font-medium text-[#C8AA6E]">{item.name}</h4>
                            <p className="text-center text-xs text-[#A09B8C]">{item.gold.total} gold</p>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section
              className={`mb-8 rounded-sm border border-[#785A28]/50 ${
                isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
              } p-6 shadow-lg backdrop-blur-sm`}
            >
              <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-2xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                Build Order
              </h2>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#785A28]/50"></div>
                <div className="space-y-8 pl-16">
                  <div className="relative">
                    <div
                      className={`absolute -left-16 top-0 flex h-8 w-8 items-center justify-center rounded-full ${
                        isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                      } border border-[#C8AA6E] text-[#C8AA6E]`}
                    >
                      1
                    </div>
                    <h3 className="text-lg font-medium text-[#C8AA6E]">Start with</h3>
                    <div className="mt-3 flex flex-wrap gap-4">
                      {recommendedBuilds.starter.map((itemId: string) => {
                        const item = getItemById(itemId)
                        return item ? (
                          <div
                            key={itemId}
                            className="relative h-10 w-10 overflow-hidden rounded-sm border border-[#785A28]/50"
                          >
                            <Image
                              src={getItemImageUrl(version, item.image.full) || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-xs text-white">{item.name}</span>
                            </div>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute -left-16 top-0 flex h-8 w-8 items-center justify-center rounded-full ${
                        isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                      } border border-[#C8AA6E] text-[#C8AA6E]`}
                    >
                      2
                    </div>
                    <h3 className="text-lg font-medium text-[#C8AA6E]">First back</h3>
                    <div className="mt-3 flex flex-wrap gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-sm border border-[#785A28]/50">
                        <Image
                          src={getItemImageUrl(version, getItemById(recommendedBuilds.boots[0])?.image.full || "")}
                          alt="Boots"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <ChevronRight className="h-10 w-6 text-[#C8AA6E]" />
                      <div className="relative h-10 w-10 overflow-hidden rounded-sm border border-[#785A28]/50">
                        <Image
                          src={getItemImageUrl(version, getItemById(recommendedBuilds.core[0])?.image.full || "")}
                          alt="First item component"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute -left-16 top-0 flex h-8 w-8 items-center justify-center rounded-full ${
                        isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                      } border border-[#C8AA6E] text-[#C8AA6E]`}
                    >
                      3
                    </div>
                    <h3 className="text-lg font-medium text-[#C8AA6E]">Core build</h3>
                    <div className="mt-3 flex flex-wrap gap-4">
                      {recommendedBuilds.core.map((itemId: string, index: number) => {
                        const item = getItemById(itemId)
                        return item ? (
                          <div key={itemId} className="flex items-center">
                            <div className="relative h-10 w-10 overflow-hidden rounded-sm border border-[#785A28]/50">
                              <Image
                                src={getItemImageUrl(version, item.image.full) || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            {index < recommendedBuilds.core.length - 1 && (
                              <ChevronRight className="h-10 w-6 text-[#C8AA6E]" />
                            )}
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute -left-16 top-0 flex h-8 w-8 items-center justify-center rounded-full ${
                        isDark ? "bg-[#1a1a1a]" : "bg-[#0A1428]"
                      } border border-[#C8AA6E] text-[#C8AA6E]`}
                    >
                      4
                    </div>
                    <h3 className="text-lg font-medium text-[#C8AA6E]">Situational items</h3>
                    <p className="mt-1 text-sm text-[#A09B8C]">Choose based on the enemy team composition:</p>
                    <div className="mt-3 flex flex-wrap gap-4">
                      {recommendedBuilds.situational.map((itemId: string) => {
                        const item = getItemById(itemId)
                        return item ? (
                          <div
                            key={itemId}
                            className="relative h-10 w-10 overflow-hidden rounded-sm border border-[#785A28]/50"
                          >
                            <Image
                              src={getItemImageUrl(version, item.image.full) || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-xs text-white">{item.name}</span>
                            </div>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div>
            <section
              className={`mb-8 rounded-sm border border-[#785A28]/50 ${
                isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
              } p-6 shadow-lg backdrop-blur-sm`}
            >
              <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                Performance
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-[#A09B8C]">Win Rate</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{recommendedBuilds.winRate}</span>
                  </div>
                  <div
                    className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                  >
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${Number.parseFloat(recommendedBuilds.winRate)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-[#A09B8C]">Pick Rate</span>
                    <span className="text-sm font-medium text-[#C8AA6E]">{recommendedBuilds.pickRate}</span>
                  </div>
                  <div
                    className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                  >
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${Number.parseFloat(recommendedBuilds.pickRate)}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section
              className={`mb-8 rounded-sm border border-[#785A28]/50 ${
                isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
              } p-6 shadow-lg backdrop-blur-sm`}
            >
              <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                Lanes
              </h2>

              <div className="space-y-4">
                {recommendedBuilds.lanes.map((lane: any, index: number) => (
                  <div key={index}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-[#A09B8C]">{lane.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#A09B8C]">Win Rate:</span>
                        <span className="text-sm font-medium text-[#C8AA6E]">{lane.winRate}</span>
                      </div>
                    </div>
                    <div
                      className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-[#222222]" : "bg-[#1E2328]"}`}
                    >
                      <div
                        className="h-full rounded-full bg-[#C8AA6E]"
                        style={{ width: `${Number.parseFloat(lane.pickRate)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-[#A09B8C]">Pick Rate: {lane.pickRate}</p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className={`mb-8 rounded-sm border border-[#785A28]/50 ${
                isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
              } p-6 shadow-lg backdrop-blur-sm`}
            >
              <h2 className="champion-detail-header relative mb-6 inline-block font-cyber text-xl font-bold text-[#C8AA6E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#785A28]/50">
                Pro Tips
              </h2>

              <ul className="space-y-3 list-disc pl-5">
                <li className="text-sm text-[#A09B8C]">
                  Focus on farming early game to reach your item power spikes faster.
                </li>
                <li className="text-sm text-[#A09B8C]">
                  Adapt your build based on the enemy team composition. Build armor against AD threats and magic resist
                  against AP threats.
                </li>
                <li className="text-sm text-[#A09B8C]">
                  Consider buying Control Wards for vision control, especially in high-level play.
                </li>
                <li className="text-sm text-[#A09B8C]">
                  Don't forget to upgrade your boots based on the enemy team's damage type and crowd control.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className={`w-full max-w-2xl rounded-sm border border-[#785A28] ${
              isDark ? "bg-[#1a1a1a]" : "bg-[#091428]"
            } p-6 shadow-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={getItemImageUrl(version, selectedItem.image.full) || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-[#C8AA6E] mb-2">{selectedItem.name}</h3>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[#A09B8C]">{selectedItem.gold.total} gold</span>
                  {selectedItem.gold.purchasable === false && (
                    <span className="text-red-400 text-sm">Not Purchasable</span>
                  )}
                </div>

                {selectedItem.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#C8AA6E] mb-1">Description</h4>
                    <div
                      className="text-sm text-[#A09B8C]"
                      dangerouslySetInnerHTML={{
                        __html: selectedItem.description.replace(/<br>/g, " ").replace(/<\/?(font|span)[^>]*>/g, ""),
                      }}
                    />
                  </div>
                )}

                {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#C8AA6E] mb-1">Stats</h4>
                    <ul className="text-sm text-[#A09B8C] space-y-1">
                      {Object.entries(selectedItem.stats).map(([stat, value]) => (
                        <li key={stat}>
                          {formatStatName(stat)}: {formatStatValue(stat, value)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#C8AA6E] mb-1">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-sm bg-[#C8AA6E]/10 text-[#C8AA6E] border border-[#C8AA6E]/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Função auxiliar para formatar nomes de estatísticas
function formatStatName(stat: string): string {
  const statNames: Record<string, string> = {
    FlatMovementSpeedMod: "Movement Speed",
    FlatHPPoolMod: "Health",
    FlatMPPoolMod: "Mana",
    FlatArmorMod: "Armor",
    FlatSpellBlockMod: "Magic Resist",
    FlatPhysicalDamageMod: "Attack Damage",
    FlatMagicDamageMod: "Ability Power",
    PercentAttackSpeedMod: "Attack Speed",
    FlatCritChanceMod: "Critical Strike Chance",
    PercentLifeStealMod: "Life Steal",
  }

  return statNames[stat] || stat
}

// Função auxiliar para formatar valores de estatísticas
function formatStatValue(stat: string, value: number): string {
  if (stat.includes("Percent")) {
    return `${(value * 100).toFixed(0)}%`
  }
  return value.toString()
}
