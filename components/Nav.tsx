"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Search, ShoppingCart, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

interface IUser {
  id: string
  name: string
  role: "user" | "deliveryBoy" | "admin"
  image?: string
}

export default function Nav({ user }: { user: IUser }) {
  const router = useRouter()

  const menuRef = useRef<HTMLDivElement | null>(null)
  const lastScrollY = useRef(0)

  const [visible, setVisible] = useState(true)
  const [openMenu, setOpenMenu] = useState(false)

  /* ---------- SCROLL HIDE / SHOW ---------- */
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (Math.abs(currentY - lastScrollY.current) < 12) return

      setVisible(currentY < lastScrollY.current)
      lastScrollY.current = currentY
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* ---------- OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openMenu])

  return (
    <motion.header
      animate={{ y: visible ? 0 : -90 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[94%] max-w-7xl
        rounded-2xl
        bg-white/80 backdrop-blur-md
        border border-black/5
        shadow-[0_6px_18px_rgba(0,0,0,0.06)]
      "
    >
      <nav className="px-4 sm:px-6 py-3 space-y-3">
        {/* ===== TOP ROW ===== */}
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-semibold text-gray-900"
          >
            UrbanGrocer
          </Link>

          {/* DESKTOP SEARCH (CENTERED) */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="w-full max-w-xl flex items-center bg-gray-100/70 border border-gray-200 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search groceries"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* CART */}
            <button
              onClick={() => router.push("/cart")}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>

            {/* PROFILE */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpenMenu((p) => !p)}
                className="flex items-center px-2 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </button>

              {/* DROPDOWN */}
              <AnimatePresence>
                {openMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl border shadow-lg"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>

                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ===== MOBILE SEARCH ===== */}
        <div className="md:hidden">
          <div className="flex items-center bg-gray-100/70 border border-gray-200 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search groceries"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
