import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// نفس الأيقونة المستخدمة في AddBuilding
const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function MapPicker({ onSelect }) {
  const [location, setLocation] = useState(null);

  function LocationPicker() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
        onSelect(e.latlng);
      },
    });
    return location ? <Marker position={location} icon={customIcon} /> : null;
  }

  function MapController({ coords }) {
    const map = useMap();
    if (coords) {
      map.setView(coords, 15);
    }
    return null;
  }

  return (
    <div>
      <MapContainer
        center={[35.523, 35.791]}
        zoom={13}
        style={{ height: "300px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker />
        {location && <Marker position={location} icon={customIcon} />}
        <MapController coords={location} />
      </MapContainer>

      {location && (
        <p className="mt-2 text-success">
          الموقع المحدد: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
