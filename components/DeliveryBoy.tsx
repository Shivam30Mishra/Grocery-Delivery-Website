"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import DeliveryBoyDashboard from "./DeliveryBoyDashboard"
import { getSocket } from "@/app/lib/socket"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import {
  MapPin,
  Package,
  Navigation,
  Activity,
  Timer,
} from "lucide-react"
import { motion } from "framer-motion"
import DeliveryChat from "./DeliveryChat"

const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false })

interface ILocation {
  latitude: number
  longitude: number
}

export default function DeliveryBoy() {
  const { userData } = useSelector((s: RootState) => s.user)

  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeOrder, setActiveOrder] = useState<any>(null)

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  })

  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  })

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on("new-assignment", ({ deliveryAssignment }) => {
      setAssignments((p) => [...p, deliveryAssignment])
    })

    return () => socket.off("new-assignment")
  }, [])

  useEffect(()=>{
    const socket = getSocket()
    socket.on("update-deliveryBoy-location",({userId,location})=>{
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0]
      })
    })
    return ()=> socket.off("update-deliveryBoy-location")
  },[])


  useEffect(() => {
    const socket = getSocket()
    if (!socket || !userData?._id || !navigator.geolocation) return

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setDeliveryBoyLocation({ latitude, longitude })

        socket.emit("updateLocation", {
          userId: userData._id,
          latitude,
          longitude,
        })
      },
      () => {},
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watcher)
  }, [userData?._id])

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/delivery/get-assignments")
        const data = await res.json()
        setAssignments(data || [])
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
    fetchCurrentOrder()
  }, [userData])

  const fetchCurrentOrder = async () => {
    try {
      const res = await axios.get("/api/delivery/current-order")
      if (res.data.active) {
        setActiveOrder(res.data.assignment)
        setUserLocation({
          latitude: res.data.assignment.order.address.latitude,
          longitude: res.data.assignment.order.address.longitude,
        })
      }
    } catch {}
  }

  const isNearby =
    Math.abs(userLocation.latitude - deliveryBoyLocation.latitude) < 0.0008 &&
    Math.abs(userLocation.longitude - deliveryBoyLocation.longitude) < 0.0008

  if (activeOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-[radial-gradient(circle_at_top,#dcfce7,white)] px-4 pt-[110px] pb-28"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-lg sm:text-xl font-semibold text-emerald-700 flex items-center gap-2">
                <Navigation size={18} />
                Active Delivery
              </h1>

              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                LIVE
              </span>
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <p className="font-medium">
                Order #{activeOrder.order._id.slice(-6)}
              </p>

              <p className="text-gray-600 flex gap-2">
                <MapPin size={16} />
                {activeOrder.order.address.fullAddress}
              </p>

              <p className="text-gray-600 flex items-center gap-2">
                <Package size={16} />
                {activeOrder.order.items.length} items
              </p>

              <div className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
                <motion.div
                  animate={{ width: isNearby ? "95%" : "70%" }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </motion.div>

          {isNearby && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-600 text-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-lg"
            >
              <Timer />
              <div>
                <p className="font-semibold">Almost there!</p>
                <p className="text-sm opacity-90">
                  Your order will arrive in a moment 🚀
                </p>
              </div>
            </motion.div>
          )}

          <motion.div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border">
            <div className="absolute top-4 left-4 z-10 bg-white/90 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow">
              <Activity size={14} className="text-emerald-600" />
              Live Delivery Tracking
            </div>

            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />

            <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id} />

          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-200 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-2xl border">
          <DeliveryBoyDashboard
            assignments={assignments}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
