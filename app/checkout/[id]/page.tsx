"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =========================================================
   FIX LEAFLET DEFAULT MARKER ICON
========================================================= */

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* =========================================================
   DEFAULT LOCATION
   Kathmandu
========================================================= */

const DEFAULT_LOCATION: [number, number] = [
  27.7172,
  85.3240,
];

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

interface LocationMarkerProps {
  position: [number, number] | null;
  setPosition: (
    position: [number, number]
  ) => void;
}

function LocationMarker({
  position,
  setPosition,
}: LocationMarkerProps) {
  useMapEvents({
    click(event) {
      const newPosition: [number, number] = [
        event.latlng.lat,
        event.latlng.lng,
      ];

      setPosition(newPosition);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (event) => {
          const marker = event.target;

          const location = marker.getLatLng();

          setPosition([
            location.lat,
            location.lng,
          ]);
        },
      }}
    />
  ) : null;
}

/* =========================================================
   CHECKOUT
========================================================= */

export default function Checkout() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  /* DELIVERY LOCATION */
  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [position, setPosition] =
    useState<[number, number] | null>(
      DEFAULT_LOCATION
    );

  const [loading, setLoading] = useState(false);

  /* =======================================================
     GET USER + CART
  ======================================================= */

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    console.log("CHECKOUT USER =", user);

    // Support both id and _id
    const id = user._id || user.id;

    console.log("CHECKOUT ID =", id);

    if (!id) return;

    setUserId(id);

    const fetchCart = async () => {
      try {
        const res = await api.get(
          `/cart/${id}`
        );

        console.log("CART =", res.data);

        setCart(res.data || []);
      } catch (error) {
        console.log(
          "Failed to fetch cart:",
          error
        );
      }
    };

    fetchCart();
  }, []);

  /* =======================================================
     TOTAL
  ======================================================= */

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

  /* =======================================================
     PLACE ORDER
  ======================================================= */

  const placeOrder = async () => {
    if (!userId) {
      alert("User not found.");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert(
        "Please enter your delivery address."
      );
      return;
    }

    if (!position) {
      alert(
        "Please select your delivery location on the map."
      );
      return;
    }

    try {
      setLoading(true);

      const [latitude, longitude] =
        position;

      console.log(
        "USER ID =",
        userId
      );

      console.log(
        "DELIVERY ADDRESS =",
        deliveryAddress
      );

      console.log(
        "LATITUDE =",
        latitude
      );

      console.log(
        "LONGITUDE =",
        longitude
      );

      const res = await api.post(
        `/orders/create-from-cart/${userId}`,
        {
          deliveryAddress,
          latitude,
          longitude,
        }
      );

      console.log(
        "ORDER CREATED =",
        res.data
      );

      /* CLEAR CART */

      await api.delete(
        `/cart/clear/${userId}`
      );

      router.push(
        "/order-success"
      );
    } catch (error) {
      console.log(
        "ORDER CREATION ERROR =",
        error
      );

      alert(
        "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold">
            Checkout
          </h1>

          <p className="text-gray-500 mt-1">
            Enter your delivery details
            and select your location.
          </p>
        </div>

        {/* =================================================
            CART
        ================================================= */}

        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">
            Your Order
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity:{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <span className="font-medium">
                    $
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TOTAL */}

          <div className="flex justify-between mt-5 text-lg font-bold">
            <span>Total</span>

            <span>
              $
              {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* =================================================
            DELIVERY ADDRESS
        ================================================= */}

        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold">
            Delivery Address
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter the address where you
            want your order delivered.
          </p>

          <textarea
            value={deliveryAddress}
            onChange={(e) =>
              setDeliveryAddress(
                e.target.value
              )
            }
            placeholder="Example: New Baneshwor, Kathmandu"
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 mt-4 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* =================================================
            MAP
        ================================================= */}

        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold">
            Select Delivery Location
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Click on the map to select your
            delivery location. You can also
            drag the marker.
          </p>

          <div className="mt-4 rounded-xl overflow-hidden border">
            <MapContainer
              center={DEFAULT_LOCATION}
              zoom={13}
              scrollWheelZoom={true}
              style={{
                height: "400px",
                width: "100%",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationMarker
                position={position}
                setPosition={setPosition}
              />
            </MapContainer>
          </div>

          {/* =================================================
              SELECTED LOCATION
          ================================================= */}

          {position && (
            <div className="mt-4 bg-gray-50 border rounded-lg p-4">
              <p className="font-medium">
                Selected Location
              </p>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Latitude
                  </p>

                  <p className="text-sm font-medium">
                    {position[0].toFixed(6)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Longitude
                  </p>

                  <p className="text-sm font-medium">
                    {position[1].toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            PLACE ORDER
        ================================================= */}

        <button
          onClick={placeOrder}
          disabled={
            loading ||
            cart.length === 0
          }
          className="w-full bg-black text-white py-3 rounded-lg mt-6 font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading
            ? "Placing Order..."
            : "Place Order"}
        </button>

      </div>
    </div>
  );
}