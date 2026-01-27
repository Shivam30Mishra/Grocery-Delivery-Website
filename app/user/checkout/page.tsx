"use client"

import {
  ArrowLeft,
  MapPin,
  CreditCard,
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
          setPosition([lat, lng]) // triggers reverse-geocode
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
  const { userData } = useSelector((s: RootState) => s.user)
  const { cartData } = useSelector((s: RootState) => s.cart)

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
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(fetchCurrentLocation, [])

  /* ================= REVERSE GEOCODING (FIXED) ================= */
  useEffect(() => {
    if (!position) return

    axios
      .get("/api/reverse-geocode", {
        params: {
          lat: position[0],
          lon: position[1],
        },
      })
      .then((res) => {
        const a = res.data.address || {}
        setAddress((p) => ({
          ...p,
          address: res.data.display_name || "",
          city: a.city || a.town || "",
          state: a.state || "",
          pincode: a.postcode || "",
        }))
      })
      .catch(console.error)
  }, [position])

  /* ================= SEARCH LOCATION (FIXED) ================= */
  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return

    setSearchLoading(true)
    try {
      const res = await axios.get("/api/search-location", {
        params: { q: searchQuery },
      })

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
    (s, i) => s + i.price * i.quantity,
    0
  )

  const handlePlaceOrder = async () => {
    if (payment !== "cod") return
    if (!position) return alert("Location not selected")

    setPlacingOrder(true)
    try {
      await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((i) => ({
          grocery: i._id,
          name: i.name,
          price: String(i.price),
          unit: String(i.unit),
          image: i.image,
          quantity: i.quantity,
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

      router.push("/user/order-success")
    } finally {
      setPlacingOrder(false)
    }
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-700"
        >
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-center my-8 text-green-700">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* ADDRESS */}
          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <div className="flex gap-2 font-semibold text-green-700">
              <MapPin /> Delivery Address
            </div>

            {Object.entries(address).map(([k, v]) => (
              <input
                key={k}
                value={v}
                placeholder={k}
                onChange={(e) =>
                  setAddress((p) => ({ ...p, [k]: e.target.value }))
                }
                className="w-full px-4 py-3 border rounded-xl"
              />
            ))}

            {/* SEARCH */}
            <div className="flex gap-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchLocation()}
                placeholder="Search city or area..."
                className="flex-1 px-4 py-3 border rounded-xl"
              />
              <button
                onClick={handleSearchLocation}
                className="w-12 bg-green-600 text-white rounded-xl"
              >
                {searchLoading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <Search className="mx-auto" />
                )}
              </button>
            </div>

            {/* MAP */}
            <div className="relative h-56 rounded-xl overflow-hidden border">
              {position && (
                <MapContainer center={position} zoom={15} className="h-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <DraggableMarker
                    position={position}
                    setPosition={setPosition}
                  />
                </MapContainer>
              )}

              <button
                onClick={fetchCurrentLocation}
                className="absolute bottom-4 right-4 w-12 h-12 bg-green-600 text-white rounded-full z-[500]"
              >
                {gpsLoading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <LocateFixed className="mx-auto" />
                )}
              </button>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl border p-6 space-y-6">
            <div className="font-semibold text-green-700 flex gap-2">
              <CreditCard /> Payment Method
            </div>

            <button
              onClick={() => setPayment("cod")}
              className="w-full py-4 border rounded-xl bg-green-50 font-semibold"
            >
              Cash on Delivery
            </button>

            <div className="flex justify-between font-semibold pt-4 border-t">
              <span>Total</span>
              <span className="text-green-700">₹{subtotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-3 rounded-full bg-green-600 text-white"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
