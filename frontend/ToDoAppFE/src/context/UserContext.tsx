import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

// Tipo utente restituito dal backend
type User = {
  id: number;
  name: string;
  username: string;
};

// Tipo del context = proprietà e funzioni disponibili nel context
type UserContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

// Crea il context con un valore iniziale undefined (se usato fuori dal provider darà errore - x debug)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook useUserContext() invece di useContext(UserContext)
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used inside UserContextProvider");
  return context;
};

// Provider: avvolge l'app, fornisce dati del context
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Carica token e user da localStorage se presenti (persistenza login se es. refresh pagina)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // login(): salva token e utente in stato e localStorage (persistenza al refresh)
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // logout(): azzera
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Token: true se esiste
  const isAuthenticated = !!token;

  // Memo: evita che il value venga ricreato a ogni render se i valori non cambiano
  const value = useMemo(() => ({ user, token, isAuthenticated, login, logout }), [user, token]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
