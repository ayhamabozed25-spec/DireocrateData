import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// أيقونة مخصصة
const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function MapPicker({ onSelect }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [radius, setRadius] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [streetName, setStreetName] = useState("");

  // اختيار الموقع بالنقر
  function LocationPicker() {
    useMapEvents({
      click(e) {
        updateLocation(e.latlng);
      },
    });
    return location ? (
      <Marker
        position={location}
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const newPos = e.target.getLatLng();
            updateLocation(newPos);
          },
        }}
      />
    ) : null;
  }

  // تحريك الخريطة عند تغيير الإحداثيات
  function MapController({ coords }) {
    const map = useMap();
    if (coords) map.setView(coords, 15);
    return null;
  }

  // تحديث الموقع + جلب اسم الشارع
  const updateLocation = async (coords) => {
    setLocation(coords);
    onSelect(coords);

    // Reverse Geocoding
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
    );
    const data = await res.json();
    setStreetName(data?.display_name || "غير معروف");
  };

  // البحث مع اقتراحات (Autocomplete)
  useEffect(() => {
    if (address.length < 3) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    }, 400);

    return () => clearTimeout(delay);
  }, [address]);

  // عند اختيار اقتراح
  const handleSuggestionClick = (item) => {
    const coords = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    updateLocation(coords);
    setAddress(item.display_name);
    setSuggestions([]);
  };

  // زر تحديد الموقع الحالي GPS
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        updateLocation(coords);
      },
      () => alert("تعذر الحصول على الموقع الحالي")
    );
  };

  // مسح الموقع
  const clearLocation = () => {
    setLocation(null);
    setStreetName("");
    onSelect(null);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* البحث */}
      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="ابحث عن عنوان..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="btn btn-info" onClick={handleCurrentLocation}>
          موقعي
        </button>
        <button className="btn btn-danger" onClick={clearLocation}>
          مسح
        </button>
      </div>

      {/* اقتراحات البحث */}
      {suggestions.length > 0 && (
        <ul
          className="list-group"
          style={{
            position: "absolute",
            zIndex: 999,
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((item, i) => (
            <li
              key={i}
              className="list-group-item list-group-item-action"
              onClick={() => handleSuggestionClick(item)}
              style={{ cursor: "pointer" }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* نصف قطر الدائرة */}
      <div className="mb-2 mt-2">
        <label>نصف القطر (متر):</label>
        <input
          type="number"
          className="form-control"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          placeholder="0 بدون دائرة"
        />
      </div>

      {/* Dark Mode */}
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        <label className="form-check-label">الوضع الليلي</label>
      </div>

      {/* الخريطة */}
      <MapContainer
        center={[35.523, 35.791]}
        zoom={13}
        style={{ height: "300px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          url={
            darkMode
              ? "https://tiles.stadiamaps.com/tiles/alidade_dark/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        <LocationPicker />
        {location && radius > 0 && (
          <Circle center={location} radius={radius} color="blue" />
        )}
        <MapController coords={location} />
      </MapContainer>

      {location && (
        <p className="mt-2 text-success">
          <strong>الإحداثيات:</strong> {location.lat.toFixed(5)},{" "}
          {location.lng.toFixed(5)} <br />
          <strong>العنوان:</strong> {streetName}
        </p>
      )}
    </div>
  );
}
