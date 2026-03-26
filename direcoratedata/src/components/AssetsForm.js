import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function AssetsForm({ institutionId, departmentId, employeeId }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(doc(db, "institutions", institutionId)
      .collection("departments").doc(departmentId)
      .collection("employees").doc(employeeId), "assets"), {
      type: e.target.type.value,
      description: e.target.description.value,
      status: e.target.status.value,
    });
    alert("تم حفظ الأصل ✅");
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="type" placeholder="نوع الأصل (جهاز/أثاث/مركبة)" />
      <input name="description" placeholder="الوصف" />
      <input name="status" placeholder="الحالة" />
      <button type="submit">حفظ الأصل</button>
    </form>
  );
}
