import { useNavigate } from "react-router";
import { useUserContext } from "../context/UserContext";

const GreetingsBar = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();

  // Calcolo del saluto in base all'orario
  const currentHour = new Date().getHours();
  const greeting = currentHour >= 5 && currentHour < 17 ? "Good morning" : "Good evening";

  // Gestione del logout
  const handleLogout = () => {
    logout(); // pulisce context e localStorage
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm rounded mb-4">
      <h5 className="m-0">
        {greeting}, {user?.name}!
      </h5>
      <button className="btn btn-primary btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default GreetingsBar;
