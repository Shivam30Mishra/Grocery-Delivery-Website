"use client"

import Image from "next/image"
import Link from "next/link"
import { Leaf, Truck, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

type Slide = {
  id: number
  title: string
  description: string
  image: string
  cta: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Fresh Fruits, Delivered Daily",
    description:
      "Handpicked fruits sourced directly from trusted local farms and delivered fresh to your doorstep.",
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e43e?q=80&w=2000&auto=format&fit=crop",
    cta: "Shop Fruits",
  },
  {
    id: 2,
    title: "Pure & Organic Vegetables",
    description:
      "Clean, organic vegetables carefully selected to keep your family healthy every day.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2000&auto=format&fit=crop",
    cta: "Shop Vegetables",
  },
  {
    id: 3,
    title: "Groceries at Lightning Speed",
    description:
      "From store to your door in minutes. Freshness and speed you can rely on.",
    image:
      "https://images.unsplash.com/photo-1616627988803-39f74c97e53a?q=80&w=2000&auto=format&fit=crop",
    cta: "Start Shopping",
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Slide rotation
  useEffect(() => {
    if (!mounted) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [mounted])

  if (!mounted) return null

  const slide = slides[current]

  return (
    <section
      suppressHydrationWarning
      className="
        relative w-full overflow-hidden
        h-[65vh] min-h-[420px]
        sm:h-[70vh] sm:min-h-[480px]
        lg:h-[80vh] lg:min-h-[560px]
      "
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

          {/* Content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-6 flex items-center">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="max-w-2xl text-white space-y-6 sm:space-y-7"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-600/15 text-green-400 text-xs sm:text-sm">
                <Leaf size={14} />
                Fresh • Fast • Trusted
              </div>

              {/* Heading */}
              <h1 className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {slide.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl">
                {slide.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  href="/shop"
                  className="
                    inline-flex items-center justify-center gap-2
                    bg-green-600 hover:bg-green-700
                    text-white px-7 py-3 rounded-full
                    font-medium transition shadow-lg
                  "
                >
                  <Truck size={18} />
                  {slide.cta}
                </Link>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                  <ShieldCheck size={18} />
                  Secure payments & quality assured
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? "w-8 bg-green-500"
                : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
