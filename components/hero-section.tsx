"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "@/components/theme-provider"
import Image from "next/image"


const heroBackgrounds = [
	{
		url: "./foto-lol/inkshadow-yasuo-prestige-skin-lol-splash-art-hd-wallpaper-uhdpaper.com-475@1@k.jpg",
		name: "Yasuo",
		title: "Inkshadow Yasuo Prestige",
	},
	{
		url: "./foto-lol/peacemaker-high-noon-yone-skin-lol-splash-art-hd-wallpaper-uhdpaper.com-318@1@o.jpg",
		name: "Yone",
		title: "Peacemaker High Noon ",
	},
	{
		url: "./foto-lol/porcelain-irelia-skin-lol-splash-art-hd-wallpaper-uhdpaper.com-929@1@n.jpg",
		name: "Irelia",
		title: "Porcelain ",
	},
	{
		url: "./foto-lol/riven-dawnbringer-mythic-chroma-skin-chinese-lol-splash-art-hd-wallpaper-uhdpaper.com-662@1@m.jpg",
		name: "Riven",
		title: "Dawnbringer  Mythic",
	},
	{
		url: "./foto-lol/soul-fighter-sett-lol-skin-splash-art-hd-wallpaper-uhdpaper.com-926@1@k.jpg",
		name: "Sett",
		title: "Soul Fighter ",
	},
	{
		url: "./foto-lol/spirit-blossom-sett-skin-lol-splash-art-hd-wallpaper-uhdpaper.com-660@1@i.jpg",
		name: "Sett",
		title: "Spirit Blossom ",
	},
	{
		url: "./foto-lol/dream-dragon-yasuo-lol-skin-splash-art-dragonmancer-hd-wallpaper-1920x1080-uhdpaper.com-271.1_c.jpg",
		name: "Yasuo",
		title: "Dream Dragon ",
	},
	{
		url: "./foto-lol/genesis-nightbringer-yasuo-lol-skin-splash-art-hd-wallpaper-uhdpaper.com-839@2@a.jpg",
		name: "Yasuo",
		title: "Genesis Nightbringer ",
	},
	{
		url: "./foto-lol/invictus-gaming-camille-splash-art-lol-uhdpaper.com-4K-70.jpg",
		name: "Camille",
		title: "Invictus Gaming ",
	},
	{
		url: "./foto-lol/broken-covenant-riven-skin-lol-splash-art-hd-wallpaper-uhdpaper.com-889@1@j.jpg",
		name: "Riven",
		title: "Broken Covenant ",
	},
	{
		url: "./foto-lol/riven-lol-dawnbringer-splash-art-uhdpaper.com-hd-444.jpg",
		name: "Riven",
		title: "Dawnbringer ",
	},
	{
		url: "./foto-lol/galaxy-slayer-zed-lol-wild-rift-splash-art-hd-wallpaper-1920x1080-uhdpaper.com-582.1_a.jpg",
		name: "Zed",
		title: "Galaxy Slayer ",
	},
	{
		url: "./foto-lol/ashen-knight-sylas-lol-skin-splash-art-hd-wallpaper-uhdpaper.com-399@1@i.jpg",
		name: "Sylas",
		title: "Ashen Knight ",
	},
	{
		url: "./foto-lol/jinx-arcane-fractured-skin-lol-splash-art-hd-wallpaper-uhdpaper.com-231@2@c.jpg",
		name: "Jinx",
		title: "Jinx Arcane Fractured",
	},
	{
		url: "./foto-lol/ambessa-chosen-of-the-wolf-lol-skin-splash-art-hd-wallpaper-uhdpaper.com-572@2@b.jpg",
		name: "Ambessa",
		title: "Chosen of the Wolf",
	},
	{
		url: "./foto-lol/irelia-spirit-blossom-skin-lol-splash-art-hd-wallpaper-uhdpaper.com-589@5@e.jpg",
		name: "Irelia",
		title: "Spirit Blossom ",
	},
	{
		url: "./foto-lol/immortalized-legend-ahri-skin-splash-art-lol-hd-wallpaper-uhdpaper.com-547@0@j.jpg",
		name: "Ahri",
		title: "Immortalized Legend ",
	},
];


export function HeroSection() {
	const [isVisible, setIsVisible] = useState(false)
	const { t } = useLanguage()
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === "dark"
	const [background, setBackground] = useState(heroBackgrounds[0])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setIsVisible(true)

		// Selecionar um background aleatório
		const randomIndex = Math.floor(Math.random() * heroBackgrounds.length)
		setBackground(heroBackgrounds[randomIndex])

		// Simular carregamento da imagem
		setIsLoading(true)
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 1000)

		return () => clearTimeout(timer)
	}, [])

	return (
		<section className="relative h-[85vh] overflow-hidden">
			{/* Background image */}
			<div className="absolute inset-0 z-0">
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
						<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C8AA6E]"></div>
					</div>
				)}

				<Image
					src={background.url || "/placeholder.svg"}
					alt={background.name}
					fill
					className="object-cover object-top"
					priority
					onLoad={() => setIsLoading(false)}
				/>

				<div
					className={`absolute inset-0 ${isDark
							? "bg-gradient-to-r from-[#121212]/90 via-[#121212]/70 to-[#121212]/20"
							: "bg-gradient-to-r from-[#091428]/90 via-[#091428]/70 to-[#091428]/20"
						}`}
				/>
			</div>

			{/* Animated particles */}
			<div className="absolute inset-0 z-0 opacity-30">
				{Array.from({ length: 30 }).map((_, i) => (
					<div
						key={i}
						className="absolute h-1 w-1 rounded-full bg-[#C8AA6E] animate-float"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${3 + Math.random() * 7}s`,
							width: `${Math.random() * 3 + 1}px`,
							height: `${Math.random() * 3 + 1}px`,
							opacity: Math.random() * 0.7 + 0.3,
						}}
					/>
				))}
			</div>

			{/* Decorative elements */}
			<div
				className={`absolute left-0 top-0 h-32 w-1/3 ${isDark ? "bg-gradient-to-br from-[#121212] to-transparent" : "bg-gradient-to-br from-[#091428] to-transparent"
					}`}
			/>
			<div
				className={`absolute right-0 top-0 h-32 w-1/2 ${isDark ? "bg-gradient-to-bl from-[#121212] to-transparent" : "bg-gradient-to-bl from-[#091428] to-transparent"
					}`}
			/>
			<div
				className={`absolute inset-x-0 bottom-0 h-32 ${isDark ? "bg-gradient-to-t from-[#121212] to-transparent" : "bg-gradient-to-t from-[#091428] to-transparent"
					}`}
			/>

			<div className="container mx-auto max-w-[1200px] relative z-10 flex h-full items-center px-4">
				<div className="max-w-2xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<h1 className="font-cyber text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
							{background.name.split(" ").map((word, i) => (
								<span key={i} className={i === 0 ? "text-[#C8AA6E]" : ""}>
									{word}{" "}
								</span>
							))}
							<span className="text-[#C8AA6E]">{background.title}</span>
						</h1>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
						transition={{ duration: 0.8, delay: 0.4 }}
					>
						<p className="mt-4 max-w-lg text-lg text-[#A09B8C] md:text-xl">
							Explore all League of Legends champions, their abilities, lore, and strategies. Find your perfect match
							for the Summoner's Rift.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="mt-8 flex flex-wrap gap-4"
					>
						<Link href="/champions">
							<Button size="lg" className="hextech-button group">
								{t("exploreChampions")}
								<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Button>
						</Link>
						<Link href="/forum">
							<Button variant="outline" size="lg" className="hextech-button">
								{t("joinCommunity")}
							</Button>
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
