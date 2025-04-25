import { createContext, useContext, useEffect, useState } from "react";
import { getListsByUserId } from "../services/api"; // per ottenere le liste dell'utente
import { useUserContext } from "./UserContext"; // per accedere a user e token

// Definizione dei valori possibili per i filtri Status e Time, e per lo sfondo
type FilterStatus = "To Do" | "Doing" | "Done";
type FilterTime = "All" | "Today" | "3" | "7" | "14" | "30";
type FilterBackground = "gray" | "green" | "purple" | "blue" | "orange" | "yellow" | "pink";
// TODO: Estrarre queste opzioni in un file condiviso

export type List = {
  id: number;
  name: string;
  color: string;
};

// Tipo del context: cosa sarà disponibile per i componenti che usano il filtro
type FiltersContextType = {
  statusFilter: FilterStatus[];                // Filtri attivi per lo stato della task
  timeFilter: FilterTime;                      // Filtro attivo per il tempo
  listsFilter: number[];                       // ID delle liste attive nel filtro
  background: FilterBackground;                // sfondo attuale
  userLists: List[];                           // Tutte le liste dell’utente

  setStatusFilter: (statuses: FilterStatus[]) => void;    // Setter per filtro status
  setTimeFilter: (time: FilterTime) => void;              // Setter per filtro tempo
  setListsFilter: (listIds: number[]) => void;            // Setter per filtro liste
  setBackground: (color: FilterBackground) => void;       // Setter per sfondo

  loadUserLists: () => void;                   // Funzione per caricare le liste
  reloadTasks?: (() => void) | null;           // Funzione per ricaricare le task

  setReloadTasks?: (fn: () => void) => void;   // Setter per assegnare la funzione di ricarica task
};

// Crea il context, inizialmente undefined per mostrare errori se usato male
const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

// Funzione che recupera il colore di sfondo iniziale dal localStorage o dal body
const getInitialBackground = (): FilterBackground => {
  const saved = localStorage.getItem("background") as FilterBackground | null;
  if (saved) return saved;   // Se presente in localStorage

  // Altrimenti prova a dedurlo dalle classi del body (fallback)
  const classes = document.body.classList;
  if (classes.contains("bg-teal-100")) return "green";
  if (classes.contains("bg-indigo-100")) return "purple";
  if (classes.contains("bg-blue-100")) return "blue";
  if (classes.contains("bg-orange-100")) return "orange";
  if (classes.contains("bg-yellow-100")) return "yellow";
  if (classes.contains("bg-pink-100")) return "pink";
  return "gray";
};

// Provider: avvolge l'app, fornisce dati del context
export const FiltersContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [statusFilter, setStatusFilter] = useState<FilterStatus[]>(["To Do", "Doing", "Done"]); // Stato per filtro "status", inizialmente tutti selezionati
  const [timeFilter, setTimeFilter] = useState<FilterTime>("All");                             // Stato per filtro "Time", inizialmente "All"
  const [listsFilter, setListsFilter] = useState<number[]>([]);                              // Stato per liste selezionate nei filtri (id)
  const [background, setBackground] = useState<FilterBackground>(getInitialBackground());  // Stato bg, inizializzato dal body o localStorage
  const [userLists, setUserLists] = useState<List[]>([]);                                // Stato con tutte le liste dell’utente
  const [reloadTasks, setReloadTasks] = useState<(() => void) | null>(null);         // Funzione per ricaricare le task da fuori (es. dopo modifica liste)

  const { user, token } = useUserContext();    // Recupera user e token dal context

  // Funzione che carica le liste dell'utente dal BE
  const loadUserLists = async () => {
    if (!user || !token) return;

    const result = await getListsByUserId(user.id, token);

    if (result.success) {
      setUserLists(result.data);  // Salva le liste
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

  // Rende disponibile tutto il valore del context ai componenti figli
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

// Custom hook per accedere facilmente al context
export const useFiltersContext = () => {
  const context = useContext(FiltersContext);  // valore attuale del context
  if (!context) throw new Error("useFiltersContext must be used within FiltersContextProvider");
  return context;   // Restituisce i dati del context
};
