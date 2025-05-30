"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Github, Instagram, Twitter, Youtube } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

export default function Footer() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <footer
      className="border-t border-[#785A28]/50 backdrop-blur-sm"
      style={{
        backgroundColor: isDark ? "#121212" : "#091428",
      }}
    >
      {/* Este é o gradiente que precisa ser alterado para dourado no light mode */}
      <div
        className="absolute inset-x-0 -top-12 h-12"
        style={{
          background: isDark
            ? "linear-gradient(to top, #121212, transparent)"
            : "linear-gradient(to top, #091428, #C8AA6E, transparent)",
          opacity: isDark ? 1 : 0.7,
        }}
      ></div>

      <div className="container mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M25 5L5 15V35L25 45L45 35V15L25 5Z"
                      stroke="#C8AA6E"
                      strokeWidth="2"
                      fill={isDark ? "#121212" : "#091428"}
                    />
                    <path d="M25 5V45" stroke="#C8AA6E" strokeWidth="2" />
                    <path d="M5 15L45 35" stroke="#C8AA6E" strokeWidth="2" />
                    <path d="M45 15L5 35" stroke="#C8AA6E" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <h3 className="font-cyber text-lg font-bold text-[#C8AA6E]">CHAMPIONS</h3>
            </div>
            <p className="mb-4 mt-4 text-sm text-[#A09B8C]">
              Explore the world of League of Legends champions with detailed information, guides, and community
              discussions.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#C8AA6E]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/champions" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Champions
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Tier Lists
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#C8AA6E]">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Patch Notes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Esports
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#C8AA6E]">Subscribe</h3>
            <p className="mb-4 text-sm text-[#A09B8C]">
              Stay updated with the latest champion updates and community news.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="Your email"
                type="email"
                className="border-[#785A28] text-[#C8AA6E]"
                style={{
                  backgroundColor: isDark ? "#1a1a1a" : "#091428",
                }}
              />
              <Button className="hextech-button">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#785A28]/30 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-[#A09B8C] md:text-left">
              &copy; {new Date().getFullYear()} Champions Explorer. All rights reserved. This site is not affiliated
              with Riot Games.
            </p>
            <div className="flex space-x-4 text-sm text-[#A09B8C]">
              <Link href="#" className="hover:text-[#C8AA6E]">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-[#C8AA6E]">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-[#C8AA6E]">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
