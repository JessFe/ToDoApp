import { createContext, useContext, useEffect, useState } from "react";
import { getListsByUserId } from "../services/api";
import { useUserContext } from "./UserContext";

type FilterStatus = "To Do" | "Doing" | "Done";
type FilterTime = "All" | "Today" | "3" | "7" | "14" | "30";
type FilterBackground = "gray" | "green" | "purple" | "blue" | "orange" | "yellow" | "pink";

export type List = {
  id: number;
  name: string;
  color: string;
};

type FiltersContextType = {
  statusFilter: FilterStatus[];
  timeFilter: FilterTime;
  listsFilter: number[];
  background: FilterBackground;
  userLists: List[];
  setStatusFilter: (statuses: FilterStatus[]) => void;
  setTimeFilter: (time: FilterTime) => void;
  setListsFilter: (listIds: number[]) => void;
  setBackground: (color: FilterBackground) => void;
  loadUserLists: () => void;
  reloadTasks?: (() => void) | null;

  setReloadTasks?: (fn: () => void) => void;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

const getInitialBackground = (): FilterBackground => {
  const saved = localStorage.getItem("background") as FilterBackground | null;
  if (saved) return saved;

  // fallback (iniziale)
  const classes = document.body.classList;
  if (classes.contains("bg-teal-100")) return "green";
  if (classes.contains("bg-indigo-100")) return "purple";
  if (classes.contains("bg-blue-100")) return "blue";
  if (classes.contains("bg-orange-100")) return "orange";
  if (classes.contains("bg-yellow-100")) return "yellow";
  if (classes.contains("bg-pink-100")) return "pink";
  return "gray";
};

export const FiltersContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [statusFilter, setStatusFilter] = useState<FilterStatus[]>(["To Do", "Doing", "Done"]);
  const [timeFilter, setTimeFilter] = useState<FilterTime>("All");
  const [listsFilter, setListsFilter] = useState<number[]>([]);
  const [background, setBackground] = useState<FilterBackground>(getInitialBackground());
  const [userLists, setUserLists] = useState<List[]>([]);
  const [reloadTasks, setReloadTasks] = useState<(() => void) | null>(null);

  const { user, token } = useUserContext();

  const loadUserLists = async () => {
    if (!user || !token) return;
    const result = await getListsByUserId(user.id, token);
    if (result.success) {
      setUserLists(result.data);

      const allIds = result.data.map((l: List) => l.id).concat(-1);
      setListsFilter(allIds);
    } else {
      console.error("Errore caricamento liste:", result.message);
    }
  };

  // Carica le liste appena l'utente è loggato
  useEffect(() => {
    loadUserLists();
  }, [user, token]);

  // Salva il background nel localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("background", background);
  }, [background]);

  return (
    <FiltersContext.Provider
      value={{
        statusFilter,
        timeFilter,
        listsFilter,
        background,
        userLists,
        setStatusFilter,
        setTimeFilter,
        setListsFilter,
        setBackground,
        loadUserLists,
        reloadTasks,
        setReloadTasks,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (!context) throw new Error("useFiltersContext must be used within FiltersContextProvider");
  return context;
};
