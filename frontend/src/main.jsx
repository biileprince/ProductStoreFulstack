import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Initialize theme from localStorage
const storedTheme = localStorage.getItem("preferred-theme") || "forest";
document.documentElement.setAttribute("data-theme", storedTheme);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
