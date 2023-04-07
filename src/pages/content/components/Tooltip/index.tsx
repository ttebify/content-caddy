import { createRoot } from "react-dom/client";
import ToolTip from "@src/pages/content/components/Tooltip/Tooltip";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import React from "react";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";
document.body.append(root);

createRoot(root).render(<ToolTip />);

// conversations: 8051f43a-2f16-47c4-a509-8cb756dcfeb7
