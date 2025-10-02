import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Use relative path for service worker to work with GitHub Pages subdirectory
    const swPath = process.env.NODE_ENV === "production" ? "./sw.js" : "/sw.js";

    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
