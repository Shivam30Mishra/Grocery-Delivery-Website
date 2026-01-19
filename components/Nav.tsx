"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Search, ShoppingCart, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

/* ---------------- TYPES ---------------- */

interface IUser {
  id: string
  name: string
  role: "user" | "deliveryBoy" | "admin"
  image?: string
}

/* ---------------- COMPONENT ---------------- */

export default function Nav({ user }: { user: IUser }) {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement | null>(null)

  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [openMenu, setOpenMenu] = useState(false)

  /* Scroll-aware hide/show */
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (Math.abs(currentY - lastScrollY) < 12) return

      setVisible(currentY < lastScrollY)
      setLastScrollY(currentY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* LOGO */}
        <Link
          href="/"
          className="
            text-xl sm:text-2xl
            font-semibold tracking-tight
            text-gray-900
            hover:opacity-80 transition
          "
        >
          UrbanGrocer
        </Link>

        {/* SEARCH (DESKTOP ONLY) */}
        <div
          className="
            hidden md:flex items-center
            w-80
            bg-gray-100/70
            border border-gray-200
            rounded-full
            px-4 py-2
            focus-within:ring-2 focus-within:ring-gray-300
          "
        >
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search groceries"
            className="
              w-full bg-transparent
              outline-none border-none
              text-sm placeholder-gray-400
            "
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 relative">
          {/* CART */}
          <button
            type="button"
            onClick={() => router.push("/cart")}
            aria-label="Cart"
            className="
              p-2.5 rounded-full
              bg-gray-100 hover:bg-gray-200
              transition
            "
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>

          {/* PROFILE */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => !prev)}
              aria-label="Profile menu"
              className="
                flex items-center gap-2
                px-2 py-1.5 rounded-full
                bg-gray-100 hover:bg-gray-200
                transition
              "
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
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
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="
                    absolute right-0 mt-3 w-56
                    bg-white rounded-xl
                    border border-gray-200
                    shadow-lg
                    overflow-hidden
                  "
                >
                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="
                      w-full flex items-center gap-3
                      px-4 py-3
                      text-sm text-gray-700
                      hover:bg-gray-50
                      transition
                    "
                  >
                    <LogOut className="w-4 h-4 text-gray-500" />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
