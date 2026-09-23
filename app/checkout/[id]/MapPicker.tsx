"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  position: [number, number] | null;
  setPosition: (position: [number, number]) => void;
}

// =====================================================
// LEAFLET MARKER ICON
// =====================================================

const markerIcon = L.icon({
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

// =====================================================
// LOCATION MARKER
// =====================================================

function LocationMarker({
  position,
  setPosition,
}: MapPickerProps) {
  useMapEvents({
    click(event) {
      const newPosition: [number, number] = [
        event.latlng.lat,
        event.latlng.lng,
      ];

      setPosition(newPosition);
    },
  });

  if (!position) {
    return null;
  }

  return (
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
  );
}

// =====================================================
// MAP PICKER
// =====================================================

export default function MapPicker({
  position,
  setPosition,
}: MapPickerProps) {
  return (
    <MapContainer
      center={position || [27.7172, 85.324]}
      zoom={13}
      scrollWheelZoom={true}
      style={{
        height: "400px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        position={position}
        setPosition={setPosition}
      />
    </MapContainer>
  );
}