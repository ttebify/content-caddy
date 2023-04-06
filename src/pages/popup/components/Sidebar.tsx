import React from "react";
import type { Tab } from "../types";
import clsx from "clsx";

interface SidebarProps {
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  activeTab: Tab;
}

const Sidebar = ({ setActiveTab, activeTab }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <div className="row">
        <img
          src="/assets/icons/icon-48.png"
          className="brand-logo"
          alt="Content Caddy Logo"
        />
        <p className="brand-name">Content Caddy</p>
      </div>
      <nav className="nav">
        <ul>
          <li className={clsx({ active: activeTab === "welcome" })}>
            <a href="#" onClick={() => setActiveTab("welcome")}>
              Welcome
            </a>
          </li>
          <li className={clsx({ active: activeTab === "bookmarks" })}>
            <a href="#" onClick={() => setActiveTab("bookmarks")}>
              Bookmarks
            </a>
          </li>
          <li className={clsx({ active: activeTab === "settings" })}>
            <a href="#" onClick={() => setActiveTab("settings")}>
              Settings
            </a>
          </li>
          <li className={clsx({ active: activeTab === "developer" })}>
            <a href="#" onClick={() => setActiveTab("developer")}>
              Contact Developer
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
