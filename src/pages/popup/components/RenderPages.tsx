import React from "react";
import Welcome from "../sections/Welcome";
import RenderSection from "./RenderSection";
import Bookmarks from "../sections/Bookmarks";
import Settings from "../sections/Settings";
import ContactDeveloper from "../sections/ContactDeveloper";
import type { Tab } from "@src/types";

interface RenderSectionsProps {
  activeTab: Tab;
}

const RenderSections = ({ activeTab }: RenderSectionsProps) => {
  return (
    <main className="main">
      <RenderSection active={activeTab === "welcome"} component={Welcome} />
      <RenderSection active={activeTab === "bookmarks"} component={Bookmarks} />
      <RenderSection active={activeTab === "settings"} component={Settings} />
      <RenderSection
        active={activeTab === "developer"}
        component={ContactDeveloper}
      />
    </main>
  );
};

export default RenderSections;
