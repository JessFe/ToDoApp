import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import AccessPage from "./pages/AccessPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AccessPage />} />
        <Route path="/register" element={<AccessPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
