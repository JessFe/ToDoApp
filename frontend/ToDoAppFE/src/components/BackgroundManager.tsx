import { useEffect } from "react";
import { useFiltersContext } from "../context/FiltersContext";

const BackgroundManager = () => {
  const { background } = useFiltersContext();

  useEffect(() => {
    document.body.classList.remove(
      "bg-gray",
      "bg-teal-100",
      "bg-indigo-100",
      "bg-blue-100",
      "bg-orange-100",
      "bg-yellow-100",
      "bg-pink-100"
    );

    if (background === "gray") document.body.classList.add("bg-gray");
    if (background === "green") document.body.classList.add("bg-teal-100");
    if (background === "purple") document.body.classList.add("bg-indigo-100");
    if (background === "blue") document.body.classList.add("bg-blue-100");
    if (background === "orange") document.body.classList.add("bg-orange-100");
    if (background === "yellow") document.body.classList.add("bg-yellow-100");
    if (background === "pink") document.body.classList.add("bg-pink-100");

    return () => {
      document.body.classList.remove(
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

  return null;
};

export default BackgroundManager;
