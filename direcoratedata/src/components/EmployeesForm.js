// EmployeesForm.js
import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function EmployeesForm({ institutionId, departmentId }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(doc(db, "institutions", institutionId)
      .collection("departments").doc(departmentId), "employees"), {
      name: e.target.name.value,
      age: e.target.age.value,
      contract: e.target.contract.value,
      qualification: e.target.qualification.value,
    });
    alert("تم حفظ الموظف ✅");
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="اسم الموظف" />
      <input type="number" name="age" placeholder="العمر" />
      <input name="contract" placeholder="نوع العقد" />
      <input name="qualification" placeholder="المؤهل" />
      <button type="submit">حفظ الموظف</button>
    </form>
  );
}
