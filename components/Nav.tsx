"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  PlusCircle,
  Boxes,
  ListOrdered,
  X,
} from "lucide-react"
import { signOut } from "next-auth/react"

/* ================= TYPES ================= */

interface IUser {
  id: string
  name: string
  role: "user" | "deliveryBoy" | "admin"
  image?: string
}

/* ================= COMPONENT ================= */

export default function Nav({ user }: { user: IUser }) {
  const router = useRouter()
  const profileRef = useRef<HTMLDivElement | null>(null)
  const lastScrollY = useRef(0)

  const [visible, setVisible] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  /* ---------- SCROLL HIDE ---------- */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - lastScrollY.current) < 10) return
      setVisible(y < lastScrollY.current)
      lastScrollY.current = y
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ---------- OUTSIDE CLICK (PROFILE) ---------- */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <motion.header
        animate={{ y: visible ? 0 : -88 }}
        transition={{ duration: 0.22 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50
        w-[96%] max-w-7xl rounded-xl
        bg-white/80 backdrop-blur-xl border shadow-sm"
      >
        <nav className="px-5 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            UrbanGrocer
          </Link>

          {user.role === "user" && (
            <div className="hidden md:flex flex-1 justify-center px-6">
              <div className="flex w-full max-w-xl items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  placeholder="Search groceries"
                  className="bg-transparent w-full outline-none text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {user.role === "admin" && (
              <div className="hidden md:flex items-center gap-2">
                <NavAction href="/admin/add-grocery" icon={<PlusCircle />} label="Add" />
                <NavAction href="/admin/groceries" icon={<Boxes />} label="Groceries" />
                <NavAction href="/admin/orders" icon={<ListOrdered />} label="Orders" />
              </div>
            )}

            {user.role === "admin" && (
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {user.role === "user" && (
              <button
                onClick={() => router.push("/cart")}
                className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}

            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center"
              >
                {user.image ? (
                  <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 mt-3 w-52 bg-white rounded-xl border shadow-lg"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>

                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* ================= MOBILE ADMIN SIDEBAR ================= */}
      {mounted &&
        user.role === "admin" &&
        createPortal(
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                <motion.div
                  onClick={() => setMobileSidebarOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-40 md:hidden"
                />

                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className="fixed right-0 top-0 h-full w-72 z-50 md:hidden
                  bg-gradient-to-b from-green-700 to-green-600 text-white flex flex-col"
                >
                  {/* TOP */}
                  <div>
                    <div className="flex items-center justify-between px-5 py-4">
                      <h2 className="text-lg font-semibold">Admin Panel</h2>
                      <button onClick={() => setMobileSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="px-5 pb-4">
                      <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                        {user.image ? (
                          <Image src={user.image} alt={user.name} width={44} height={44} className="rounded-full" />
                        ) : (
                          <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs opacity-80">{user.role}</p>
                        </div>
                      </div>
                    </div>

                    <nav className="px-4 space-y-2">
                      <SidebarItem href="/admin/add-grocery" icon={<PlusCircle />} label="Add Grocery" />
                      <SidebarItem href="/admin/groceries" icon={<Boxes />} label="View Grocery" />
                      <SidebarItem href="/admin/orders" icon={<ListOrdered />} label="Manage Orders" />
                    </nav>
                  </div>

                  {/* BOTTOM LOGOUT */}
                  <div className="mt-auto px-4 py-4 border-t border-white/20">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center justify-center gap-2
                      rounded-xl bg-white/15 hover:bg-white/25 py-3 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>

                    <p className="text-center text-xs opacity-60 mt-3">
                      UrbanGrocer Admin
                    </p>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}

/* ================= UI HELPERS ================= */

function NavAction({ href, icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
    >
      {icon}
      {label}
    </Link>
  )
}

function SidebarItem({ href, icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}
