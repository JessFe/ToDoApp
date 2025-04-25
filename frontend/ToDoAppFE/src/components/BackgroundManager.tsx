import { useEffect } from "react";
import { useFiltersContext } from "../context/FiltersContext";

const BackgroundManager = () => {
  const { background } = useFiltersContext();       // Estrae il valore background dal FiltersContext

  // ogni volta che cambia il valore di background..
  useEffect(() => {
    // Prima rimuove tutte le possibili classi di background dal body
    document.body.classList.remove(    // pulizia prima di aggiungere la nuova classe
      "bg-gray",
      "bg-teal-100",
      "bg-indigo-100",
      "bg-blue-100",
      "bg-orange-100",
      "bg-yellow-100",
      "bg-pink-100"
    );

    // Poi aggiunge la classe corrispondente al colore selezionato
    if (background === "gray") document.body.classList.add("bg-gray");
    if (background === "green") document.body.classList.add("bg-teal-100");
    if (background === "purple") document.body.classList.add("bg-indigo-100");
    if (background === "blue") document.body.classList.add("bg-blue-100");
    if (background === "orange") document.body.classList.add("bg-orange-100");
    if (background === "yellow") document.body.classList.add("bg-yellow-100");
    if (background === "pink") document.body.classList.add("bg-pink-100");

    return () => {
      document.body.classList.remove(     // pulizia quando cambia
        "bg-gray",
        "bg-teal-100",
        "bg-indigo-100",
        "bg-blue-100",
        "bg-orange-100",
        "bg-yellow-100",
        "bg-pink-100"
      );
    };
  }, [background]);

  return null;   // Il componente non renderizza nulla a schermo
};

export default BackgroundManager;
