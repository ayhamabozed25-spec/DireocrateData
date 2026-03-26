// DepartmentsForm.js
import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function DepartmentsForm({ institutionId }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(doc(db, "institutions", institutionId), "departments"), {
      name: e.target.name.value,
      head: e.target.head.value,
    });
    alert("تم حفظ القسم ✅");
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="اسم القسم" />
      <input name="head" placeholder="رئيس القسم" />
      <button type="submit">حفظ القسم</button>
    </form>
  );
}
