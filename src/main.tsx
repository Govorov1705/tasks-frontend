import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Layout from "./components/Layout.tsx";
import Setup from "./components/Setup.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import "./index.css";
import StoreProvider from "./redux/StoreProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Setup />
          <Layout>
            <App />
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>
);
