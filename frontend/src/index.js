import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import { ProfileDataProvider } from "./contexts/ProfileDataContext";

// Get the root container element
const container = document.getElementById("root");

// Create a root for rendering
const root = createRoot(container);

// Render the application using createRoot
root.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <ProfileDataProvider>
          <App />
        </ProfileDataProvider>
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
