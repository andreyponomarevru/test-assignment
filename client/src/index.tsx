import React from "react";
import ReactDOM from "react-dom/client";
import { hot } from "react-hot-loader/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./components/app";
import { ErrorBoundary } from "./components/error-boundary";

import "./components/reset.css";
import "./components/index.css";

const rootEl = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const queryClient = new QueryClient();

rootEl.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

export default hot(App);
