import { useNavigate } from "react-router";
import { useUserContext } from "../context/UserContext";

const GreetingsBar = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();

  // Calcolo del saluto in base all'orario
  const getGreeting = () => {
    const hour = new Date().getHours();    // Ottiene l'ora corrente

    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 23) return "Good evening";
    return "Hello";
  };

  // Gestione del logout
  const handleLogout = () => {
    logout();      // pulisce context e localStorage
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm rounded mb-4">
      <h5 className="m-0">
        {getGreeting()}, {user?.name}!
      </h5>
      <button className="btn btn-primary btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default GreetingsBar;
