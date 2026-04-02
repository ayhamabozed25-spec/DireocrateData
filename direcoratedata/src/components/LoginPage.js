import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      // سيتم تحديث currentUser تلقائيًا عبر AuthContext
    } catch (err) {
      setError("خطأ في تسجيل الدخول، تأكد من البيانات");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>
      <h2>تسجيل الدخول</h2>

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        className="form-control mt-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="كلمة المرور"
        className="form-control mt-3"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-danger mt-2">{error}</p>}

      <button className="btn btn-primary mt-3 w-100" onClick={handleLogin}>
        تسجيل الدخول
      </button>
    </div>
  );
}

export default LoginPage;
