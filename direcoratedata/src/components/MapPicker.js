import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

export default function MapPicker({ onSelect }) {
  const [position, setPosition] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelect(e.latlng);
      }
    });

    return position ? <Marker position={position} /> : null;
  }

  return (
    <MapContainer center={[33.5, 36.3]} zoom={10} style={{ width: "100%", height: "400px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
