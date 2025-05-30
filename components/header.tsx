"use client"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Defina a função handleScroll fora do useEffect para evitar recriações
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10)
  }

  useEffect(() => {
    // Verificar o estado inicial do scroll
    handleScroll()

    // Adicionar o event listener
    window.addEventListener("scroll", handleScroll)

    // Limpar o event listener quando o componente for desmontado
    return () => window.removeEventListener("scroll", handleScroll)
  }, []) // Array de dependências vazio para executar apenas uma vez

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Importante: No light mode, o header NUNCA muda de cor, mesmo com scroll
  // Alterar a variável headerBgClass para incluir backdrop-blur quando rolado
  const headerBgClass = isDark
    ? isScrolled
      ? "bg-[#121212]/70 backdrop-blur-md"
      : "bg-transparent"
    : isScrolled
      ? "bg-[#091428]/70 backdrop-blur-md"
      : "bg-[#091428]"

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${headerBgClass}`}
      style={{
        backgroundColor: isDark
          ? isScrolled
            ? "rgba(18, 18, 18, 0.7)"
            : "transparent"
          : isScrolled
            ? "rgba(9, 20, 40, 0.7)"
            : "#091428",
        backdropFilter: isScrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(8px)" : "none",
      }}
    >
      {/* Barra dourada que ocupa toda a largura */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#785A28] via-[#C8AA6E] to-[#785A28]" />

      {/* Container com largura máxima para o conteúdo do header */}
      <div className="mx-auto max-w-[1200px] flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-12 w-12 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill={isDark ? "#121212" : "#091428"} stroke="#C8AA6E" strokeWidth="2" />
                <path
                  d="M20 8L8 14V26L20 32L32 26V14L20 8Z"
                  fill={isDark ? "#121212" : "#091428"}
                  stroke="#C8AA6E"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="20" r="6" fill="#C8AA6E" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-cyber text-xl font-bold tracking-wider text-[#C8AA6E]">CHAMPIONS</span>
            <span className="text-xs text-[#A09B8C]">LEAGUE OF LEGENDS</span>
          </div>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("header-link px-4 py-2", pathname === "/" && "active")}>
                    {t("home")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/champions" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn("header-link px-4 py-2", pathname.startsWith("/champions") && "active")}
                  >
                    {t("champions")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="header-link"
                  style={{
                    backgroundColor: "transparent",
                    color: "#C8AA6E",
                    border: "none",
                  }}
                >
                  {t("explore")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={`grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ${
                      isDark ? "bg-[#121212]" : "bg-[#091428]"
                    } border border-[#785A28] rounded-md shadow-lg backdrop-blur-sm animate-in fade-in-80 zoom-in-95`}
                  >
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className={`flex h-full w-full select-none flex-col justify-end rounded-md ${
                            isDark
                              ? "bg-gradient-to-b from-[#222222]/50 to-[#333333]"
                              : "bg-gradient-to-b from-[#091428]/50 to-[#0A1428]"
                          } p-6 no-underline outline-none focus:shadow-md border border-[#C8AA6E]/20 hover:border-[#C8AA6E]/50 transition-all duration-300 group`}
                          href="/statistics"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-[#C8AA6E] group-hover:text-[#F0E6D2] transition-colors">
                            Statistics
                          </div>
                          <p className="text-sm leading-tight text-[#A09B8C] group-hover:text-[#C8AA6E] transition-colors">
                            Explore detailed champion statistics, matchups, and get recommendations for your next game.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${
                            isDark
                              ? "hover:bg-[#222222]/50 focus:bg-[#222222]/50"
                              : "hover:bg-[#1E2328]/50 focus:bg-[#1E2328]/50"
                          } text-[#C8AA6E] hover:text-[#F0E6D2] border border-transparent hover:border-[#C8AA6E]/30`}
                          href="/tier-list"
                        >
                          <div className="text-sm font-medium leading-none">Tier Lists</div>
                          <p className="line-clamp-2 text-sm leading-snug text-[#A09B8C]">
                            Find the strongest champions for each role in the current meta.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${
                            isDark
                              ? "hover:bg-[#222222]/50 focus:bg-[#222222]/50"
                              : "hover:bg-[#1E2328]/50 focus:bg-[#1E2328]/50"
                          } text-[#C8AA6E] hover:text-[#F0E6D2] border border-transparent hover:border-[#C8AA6E]/30`}
                          href="/patch-notes"
                        >
                          <div className="text-sm font-medium leading-none">Patch Notes</div>
                          <p className="line-clamp-2 text-sm leading-snug text-[#A09B8C]">
                            Stay updated with the latest game changes and balance updates.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${
                            isDark
                              ? "hover:bg-[#222222]/50 focus:bg-[#222222]/50"
                              : "hover:bg-[#1E2328]/50 focus:bg-[#1E2328]/50"
                          } text-[#C8AA6E] hover:text-[#F0E6D2] border border-transparent hover:border-[#C8AA6E]/30`}
                          href="/items"
                        >
                          <div className="text-sm font-medium leading-none">Items</div>
                          <p className="line-clamp-2 text-sm leading-snug text-[#A09B8C]">
                            Explore all game items and find the best builds for each champion.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/forum" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("header-link px-4 py-2", pathname === "/forum" && "active")}>
                    {t("forum")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <LanguageSelector />
          <ThemeToggle />

          <Button size="sm" className="hextech-button">
            {t("playNow")}
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="text-[#C8AA6E]"
            style={{ border: "none" }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div
          className={`mx-auto max-w-[1200px] px-4 pb-4 md:hidden ${isDark ? "bg-[#121212]" : "bg-[#091428]"} border-t border-[#785A28]/30`}
        >
          <nav className="flex flex-col space-y-3">
            <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium text-[#C8AA6E] hover:bg-[#1E2328]/50">
              {t("home")}
            </Link>
            <Link
              href="/champions"
              className="rounded-md px-3 py-2 text-sm font-medium text-[#C8AA6E] hover:bg-[#1E2328]/50"
            >
              {t("champions")}
            </Link>
            <Link
              href="/statistics"
              className="rounded-md px-3 py-2 text-sm font-medium text-[#C8AA6E] hover:bg-[#1E2328]/50"
            >
              Statistics
            </Link>
            <Link
              href="/tier-list"
              className="rounded-md px-3 py-2 text-sm font-medium text-[#C8AA6E] hover:bg-[#1E2328]/50"
            >
              Tier Lists
            </Link>
            <Link
              href="/patch-notes"
              className="rounded-md px-3 py-2 text-sm font-medium text-[#C8AA6E] hover:bg-[#1E2328]/50"
            >
              Patch Notes
            </Link>
            <Link
              href="/items"
              className="rounded-md px-3 py-2 text-sm font-medium text-[#C8AA6E] hover:bg-[#1E2328]/50"
            >
              Items
            </Link>
            <Link
              href="/forum"
              className="rounded-md px-3 py-2 text-sm font-medium text-[#C8AA6E] hover:bg-[#1E2328]/50"
            >
              {t("forum")}
            </Link>
            <Button size="sm" className="mt-2 hextech-button">
              {t("playNow")}
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
