import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserContext } from "../context/UserContext";   // per verificare se loggato
import GreetingsBar from "../components/GreetingsBar";
import KanbanView from "../components/KanbanView";
import FiltersBar from "../components/FiltersBar";

const HomePage = () => {
  const { isAuthenticated } = useUserContext();
  const navigate = useNavigate();

  // Se non autenticato, reindirizza al login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container py-5">
      <GreetingsBar />

      <FiltersBar />

      <KanbanView />
    </div>
  );
};

export default HomePage;
