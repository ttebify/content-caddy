import React, { Fragment, useState } from "react";
import Sidebar from "./components/Sidebar";
import RenderSections from "./components/RenderPages";
import type { Tab } from "@src/types";

const Popup = () => {
  const [activeTab, setActiveTab] = useState<Tab>("welcome");
  return (
    <Fragment>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <RenderSections activeTab={activeTab} />
    </Fragment>
  );
};

export default Popup;
