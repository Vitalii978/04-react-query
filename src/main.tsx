import "modern-normalize";
import "./index.css";
import App from "./components/App/App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 🔹 Імпорт з react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 🔹 Створення клієнта
const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    {/* 🔹 Обгортаємо App у QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

