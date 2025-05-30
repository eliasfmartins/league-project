"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ForumPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--forum-bg, linear-gradient(to bottom, #091428, #0A1428))",
      }}
    >
      <style jsx global>{`
        :root {
          --forum-bg: linear-gradient(to bottom, #091428, #0A1428);
        }
        
        .dark {
          --forum-bg: linear-gradient(to bottom, #121212, #1a1a1a);
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-2 inline-flex items-center text-sm text-[#C8AA6E] hover:text-[#F0E6D2]"
            style={{ border: "none" }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-cyber text-3xl font-bold tracking-tight text-[#C8AA6E] md:text-4xl">COMMUNITY FORUM</h1>
          <p className="mt-2 text-[#A09B8C]">Join the conversation with fellow summoners</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger value="recent" className="text-[#C8AA6E] data-[state=active]:bg-[#C8AA6E]/20">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="popular" className="text-[#C8AA6E] data-[state=active]:bg-[#C8AA6E]/20">
                  Popular
                </TabsTrigger>
                <TabsTrigger value="unanswered" className="text-[#C8AA6E] data-[state=active]:bg-[#C8AA6E]/20">
                  Unanswered
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[#785A28]/50 bg-[#091428]/80 dark:bg-[#1a1a1a]/80 p-6 shadow-md backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={`https://i.pravatar.cc/150?img=${i}`}
                            alt="User avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#C8AA6E]">Summoner{i}</h3>
                          <p className="text-xs text-[#A09B8C]">
                            Posted {i} hour{i !== 1 ? "s" : ""} ago
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-[#C8AA6E]/10 px-3 py-1 text-xs font-medium text-[#C8AA6E]">
                        {["Patch Notes", "Champion Discussion", "Meta", "Esports", "General"][i % 5]}
                      </div>
                    </div>

                    <h2 className="mb-2 text-xl font-semibold text-[#C8AA6E]">
                      {
                        [
                          "Thoughts on the latest patch?",
                          "Is Yasuo still viable in the current meta?",
                          "Best champions for climbing in solo queue",
                          "Worlds 2023 predictions",
                          "New player looking for advice",
                        ][i % 5]
                      }
                    </h2>

                    <p className="mb-4 text-[#A09B8C]">
                      {
                        [
                          "The new patch has completely changed how I play my main. What do you all think about the changes?",
                          "I've been struggling to make Yasuo work in the current meta. Any tips or should I switch to a different champion?",
                          "I'm trying to climb out of Silver. Which champions do you recommend for carrying games?",
                          "Who do you think will win Worlds this year? I'm betting on T1!",
                          "Just started playing LoL last week. Any advice for a complete beginner?",
                        ][i % 5]
                      }
                    </p>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-[#C8AA6E]">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{i * 7 + 3}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-[#C8AA6E]">
                        <MessageSquare className="h-4 w-4" />
                        <span>{i * 3 + 2}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="popular" className="space-y-6">
                {[3, 1, 5, 2, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[#785A28]/50 bg-[#091428]/80 dark:bg-[#1a1a1a]/80 p-6 shadow-md backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={`https://i.pravatar.cc/150?img=${i}`}
                            alt="User avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#C8AA6E]">Summoner{i}</h3>
                          <p className="text-xs text-[#A09B8C]">
                            Posted {i} day{i !== 1 ? "s" : ""} ago
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-[#C8AA6E]/10 px-3 py-1 text-xs font-medium text-[#C8AA6E]">
                        {["Patch Notes", "Champion Discussion", "Meta", "Esports", "General"][i % 5]}
                      </div>
                    </div>

                    <h2 className="mb-2 text-xl font-semibold text-[#C8AA6E]">
                      {
                        [
                          "Thoughts on the latest patch?",
                          "Is Yasuo still viable in the current meta?",
                          "Best champions for climbing in solo queue",
                          "Worlds 2023 predictions",
                          "New player looking for advice",
                        ][i % 5]
                      }
                    </h2>

                    <p className="mb-4 text-[#A09B8C]">
                      {
                        [
                          "The new patch has completely changed how I play my main. What do you all think about the changes?",
                          "I've been struggling to make Yasuo work in the current meta. Any tips or should I switch to a different champion?",
                          "I'm trying to climb out of Silver. Which champions do you recommend for carrying games?",
                          "Who do you think will win Worlds this year? I'm betting on T1!",
                          "Just started playing LoL last week. Any advice for a complete beginner?",
                        ][i % 5]
                      }
                    </p>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-[#C8AA6E]">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{i * 15 + 20}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-[#C8AA6E]">
                        <MessageSquare className="h-4 w-4" />
                        <span>{i * 8 + 12}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="unanswered" className="space-y-6">
                {[2, 4, 1].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[#785A28]/50 bg-[#091428]/80 dark:bg-[#1a1a1a]/80 p-6 shadow-md backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={`https://i.pravatar.cc/150?img=${i + 5}`}
                            alt="User avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#C8AA6E]">Summoner{i + 5}</h3>
                          <p className="text-xs text-[#A09B8C]">
                            Posted {i} hour{i !== 1 ? "s" : ""} ago
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-[#C8AA6E]/10 px-3 py-1 text-xs font-medium text-[#C8AA6E]">
                        {["Patch Notes", "Champion Discussion", "Meta", "Esports", "General"][i % 5]}
                      </div>
                    </div>

                    <h2 className="mb-2 text-xl font-semibold text-[#C8AA6E]">
                      {
                        [
                          "How to counter Zed in mid lane?",
                          "Best jungle paths for Season 13",
                          "Looking for a team for clash",
                        ][i % 3]
                      }
                    </h2>

                    <p className="mb-4 text-[#A09B8C]">
                      {
                        [
                          "I keep getting destroyed by Zed in mid lane. Any tips on how to counter him?",
                          "What are the most efficient jungle paths in the current meta?",
                          "Looking for a team to join for the upcoming clash tournament. I main support.",
                        ][i % 3]
                      }
                    </p>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-[#C8AA6E]">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{i + 1}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-[#C8AA6E]">
                        <MessageSquare className="h-4 w-4" />
                        <span>0</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-[#785A28]/50 bg-[#091428]/80 dark:bg-[#1a1a1a]/80 p-6 shadow-md backdrop-blur-sm">
              <h2 className="mb-4 font-cyber text-xl font-bold text-[#C8AA6E]">Create Post</h2>
              <div className="space-y-4">
                <Input placeholder="Post title" className="text-[#C8AA6E]" />
                <textarea
                  className="h-32 w-full rounded-md border border-[#785A28] bg-[#091428] dark:bg-[#1a1a1a] px-3 py-2 text-[#C8AA6E]"
                  placeholder="Write your post..."
                />
                <div className="flex items-center justify-between">
                  <select className="rounded-md border border-[#785A28] bg-[#091428] dark:bg-[#1a1a1a] px-3 py-2 text-sm text-[#C8AA6E]">
                    <option value="">Select category</option>
                    <option value="patch">Patch Notes</option>
                    <option value="champion">Champion Discussion</option>
                    <option value="meta">Meta</option>
                    <option value="esports">Esports</option>
                    <option value="general">General</option>
                  </select>
                  <Button className="hextech-button">Post</Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#785A28]/50 bg-[#091428]/80 dark:bg-[#1a1a1a]/80 p-6 shadow-md backdrop-blur-sm">
              <h2 className="mb-4 font-cyber text-xl font-bold text-[#C8AA6E]">Top Contributors</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={`https://i.pravatar.cc/150?img=${i + 10}`}
                        alt="User avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#C8AA6E]">TopSummoner{i}</h3>
                      <p className="text-xs text-[#A09B8C]">{100 - i * 10} posts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#785A28]/50 bg-[#091428]/80 dark:bg-[#1a1a1a]/80 p-6 shadow-md backdrop-blur-sm">
              <h2 className="mb-4 font-cyber text-xl font-bold text-[#C8AA6E]">Forum Rules</h2>
              <ul className="space-y-2 text-sm text-[#A09B8C]">
                <li>Be respectful to other summoners</li>
                <li>No hate speech or offensive content</li>
                <li>No advertising or self-promotion</li>
                <li>Stay on topic in each category</li>
                <li>No spoilers for recent esports events</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
