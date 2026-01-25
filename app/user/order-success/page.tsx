"use client"

import { motion } from "motion/react"
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          max-w-xl w-full
          bg-white rounded-3xl
          shadow-xl border
          p-8 sm:p-10
          text-center
        "
      >
        {/* SUCCESS ICON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
          className="
            mx-auto mb-6
            w-20 h-20
            rounded-full
            bg-green-100
            flex items-center justify-center
          "
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900"
        >
          Order Placed Successfully!
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-3 text-gray-600 text-sm sm:text-base"
        >
          Thank you for shopping with us.  
          Your groceries are being prepared and will be delivered soon.
        </motion.p>

        {/* STATUS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border">
            <Package className="text-green-600" />
            <div className="text-left">
              <p className="text-sm font-semibold">Order Status</p>
              <p className="text-xs text-gray-500">Preparing your items</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border">
            <ShoppingBag className="text-green-600" />
            <div className="text-left">
              <p className="text-sm font-semibold">Delivery</p>
              <p className="text-xs text-gray-500">Fast & secure delivery</p>
            </div>
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 space-y-4"
        >
          {/* PRIMARY CTA */}
          <Link
            href="/user/my-orders"
            className="
              block w-full
              py-3 rounded-full
              bg-green-600 text-white
              font-medium
              hover:bg-green-700
              hover:shadow-lg
              transition
            "
          >
            Track Your Order
          </Link>

          {/* SECONDARY CTA */}
          <Link
            href="/"
            className="
              flex items-center justify-center gap-2
              text-sm font-medium
              text-green-700
              hover:text-green-900
              transition
            "
          >
            <Home size={16} />
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
