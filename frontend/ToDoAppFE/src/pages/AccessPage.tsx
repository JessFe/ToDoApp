import { useLocation, useNavigate } from "react-router";
import LoginRegisterForm from "../components/LoginRegisterForm";
import { useUserContext } from "../context/UserContext";
import { login as loginAPI, register as registerAPI } from "../services/api";
import { useState } from "react";
import ToastMessage from "../components/ToastMessage";

const AccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useUserContext();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Mode in base al path corrente
  const mode = location.pathname === "/register" ? "register" : "login";

  // Gestisce il submit del form login o register
  const handleSubmit = async (data: { username: string; password: string; name?: string }) => {
    if (mode === "login") {
      const result = await loginAPI({ username: data.username, password: data.password });

      if (!result.success) {
        setToast({ message: result.message || "Something went wrong", type: "error" });
        return;
      }

      // Salva utente e token nel context
      login(result.data.token, result.data.user);
      navigate("/home");
    }

    if (mode === "register") {
      if (!data.name) {
        alert("Name is required.");
        return;
      }

      const result = await registerAPI({
        name: data.name,
        username: data.username,
        password: data.password,
      });

      if (!result.success) {
        setToast({ message: result.message || "Something went wrong", type: "error" });
        return;
      }

      setToast({ message: "Registration successful! Now you can log in.", type: "success" });
      setTimeout(() => navigate("/login"), 1000);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div>
        <LoginRegisterForm mode={mode} onSubmit={handleSubmit} />

        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
};

export default AccessPage;
