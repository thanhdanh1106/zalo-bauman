// Import React and ReactDOM
import React from "react";
import { createRoot } from "react-dom/client";
import "zmp-ui/zaui.css";
import "./styles.css";

// Import App Component
import appConfig from "../app-config.json";
import App from "./App";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
} 
// Mount React App
const root = createRoot(document.getElementById("app")!);

root.render(React.createElement(App));
