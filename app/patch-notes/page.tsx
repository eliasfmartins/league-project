// Adicionar tratamento de erro para a página de patch notes
// Modificar o componente para incluir tratamento de erro:

import PatchNotesClient from "@/components/patch-notes-client"
import ErrorComponent from "@/components/error-component"

export default async function PatchNotesPage() {
  // Simular notas de atualização
  let patchNotes = []
  let error = null

  try {
    // Aqui você normalmente buscaria os dados de uma API
    patchNotes = [
      {
        id: "13.10",
        version: "13.10",
        date: "May 17, 2023",
        title: "Patch 13.10 Notes",
        description: "Welcome to Patch 13.10, where we're making some adjustments to champions and items after MSI.",
        highlights: [
          "Buffing underperforming champions like Ryze and Azir",
          "Nerfing dominant picks like Wukong and Ahri",
          "Adjusting some items to balance the meta",
        ],
        sections: [
          {
            title: "Champions",
            changes: [
              {
                champion: "Ahri",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Q - Orb of Deception: Damage reduced from 60-240 to 55-225",
                  "E - Charm: Cooldown increased from 12s to 14s at all ranks",
                ],
                developer_notes: "Ahri has been too dominant in mid lane, especially in pro play.",
              },
              {
                champion: "Ryze",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Base health increased from 575 to 590",
                  "Q - Overload: Damage increased from 70-190 to 75-200",
                  "E - Spell Flux: Cooldown reduced from 3.5s to 3s",
                ],
                developer_notes: "Ryze has been struggling in solo queue, so we're giving him some power.",
              },
            ],
          },
          {
            title: "Items",
            changes: [
              {
                item: "Divine Sunderer",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Cost reduced from 3300 to 3200 gold",
                  "Healing from Spellblade effect reduced from 7.8% to 6% of target's max health",
                ],
              },
            ],
          },
        ],
        content: `
        <h2>JUNGLE UPDATES</h2>
        <p>We're adjusting jungle camp respawn timers to reduce the impact of early invades and make the jungle role more forgiving for players who fall behind.</p>
        
        <h3>CAMP RESPAWN TIMERS</h3>
        <ul>
          <li>Krugs: 2:00 → 1:45</li>
          <li>Raptors: 2:00 → 1:45</li>
          <li>Wolves: 2:00 → 1:45</li>
          <li>Gromp: 2:00 → 1:45</li>
        </ul>
      `,
      },
      {
        id: "13.9",
        version: "13.9",
        date: "May 3, 2023",
        title: "Patch 13.9 Notes",
        description: "Patch 13.9 brings significant changes to top lane bruisers and support items.",
        highlights: [
          "Top lane bruiser buffs",
          "Support item adjustments",
          "Zeri rework",
          "New skins for Sett, Seraphine, and Pyke",
        ],
        sections: [
          {
            title: "Champions",
            changes: [
              {
                champion: "Lee Sin",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Base AD increased from 66 to 68",
                  "W - Safeguard: Shield strength increased from 55-175 to 60-200",
                ],
              },
              {
                champion: "Thresh",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Q - Death Sentence: Cooldown reduced from 20-12s to 18-10s",
                  "E - Flay: Slow increased from 20-40% to 25-45%",
                ],
              },
            ],
          },
          {
            title: "Items",
            changes: [
              {
                item: "Moonstone Renewer",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Heal and Shield Power increased from 25% to 30%",
                  "Mythic passive now grants 5 Ability Haste per legendary item",
                ],
              },
            ],
          },
        ],
        content: `
        <h2>TOP LANE UPDATES</h2>
        <p>We're buffing several top lane bruisers to help them compete in the current meta.</p>
        
        <h3>DARIUS</h3>
        <ul>
          <li>Q - Decimate: Healing: 10/15/20/25/30% → 12/17/22/27/32%</li>
          <li>E - Apprehend: Armor penetration: 15/20/25/30/35% → 20/25/30/35/40%</li>
        </ul>
      `,
      },
      {
        id: "13.8",
        version: "13.8",
        date: "April 19, 2023",
        title: "Patch 13.8 Notes",
        description: "Patch 13.8 focuses on adjusting the ADC meta and improving jungle diversity.",
        highlights: [
          "ADC item adjustments",
          "Jungle champion diversity improvements",
          "Syndra mini-rework",
          "New skins for Jhin, Soraka, and Varus",
        ],
        sections: [
          {
            title: "Champions",
            changes: [
              {
                champion: "Yasuo",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Base movement speed reduced from 345 to 340",
                  "Q - Steel Tempest: Cooldown increased at early levels",
                  "R - Last Breath: Bonus armor penetration reduced from 50% to 45%",
                ],
              },
              {
                champion: "Darius",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Base health regeneration increased from 8 to 10",
                  "Q - Decimate: Healing increased from 10-15% to 12-18% of missing health",
                  "E - Apprehend: Armor penetration increased from 15-35% to 20-40%",
                ],
              },
            ],
          },
          {
            title: "Items",
            changes: [
              {
                item: "Infinity Edge",
                image: "/placeholder.svg?height=64&width=64",
                changes: [
                  "Total cost reduced from 3400 to 3300 gold",
                  "Critical strike damage bonus reduced from 35% to 30%",
                ],
              },
            ],
          },
        ],
        content: `
        <h2>ADC UPDATES</h2>
        <p>We're adjusting several ADC items to create more build diversity and strategic choices.</p>
        
        <h3>INFINITY EDGE</h3>
        <ul>
          <li>Critical strike damage: 35% → 30%</li>
          <li>Attack damage: 70 → 80</li>
        </ul>
      `,
      },
    ]
  } catch (err) {
    console.error("Error loading patch notes:", err)
    error = "Failed to load patch notes data. Please try again later."
  }

  // Se houver um erro, renderize o componente de erro
  if (error) {
    return <ErrorComponent message={error} />
  }

  // Caso contrário, renderize o componente normal
  return <PatchNotesClient patchNotes={patchNotes} />
}
