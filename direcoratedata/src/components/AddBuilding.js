import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

export default function AddBuilding() {
  const [ownership, setOwnership] = useState("");
  const [structuralCondition, setStructuralCondition] = useState("");
  const [currency, setCurrency] = useState("دولار");
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "buildings"), {
      name: e.target.name.value,
      cost:
        ownership !== "بناء حكومي"
          ? {
              value: parseFloat(e.target.cost.value),
              currency,
            }
          : null,
      ownership: ownership === "أخرى" ? e.target.otherOwnership.value : ownership,
      floors: parseInt(e.target.floors.value),
      offices: parseInt(e.target.offices.value),
      capacity: parseInt(e.target.capacity.value),
      area: parseFloat(e.target.area.value),
      buildingDate: e.target.buildingDate.value,
      structuralCondition,
      riskLevel:
        structuralCondition === "بحاجة ترميم جزئي" ||
        structuralCondition === "بحاجة ترميم كلي"
          ? e.target.riskLevel.value
          : null,
      restorationDate:
        structuralCondition !== "جيد جدا"
          ? e.target.restorationDate.value
          : null,
      restorationDetails:
        structuralCondition === "مرمم حديثا"
          ? e.target.restorationDetails.value
          : null,
      fireAlarmSystem: e.target.fireAlarmSystem.value,
      fingerprintSystem: e.target.fingerprintSystem.value,
      location,
    });

    alert("تم حفظ معلومات البناء بنجاح");
    e.target.reset();
    setOwnership("");
    setStructuralCondition("");
    setCurrency("دولار");
    setLocation(null);
    setAddress("");
  };

  function LocationPicker() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    });
    return location ? <Marker position={location} /> : null;
  }

  const handleSearchAddress = async () => {
    if (!address) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      alert("لم يتم العثور على الموقع");
    }
  };

  return (
    <div className="p-3">
      <h3>إضافة بناء جديد</h3>

      <Form onSubmit={handleSubmit}>
        {/* باقي الحقول كما في الكود السابق */}

        <Form.Group>
          <Form.Label>الموقع</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="أدخل العنوان (مدينة، شارع...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button variant="secondary" onClick={handleSearchAddress}>
                بحث
              </Button>
            </Col>
          </Row>
        </Form.Group>

        <MapContainer
          center={[35.523, 35.791]}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker />
          {location && <Marker position={location} />}
        </MapContainer>

        {location && (
          <p>
            الموقع المحدد: {location.lat}, {location.lng}
          </p>
        )}

        <Button type="submit" className="mt-3">
          حفظ معلومات البناء
        </Button>
      </Form>
    </div>
  );
}
