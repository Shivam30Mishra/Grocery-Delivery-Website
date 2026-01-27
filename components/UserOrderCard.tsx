"use client"

import { IOrder } from "@/models/order.model"
import { ChevronDown, MapPin, CreditCard } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

export default function UserOrderCard({ order }: { order: IOrder }) {
  const [open, setOpen] = useState(false)

  const statusMap = {
    pending: "bg-amber-100 text-amber-800",
    "out of delivery": "bg-sky-100 text-sky-800",
    delivered: "bg-emerald-100 text-emerald-800",
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/60 overflow-hidden"
    >
      {/* Top */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Order</p>
            <h3 className="text-lg font-semibold text-gray-900">
              #{order._id?.toString().slice(-6)}
            </h3>
          </div>

          <span
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusMap[order.status]}`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <CreditCard size={16} />
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
          </span>

          <span className="font-semibold text-gray-800">
            ₹{order.totalAmount}
          </span>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-500">
          <MapPin size={16} className="mt-0.5" />
          <p className="line-clamp-2">{order.address.fullAddress}</p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          {open ? "Hide items" : `View ${order.items.length} items`}
          <ChevronDown
            size={18}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6 py-4 bg-gradient-to-br from-gray-50 to-white border-t space-y-3"
          >
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty {item.quantity} · {item.unit}
                  </p>
                </div>
                <p className="font-semibold">
                  ₹{Number(item.price) * item.quantity}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
