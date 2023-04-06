import React from "react";
import clsx from "clsx";

interface RenderSectionProps {
  component: React.ComponentType;
  active: boolean;
}

function RenderSection({ component: Component, active }: RenderSectionProps) {
  return (
    <section className={clsx("section", { active })}>{<Component />}</section>
  );
}

export default RenderSection;
