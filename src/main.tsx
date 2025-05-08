import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./AppRouter.tsx";
import AuthProvider from "./contexts/providers/AuthProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScreenProvider from "./contexts/providers/ScreenProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <ScreenProvider>
          <AppRouter />
        </ScreenProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
