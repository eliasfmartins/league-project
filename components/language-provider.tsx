"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type Language = "en"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

// English-only translations
const translations = {
  en: {
    home: "Home",
    champions: "Champions",
    explore: "Explore",
    forum: "Forum",
    playNow: "PLAY NOW",
    masterBlade: "MASTER THE UNFORGIVEN BLADE",
    exploreChampions: "Explore Champions",
    joinCommunity: "Join Community",
    topChampions: "TOP CHAMPIONS BY ROLE",
    championRoster: "CHAMPION ROSTER",
    viewAllChampions: "View All Champions",
    joinTheCommunity: "JOIN THE COMMUNITY",
    communityDesc:
      "Share your strategies, discuss the latest patches, and connect with other summoners in our community forum.",
    visitForum: "Visit Forum",
    searchChampions: "Search champions...",
    filter: "Filter",
    championRoles: "Champion Roles",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    clearFilters: "Clear Filters",
    noChampionsFound: "No Champions Found",
    noChampionsDesc: "We couldn't find any champions matching your filters. Try adjusting your search criteria.",
    viewDetails: "View Details",
    winRate: "Win Rate",
    assassin: "Assassin",
    fighter: "Fighter",
    mage: "Mage",
    marksman: "Marksman",
    support: "Support",
    tank: "Tank",
    difficultyLabel: "Difficulty:",
    tierLists: "Tier Lists",
    guides: "Guides",
    patchNotes: "Patch Notes",
    tierListsDesc: "See which champions are dominating the meta.",
    guidesDesc: "Learn how to master your favorite champions.",
    patchNotesDesc: "Stay updated with the latest game changes.",
    lore: "LORE",
    abilities: "ABILITIES",
    championStats: "CHAMPION STATS",
    championSkins: "CHAMPION SKINS",
    backToChampions: "Back to Champions",
    backToHome: "Back to Home",
    attack: "Attack",
    defense: "Defense",
    magic: "Magic",
    allChampions: "ALL CHAMPIONS",
    top: "TOP",
    jungle: "JUNGLE",
    mid: "MID",
    adc: "ADC",
    passive: "Passive",
    qAbility: "Q Ability",
    wAbility: "W Ability",
    eAbility: "E Ability",
    rUltimate: "R Ultimate",
    skin: "Skin",
  },
}

// Creating context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
})

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Language provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // State to store the current language - only English is supported now
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  // Effect to mark as mounted when component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to translate a key
  const t = (key: string): string => {
    // Get translations for the current language or use English as fallback
    const currentTranslations = translations[language] || translations.en
    // Return the translation or the key itself if no translation exists
    return currentTranslations[key as keyof typeof currentTranslations] || key
  }

  // Don't render anything until the component is mounted to avoid hydration issues
  if (!mounted) {
    return <>{children}</>
  }

  // Provide the context to child components
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
