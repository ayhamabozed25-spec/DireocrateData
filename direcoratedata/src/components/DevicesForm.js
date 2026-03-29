import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function AddDevice() {
  const [employees, setEmployees] = useState([]);

  const [need, setNeed] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [processor, setProcessor] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      const data = snapshot.docs.map(doc => ({
        value: doc.data().name,
        label: doc.data().name
      }));
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const brandOptions = {
    "لاب توب": ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "أخرى"],
    "سيرفر": ["Dell", "HP", "IBM", "Cisco", "Supermicro", "أخرى"],
    "حاسوب مكتبي": ["Dell", "HP", "Lenovo", "Asus", "MSI", "أخرى"],
    "تاب": ["Samsung", "Apple", "Huawei", "Lenovo", "أخرى"],
    "طابعة": ["Canon", "HP", "Epson", "Brother", "أخرى"],
    "راوتر": ["Cisco", "TP-Link", "Netgear", "Huawei", "أخرى"],
    "أخرى": ["أخرى"]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "devices"), {
      need,
      type: deviceType === "أخرى" ? e.target.otherType.value : deviceType,
      brand: brand === "أخرى" ? e.target.otherBrand.value : brand,
      model: e.target.model.value,
      processor: processor === "أخرى" ? e.target.otherProcessor.value : processor,
      ram: e.target.ram?.value || null,
      employee: need === "مطلوب" ? null : e.target.employee.value,
      purchaseDate: need === "مطلوب" ? null : e.target.purchaseDate.value,
      cost: parseFloat(e.target.cost.value),
      status: need === "مطلوب" ? null : status,
      breakdown: status === "معطل" ? e.target.breakdown.value : null,
      effect: (status === "معطل" || status === "يعمل بأداء ضعيف") ? e.target.effect.value : null,
      priority: status === "معطل" ? e.target.priority.value : null,
      description: e.target.description.value,
      notes: e.target.notes.value || null,
    });

    alert("تم حفظ الجهاز بنجاح");
    e.target.reset();
    setNeed("");
    setDeviceType("");
    setBrand("");
    setStatus("");
    setProcessor("");
  };

  return (
    <div className="p-3">
      <h3>إضافة جهاز جديد</h3>

      <Form onSubmit={handleSubmit}>

        {/* الحاجة */}
        <Form.Group>
          <Form.Label>الحاجة</Form.Label>
          <Form.Select value={need} onChange={(e) => setNeed(e.target.value)} required>
            <option value="">اختر</option>
            <option value="مطلوب">مطلوب</option>
            <option value="متوفر">متوفر</option>
          </Form.Select>
        </Form.Group>

        {/* نوع الجهاز */}
        <Form.Group>
          <Form.Label>نوع الجهاز</Form.Label>
          <Form.Select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} required>
            <option value="">اختر</option>
            <option value="لاب توب">لاب توب</option>
            <option value="سيرفر">سيرفر</option>
            <option value="حاسوب مكتبي">حاسوب مكتبي</option>
            <option value="تاب">تاب</option>
            <option value="طابعة">طابعة</option>
            <option value="راوتر">راوتر</option>
            <option value="أخرى">أخرى</option>
          </Form.Select>
        </Form.Group>

        {deviceType === "أخرى" && (
          <Form.Group>
            <Form.Label>نوع آخر</Form.Label>
            <Form.Control name="otherType" required />
          </Form.Group>
        )}

        {/* إذا كان الجهاز متوفر */}
        {need === "متوفر" && deviceType && (
          <>
            {/* البراند */}
            <Form.Group>
              <Form.Label>البراند</Form.Label>
              <Form.Select value={brand} onChange={(e) => setBrand(e.target.value)} required>
                <option value="">اختر</option>
                {brandOptions[deviceType]?.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {brand === "أخرى" && (
              <Form.Group>
                <Form.Label>براند آخر</Form.Label>
                <Form.Control name="otherBrand" required />
              </Form.Group>
            )}

            {/* الموديل */}
            <Form.Group>
              <Form.Label>الموديل</Form.Label>
              <Form.Control name="model" required />
            </Form.Group>

            {/* المعالج */}
            {(deviceType === "لاب توب" || deviceType === "سيرفر" || deviceType === "حاسوب مكتبي") && (
              <Form.Group>
                <Form.Label>المعالج</Form.Label>
                <Form.Select value={processor} onChange={(e) => setProcessor(e.target.value)} required>
                  <option value="">اختر</option>
                  <option value="Intel i3">Intel i3</option>
                  <option value="Intel i5">Intel i5</option>
                  <option value="Intel i7">Intel i7</option>
                  <option value="Intel i9">Intel i9</option>
                  <option value="AMD Ryzen 3">AMD Ryzen 3</option>
                  <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                  <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                  <option value="AMD Ryzen 9">AMD Ryzen 9</option>
                  <option value="أخرى">أخرى</option>
                </Form.Select>
              </Form.Group>
            )}

            {processor === "أخرى" && (
              <Form.Group>
                <Form.Label>معالج آخر</Form.Label>
                <Form.Control name="otherProcessor" required />
              </Form.Group>
            )}

            {/* RAM */}
            {(deviceType === "لاب توب" || deviceType === "سيرفر" || deviceType === "تاب" || deviceType === "حاسوب مكتبي") && (
              <Form.Group>
                <Form.Label>الذاكرة RAM</Form.Label>
                <Form.Select name="ram" required>
                  <option value="">اختر</option>
                  <option value="2">2 GB</option>
                  <option value="4">4 GB</option>
                  <option value="8">8 GB</option>
                  <option value="16">16 GB</option>
                  <option value="32">32 GB</option>
                </Form.Select>
              </Form.Group>
            )}

            {/* تاريخ الشراء */}
            <Form.Group>
              <Form.Label>تاريخ الشراء</Form.Label>
              <Form.Control type="date" name="purchaseDate" required />
            </Form.Group>

            {/* الموظف */}
            <Form.Group>
              <Form.Label>الموظف</Form.Label>
              <Select options={employees} name="employee" placeholder="اختر الموظف" isSearchable />
            </Form.Group>

            {/* الكلفة */}
            <Form.Group>
              <Form.Label>الكلفة (بالدولار)</Form.Label>
              <Form.Control type="number" step="0.01" name="cost" required />
            </Form.Group>

            {/* الحالة */}
            <Form.Group>
              <Form.Label>الحالة</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="يعمل بشكل جيد">يعمل بشكل جيد</option>
                <option value="يعمل بأداء ضعيف">يعمل بأداء ضعيف</option>
                <option value="معطل">معطل</option>
              </Form.Select>
            </Form.Group>

            {/* وصف العطل */}
            {status === "معطل" && (
              <>
                <Form.Group>
                  <Form.Label>وصف العطل</Form.Label>
                  <Form.Control name="breakdown" required />
                </Form.Group>

                <Form.Group>
                  <Form.Label>أولوية الإصلاح (1-5)</Form.Label>
                  <Form.Control type="number" min="1" max="5" name="priority" required />
                </Form.Group>
              </>
            )}

            {/* التأثير */}
            {(status === "معطل" || status === "يعمل بأداء ضعيف") && (
              <Form.Group>
                <Form.Label>التأثير على الخدمة (%)</Form.Label>
                <Form.Control type="number" name="effect" required />
              </Form.Group>
            )}
          </>
        )}

        {/* الوصف */}
        <Form.Group>
          <Form.Label>الوصف</Form.Label>
          <Form.Control name="description" required />
        </Form.Group>

        {/* ملاحظات */}
        <Form.Group>
          <Form.Label>ملاحظات</Form.Label>
          <Form.Control name="notes" />
        </Form.Group>

        <Button type="submit" className="mt-3">حفظ الجهاز</Button>
      </Form>
    </div>
  );
}
