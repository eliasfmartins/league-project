"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type Language = "en" | "pt"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

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
  },
  pt: {
    home: "Início",
    champions: "Campeões",
    explore: "Explorar",
    forum: "Fórum",
    playNow: "JOGAR AGORA",
    masterBlade: "DOMINE A LÂMINA IMPERDOÁVEL",
    exploreChampions: "Explorar Campeões",
    joinCommunity: "Entrar na Comunidade",
    topChampions: "MELHORES CAMPEÕES POR FUNÇÃO",
    championRoster: "LISTA DE CAMPEÕES",
    viewAllChampions: "Ver Todos os Campeões",
    joinTheCommunity: "JUNTE-SE À COMUNIDADE",
    communityDesc:
      "Compartilhe suas estratégias, discuta as últimas atualizações e conecte-se com outros invocadores em nosso fórum da comunidade.",
    visitForum: "Visitar Fórum",
    searchChampions: "Buscar campeões...",
    filter: "Filtrar",
    championRoles: "Funções de Campeões",
    difficulty: "Dificuldade",
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
    clearFilters: "Limpar Filtros",
    noChampionsFound: "Nenhum Campeão Encontrado",
    noChampionsDesc:
      "Não conseguimos encontrar campeões que correspondam aos seus filtros. Tente ajustar seus critérios de busca.",
    viewDetails: "Ver Detalhes",
    winRate: "Taxa de Vitória",
    assassin: "Assassino",
    fighter: "Lutador",
    mage: "Mago",
    marksman: "Atirador",
    support: "Suporte",
    tank: "Tanque",
    difficultyLabel: "Dificuldade:",
    tierLists: "Listas de Tier",
    guides: "Guias",
    patchNotes: "Notas de Atualização",
    tierListsDesc: "Veja quais campeões estão dominando a meta.",
    guidesDesc: "Aprenda a dominar seus campeões favoritos.",
    patchNotesDesc: "Fique atualizado com as últimas mudanças do jogo.",
    lore: "HISTÓRIA",
    abilities: "HABILIDADES",
    championStats: "ESTATÍSTICAS",
    championSkins: "SKINS DO CAMPEÃO",
    backToChampions: "Voltar para Campeões",
    backToHome: "Voltar para Início",
    attack: "Ataque",
    defense: "Defesa",
    magic: "Magia",
    allChampions: "TODOS OS CAMPEÕES",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Carregar idioma salvo no localStorage
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt")) {
        setLanguage(savedLanguage)
      }
    } catch (e) {
      console.error("Failed to read language preference:", e)
    }

    // Force a re-render to ensure translations are applied
    const timer = setTimeout(() => {
      setLanguage((prev) => (prev === "en" ? "en" : "pt"))
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Salvar idioma no localStorage quando mudar
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    try {
      localStorage.setItem("language", newLanguage)
    } catch (e) {
      console.error("Failed to save language preference:", e)
    }
  }

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations.en
    return currentTranslations[key as keyof typeof currentTranslations] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
