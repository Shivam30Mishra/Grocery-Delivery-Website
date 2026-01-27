"use client"

import { IOrder } from "@/models/order.model"
import axios from "axios"
import { useEffect, useState } from "react"
import AdminOrderCard from "@/components/AdminOrderCard"

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/auth/admin/get-orders")
      setOrders(res.data.orders)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-[#6E6E73]">
            Manage customer orders and delivery status
          </p>
        </header>

        {/* List */}
        <div className="bg-white rounded-xl overflow-hidden divide-y divide-[#E5E5EA]">
          {loading ? (
            <div className="p-6 text-sm text-[#6E6E73]">
              Loading…
            </div>
          ) : (
            orders.map(order => (
              <AdminOrderCard key={order._id?.toString()} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
