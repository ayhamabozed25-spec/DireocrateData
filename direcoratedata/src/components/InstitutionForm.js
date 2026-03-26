import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function InstitutionForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "institutions"), {
      name: e.target.name.value,
      manager: e.target.manager.value,
      ministry: e.target.ministry.value,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
    });
    alert("تم حفظ المؤسسة بنجاح ✅");
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="اسم المؤسسة" />
      <input name="manager" placeholder="مدير المؤسسة" />
      <input name="ministry" placeholder="الوزارة" />
      <input type="date" name="startDate" />
      <input type="date" name="endDate" />
      <button type="submit">حفظ المؤسسة</button>
    </form>
  );
}
