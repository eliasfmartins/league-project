"use client"

import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { ArrowLeft, Search, X, Filter, ChevronDown, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface PatchNotesClientProps {
  patchNotes: any[]
}

export default function PatchNotesClient({ patchNotes }: PatchNotesClientProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedVersions, setExpandedVersions] = useState<string[]>([patchNotes[0]?.version || ""])

  const categories = ["All", "Champions", "Items", "Systems"]

  // Filter patch notes based on search term and category
  const filteredPatchNotes = patchNotes.filter((patch) => {
    // Check if patch version or date matches search
    const patchMatches =
      patch.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patch.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patch.highlights.some((highlight: string) => highlight.toLowerCase().includes(searchTerm.toLowerCase()))

    // If patch matches directly, include it
    if (
      patchMatches &&
      (selectedCategory === "All" || patch.sections.some((section: any) => section.title === selectedCategory))
    ) {
      return true
    }

    // Check if any section or change matches search and category
    return patch.sections.some((section: any) => {
      // If category filter is applied, check if section matches
      if (selectedCategory !== "All" && section.title !== selectedCategory) {
        return false
      }

      // Check if section title matches search
      if (section.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true
      }

      // Check if any change in the section matches search
      return section.changes.some((change: any) => {
        // Check champion/item name
        if (change.champion && change.champion.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true
        }
        if (change.item && change.item.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true
        }
        if (change.title && change.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true
        }

        // Check individual changes
        return change.changes.some((c: string) => c.toLowerCase().includes(searchTerm.toLowerCase()))
      })
    })
  })

  // Toggle expanded state for a version
  const toggleExpanded = (version: string) => {
    setExpandedVersions((prev) => (prev.includes(version) ? prev.filter((v) => v !== version) : [...prev, version]))
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gradient-to-b from-[#121212] to-[#1a1a1a]" : "bg-gradient-to-b from-[#091428] to-[#0A1428]"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-2 inline-flex items-center text-sm bg-[#C8AA6E]/10 hover:bg-[#C8AA6E]/20 px-3 py-2 rounded-sm border border-[#C8AA6E]/30 text-[#C8AA6E] hover:text-[#F0E6D2] transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl">PATCH NOTES</h1>
          <p className="mt-2 text-[#A09B8C]">Stay updated with the latest game changes and balance updates</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#C8AA6E]" />
            <Input
              type="search"
              placeholder="Search patch notes..."
              className={`w-full rounded-md border ${
                isDark ? "bg-[#1a1a1a]" : "bg-[#091428]"
              } pl-9 pr-4 py-2 text-[#C8AA6E]`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: isDark ? "#1a1a1a" : "#091428",
                borderColor: "#785A28",
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-[#C8AA6E] hover:text-[#F0E6D2]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm border ${
                showFilters ? "bg-[#C8AA6E]/20 border-[#C8AA6E]" : "border-[#785A28]/50 bg-transparent"
              } text-[#C8AA6E]`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            className={`mb-6 p-4 rounded-sm border border-[#785A28]/50 ${
              isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="mb-3 text-[#C8AA6E] font-medium">Filter by Category</h3>
            <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-transparent">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-[#C8AA6E] data-[state=active]:bg-[#C8AA6E]/20"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        )}

        <div className="space-y-6">
          {filteredPatchNotes.length > 0 ? (
            filteredPatchNotes.map((patch) => (
              <motion.div
                key={patch.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`rounded-sm border border-[#785A28]/50 ${
                  isDark ? "bg-[#1a1a1a]/80" : "bg-[#0A1428]/80"
                } overflow-hidden`}
              >
                <div
                  className={`p-4 bg-gradient-to-r from-[#C8AA6E]/20 to-transparent cursor-pointer`}
                  onClick={() => toggleExpanded(patch.version)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="font-cyber text-2xl font-bold text-[#C8AA6E]">Patch {patch.version}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-[#A09B8C]" />
                        <p className="text-sm text-[#A09B8C]">{patch.date}</p>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <ChevronDown
                        className={`h-5 w-5 text-[#C8AA6E] transition-transform duration-300 ${
                          expandedVersions.includes(patch.version) ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {patch.highlights &&
                      patch.highlights.map((highlight, index) => (
                        <div
                          key={`${patch.version}-highlight-${index}`}
                          className="flex items-center gap-1 px-2 py-1 rounded-sm bg-[#C8AA6E]/10 border border-[#C8AA6E]/30"
                        >
                          <Tag className="h-3 w-3 text-[#C8AA6E]" />
                          <span className="text-xs text-[#C8AA6E]">{highlight}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {expandedVersions.includes(patch.version) && (
                  <div className="p-4 border-t border-[#785A28]/30">
                    {patch.sections &&
                      patch.sections
                        .filter((section) => selectedCategory === "All" || section.title === selectedCategory)
                        .map((section, sectionIndex) => (
                          <div key={`${patch.version}-${section.title}`} className="mb-6 last:mb-0">
                            <h3 className="text-xl font-cyber font-bold text-[#C8AA6E] mb-4 pb-2 border-b border-[#785A28]/30">
                              {section.title}
                            </h3>

                            <div className="space-y-4">
                              {section.changes &&
                                section.changes.map((change, changeIndex) => (
                                  <motion.div
                                    key={`${patch.version}-${section.title}-${changeIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: changeIndex * 0.05 }}
                                    className={`p-4 rounded-sm border border-[#785A28]/30 ${
                                      isDark ? "bg-[#1a1a1a]/50" : "bg-[#0A1428]/50"
                                    }`}
                                  >
                                    {change.champion && (
                                      <div className="flex items-start gap-3 mb-3">
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden border border-[#785A28]/50 flex-shrink-0">
                                          <Image
                                            src={change.image || "/placeholder.svg?height=48&width=48"}
                                            alt={change.champion}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                          />
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-medium text-[#C8AA6E]">{change.champion}</h4>
                                          {change.developer_notes && (
                                            <p className="text-sm text-[#A09B8C] mt-1 italic">
                                              "{change.developer_notes}"
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {change.item && (
                                      <div className="flex items-start gap-3 mb-3">
                                        <div className="relative h-12 w-12 rounded-sm overflow-hidden border border-[#785A28]/50 flex-shrink-0">
                                          <Image
                                            src={change.image || "/placeholder.svg?height=48&width=48"}
                                            alt={change.item}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                          />
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-medium text-[#C8AA6E]">{change.item}</h4>
                                        </div>
                                      </div>
                                    )}

                                    {change.title && !change.champion && !change.item && (
                                      <h4 className="text-lg font-medium text-[#C8AA6E] mb-3">{change.title}</h4>
                                    )}

                                    <ul className="space-y-2 list-disc pl-5">
                                      {change.changes &&
                                        change.changes.map((c, i) => (
                                          <li key={`change-${i}`} className="text-[#A09B8C]">
                                            {c}
                                          </li>
                                        ))}
                                    </ul>
                                  </motion.div>
                                ))}
                            </div>
                          </div>
                        ))}

                    {/* Adicionar conteúdo HTML se disponível */}
                    {patch.content && (
                      <div
                        className="mt-4 text-[#A09B8C] prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: patch.content }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl text-[#C8AA6E] mb-4">¯\_(ツ)_/¯</div>
              <h3 className="text-xl font-cyber text-[#C8AA6E] mb-2">No Patch Notes Found</h3>
              <p className="text-[#A09B8C] max-w-md">
                We couldn't find any patch notes matching your search criteria. Try adjusting your filters or search
                term.
              </p>
            </div>
          )}
        </div>

        {filteredPatchNotes.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="border-[#C8AA6E]/50 text-[#C8AA6E] hover:bg-[#C8AA6E]/10">
              Load More Patch Notes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
