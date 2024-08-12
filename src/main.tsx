import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

import store from "./store";

import App from "./App.tsx";
import "./index.css";

// theme provider
import { ThemeProvider } from "./components/theme-provider.tsx";

import { queryClient } from "./http/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
