import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function StrengthsForm({ institutionId }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(doc(db, "institutions", institutionId), "strengths"), {
      point: e.target.point.value,
      priority: e.target.priority.value,
    });
    alert("تم حفظ نقطة القوة ✅");
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="point" placeholder="نقطة القوة" />
      <input type="number" name="priority" placeholder="الأولوية (1-5)" />
      <button type="submit">حفظ</button>
    </form>
  );
}
