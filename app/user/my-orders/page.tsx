"use client"

import { IOrder } from "@/models/order.model";
import axios from "axios";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserOrderCard from "@/components/UserOrderCard";
import { motion } from "motion/react"
import { getSocket } from "@/app/lib/socket";
import { IUser } from "@/models/user.model";

interface IOrder {
  _id?: any
  user: any
  assignment?: any
  items: {
    grocery: any
    name: string
    price: string
    unit: string
    image: string
    quantity: number
  }[]
  assignedDeliveryBoy?: IUser
  totalAmount: number
  paymentMethod: "cod" | "online"
  isPaid: boolean
  address: {
    fullName: string
    mobile: string
    fullAddress: string
    city: string
    state: string
    pincode: string
    latitude: number
    longitude: number
  }
  status: "pending" | "out of delivery" | "delivered"
  createdAt?: Date
  updatedAt?: Date
}

export default function MyOrdersPage() {
  const router = useRouter()

  const [orders,setOrders]   = useState<IOrder[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const socket = getSocket()
    socket.on("order-assigned",({assignedDeliveryBoy,orderId}:any)=>{
      console.log(assignedDeliveryBoy,orderId)

    })
  },[])

    useEffect(() => {
        const getMyOrders = async () => {
            try{
              const result = await axios.get("/api/user/my-orders")
              console.log(result)
              setOrders(result.data.orders)
              setLoading(false)
            }catch(error){
              console.log(error)
            }
        } 
        getMyOrders()
    }, [])  

    if(loading){
      return <div className="flex items-center justify-center h-screen font-semibold text-green-700 text-2xl ">Loading you Orders ......</div>
    }

    return (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
    
    {/* Header */}
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b">
      <div className="max-w-4xl mx-auto px-5 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition"
        >
          <ArrowLeft className="text-emerald-700" />
        </button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500">
            Track, review & manage your purchases
          </p>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="max-w-4xl mx-auto px-5 py-10 space-y-6">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24">
          <PackageSearch size={90} className="text-emerald-400 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800">
            No orders yet
          </h2>
          <p className="text-gray-500 mt-2 max-w-sm">
            Once you place an order, it will appear here with live status updates.
          </p>
        </div>
      ) : (
        orders.map(order => (
          <UserOrderCard key={order._id?.toString()} order={order} />
        ))
      )}
    </div>
  </div>
)
}