"use client"

import mongoose from "mongoose"
import Image from "next/image"
import { motion } from "motion/react"
import { ShoppingCart } from "lucide-react"

interface IGrocery {
  _id?: mongoose.Types.ObjectId
  name: string
  category: string
  price: number
  image: string
  unit: number
  createdAt: Date
  updatedAt: Date
}

export default function GroceryItemCard({ item }: { item: IGrocery }) {
  return (
    <motion.div
      /* 👇 Scroll-based reveal */
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: "easeOut" }}

      /* 👇 Hover lift */
      whileHover={{ y: -6 }}
      className="
        bg-white rounded-2xl
        border border-gray-100
        shadow-sm hover:shadow-xl
        overflow-hidden
        group
      "
    >
      {/* IMAGE */}
      <div className="relative w-full h-40 overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Category badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[11px] font-medium text-gray-700">
          {item.category}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
          {item.name}
        </h3>

        <div className="flex items-end justify-between">
          {/* PRICE */}
          <div>
            <p className="text-green-700 font-bold text-lg leading-none">
              ₹{item.price}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {item.unit} unit
            </p>
          </div>

          {/* ADD TO CART */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="
              flex items-center gap-1.5
              px-3 py-1.5
              text-sm font-medium
              rounded-lg
              bg-green-600 text-white
              hover:bg-green-700
              transition-colors
            "
          >
            <ShoppingCart size={14} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
