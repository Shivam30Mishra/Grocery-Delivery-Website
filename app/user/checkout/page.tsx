"use client"

import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Wallet,
  Search,
  Loader2,
  LocateFixed,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useEffect, useState } from "react"
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"
import { motion, AnimatePresence } from "motion/react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import axios from "axios"

/* ================= MAP ICON ================= */

const markerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [28, 45],
  iconAnchor: [14, 45],
})

/* ================= DRAGGABLE MARKER ================= */

function DraggableMarker({
  position,
  setPosition,
}: {
  position: [number, number]
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>
}) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, 15, { animate: true })
  }, [position, map])

  return (
    <Marker
      icon={markerIcon}
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target as L.Marker
          const { lat, lng } = marker.getLatLng()
          setPosition([lat, lng])
        },
      }}
    >
      <Popup>Delivery Location</Popup>
    </Marker>
  )
}

/* ================= PAGE ================= */

export default function CheckoutPage() {
  const router = useRouter()
  const { userData } = useSelector((state: RootState) => state.user)
  const { cartData } = useSelector((state: RootState) => state.cart)

  const [position, setPosition] = useState<[number, number] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [payment, setPayment] = useState<"cod" | "online">("cod")

  const [address, setAddress] = useState({
    fullName: userData?.name || "",
    mobile: userData?.mobile || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  /* ================= CURRENT LOCATION ================= */

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) return

    setGpsLoading(true)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
        setGpsLoading(false)
      },
      (err) => {
        console.error(err)
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(fetchCurrentLocation, [])

  /* ================= REVERSE GEOCODING ================= */

  useEffect(() => {
    if (!position) return

    const fetchAddress = async () => {
      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: {
              lat: position[0],
              lon: position[1],
              format: "json",
            },
          }
        )

        const a = res.data.address || {}

        setAddress((prev) => ({
          ...prev,
          address: res.data.display_name || "",
          city: a.city || a.town || "",
          state: a.state || "",
          pincode: a.postcode || "",
        }))
      } catch (err) {
        console.error(err)
      }
    }

    fetchAddress()
  }, [position])

  /* ================= SEARCH LOCATION ================= */

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return

    setSearchLoading(true)

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: searchQuery, format: "json", limit: 1 },
        }
      )

      if (res.data?.length) {
        setPosition([+res.data[0].lat, +res.data[0].lon])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSearchLoading(false)
    }
  }

  /* ================= ORDER ================= */

  const subtotal = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handlePlaceOrder = async () => {
    if (payment !== "cod") return
    if (!position) return alert("Location not selected")

    setPlacingOrder(true)

    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,

        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: String(item.price),
          unit: String(item.unit),
          image: item.image,
          quantity: item.quantity,
        })),

        paymentMethod: "cod",
        totalAmount: subtotal,

        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          fullAddress: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          latitude: position[0],
          longitude: position[1],
        },
      })

      console.log(result.data)
      // router.push("/user/orders")
    } catch (err) {
      console.error(err)
      alert("Failed to place order")
    } finally {
      setPlacingOrder(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-700 hover:text-green-900 transition"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-center mt-6 mb-10 text-green-700">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl border p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-green-700">
              <MapPin />
              Delivery Address
            </div>

            {Object.entries(address).map(([key, value]) => (
              <input
                key={key}
                placeholder={key}
                value={value}
                onChange={(e) =>
                  setAddress((p) => ({ ...p, [key]: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 transition"
              />
            ))}

            {/* SEARCH */}
            <div className="flex gap-2">
              <input
                placeholder="Search city or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchLocation()}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500"
              />

              <button
                onClick={handleSearchLocation}
                className="w-12 rounded-xl bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition"
              >
                {searchLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Search size={18} />
                )}
              </button>
            </div>

            {/* MAP */}
            <div className="relative h-56 rounded-xl overflow-hidden border bg-gray-100">
              {position && (
                <MapContainer center={position} zoom={15} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <DraggableMarker position={position} setPosition={setPosition} />
                </MapContainer>
              )}

              {/* GPS BUTTON */}
              <button
                onClick={fetchCurrentLocation}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-xl hover:bg-green-700 transition z-[500]"
              >
                {gpsLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <LocateFixed size={18} />
                )}
              </button>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl border p-6 space-y-6 shadow-sm">
            <div className="font-semibold text-green-700 flex items-center gap-2">
              <CreditCard />
              Payment Method
            </div>

            <button
              onClick={() => setPayment("online")}
              className={`w-full px-5 py-4 rounded-xl border ${
                payment === "online"
                  ? "border-green-600 bg-green-50 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              Pay Online (Stripe)
            </button>

            <button
              onClick={() => setPayment("cod")}
              className={`w-full px-5 py-4 rounded-xl border ${
                payment === "cod"
                  ? "border-green-600 bg-green-50 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              Cash on Delivery
            </button>

            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-green-700">₹{subtotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-70"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
