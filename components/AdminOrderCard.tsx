"use client"

import { IOrder } from "@/models/order.model"
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  PackageCheck,
} from "lucide-react"
import { motion } from "motion/react"

export default function AdminOrderCard({ order }: { order: IOrder }) {
  const statusColor = {
    pending: "text-amber-600",
    "out of delivery": "text-blue-600",
    delivered: "text-emerald-600",
  }[order.status]

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2.5fr_1fr] gap-6 p-5">

        {/* LEFT — Order Identity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
            <PackageCheck size={18} />
            Order #{order._id?.toString().slice(-6)}
          </div>

          <p className="text-xs text-zinc-500">
            {new Date(order.createdAt!).toLocaleString()}
          </p>

          <span
            className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
              order.isPaid
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>

        {/* CENTER — Customer Info */}
        <div className="space-y-3 text-sm text-zinc-700">
          <div className="flex items-center gap-2">
            <User size={16} className="text-zinc-400" />
            {order.address.fullName}
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className="text-zinc-400" />
            {order.address.mobile}
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-zinc-400 mt-0.5" />
            <span className="line-clamp-2">
              {order.address.fullAddress}
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-500">
            <CreditCard size={16} />
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Online Payment"}
          </div>
        </div>

        {/* RIGHT — Controls */}
        <div className="flex flex-col justify-between items-end gap-4">
          <span className={`text-sm font-semibold ${statusColor}`}>
            {order.status}
          </span>

          <select
            defaultValue={order.status}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="pending">Pending</option>
            <option value="out of delivery">Out for delivery</option>
          </select>

          <div className="text-sm font-semibold text-zinc-900">
            ₹{order.totalAmount}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
