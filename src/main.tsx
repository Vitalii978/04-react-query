import 'modern-normalize';
import "./index.css";
import App from "./components/App/App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";


createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
