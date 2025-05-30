"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function ChampionLoading() {
  const [tipIndex, setTipIndex] = useState(0)
  const [loadingText, setLoadingText] = useState("Carregando Campeão")
  const [loadingDots, setLoadingDots] = useState("")

  const tips = [
    "Conhecer os detalhes de cada campeão é o primeiro passo para a maestria.",
    "Estude as habilidades dos campeões para prever seus movimentos.",
    "A visão é uma das ferramentas mais poderosas em League of Legends.",
    "Praticar o último hit em minions melhora significativamente seu jogo.",
    "Comunicação eficiente com sua equipe aumenta suas chances de vitória.",
    "Conhecer os cooldowns das habilidades inimigas dá vantagem nas trocas.",
  ]

  // Alternar entre dicas a cada 4 segundos
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
    }, 4000)

    return () => clearInterval(tipInterval)
  }, [tips.length])

  // Animação de pontos de carregamento
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  // Alternar textos de carregamento
  useEffect(() => {
    const texts = [
      "Carregando Campeão",
      "Preparando Detalhes",
      "Buscando Skins",
      "Analisando Habilidades",
      "Quase Pronto",
    ]

    let index = 0
    const textInterval = setInterval(() => {
      index = (index + 1) % texts.length
      setLoadingText(texts[index])
    }, 2000)

    return () => clearInterval(textInterval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#091428] to-[#0A1428]">
      <div className="text-center max-w-md px-4">
        {/* Logo animado */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Hexágono central */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <div className="w-20 h-20 bg-[#091428] border-2 border-[#C8AA6E] rotate-45"></div>
          </motion.div>

          {/* Logo LoL */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.span
              className="text-[#C8AA6E] text-3xl font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              LoL
            </motion.span>
          </div>

          {/* Hexágonos orbitando */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-[#C8AA6E]"
              initial={{
                x: 0,
                y: 0,
                opacity: 0.7,
              }}
              animate={{
                x: Math.cos((2 * Math.PI * i) / 6) * 50,
                y: Math.sin((2 * Math.PI * i) / 6) * 50,
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Partículas flutuantes */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-[#C8AA6E]/40"
              style={{
                width: 1 + Math.random() * 3,
                height: 1 + Math.random() * 3,
              }}
              initial={{
                x: -50 + Math.random() * 100,
                y: -50 + Math.random() * 100,
                opacity: 0,
              }}
              animate={{
                x: -70 + Math.random() * 140,
                y: -70 + Math.random() * 140,
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.h2
          className="text-[#C8AA6E] text-2xl font-bold mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {loadingText}
          {loadingDots}
        </motion.h2>

        <p className="text-[#A09B8C] mb-6">Explorando o universo de League of Legends</p>

        {/* Barra de progresso estilizada */}
        <div className="w-64 h-2 bg-[#1E2328] rounded-full mx-auto overflow-hidden relative mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C8AA6E] to-[#F0E6D2]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-white/30"
            animate={{ x: [-80, 320] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        {/* Dica aleatória com animação de fade */}
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-sm text-[#A09B8C] max-w-xs mx-auto italic bg-[#0A1428]/50 p-4 rounded-sm border border-[#785A28]/30"
        >
          <span className="text-[#C8AA6E] font-medium">Dica: </span>
          {tips[tipIndex]}
        </motion.div>
      </div>
    </div>
  )
}
