import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/styles/normalize.css";
import "@pages/popup/styles/scroll-bar-like-mac.css";
import "@pages/popup/styles/main.css";
import Popup from "@pages/popup/Popup";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/popup");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  root.render(<Popup />);
}

init();
