import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "./AuthContext";

function LoginPage() {
  const { currentUser } = useAuth();

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <div>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>تسجيل الدخول</button>
    </div>
  );
}
