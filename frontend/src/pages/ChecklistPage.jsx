import React from "react";

import AsideChecklist from "../features/checklist/AsideChecklist";
import Todos from "../features/checklist/Todos";

export default function ChecklistPage() {
  return (
    <section className="flex gap-10">
      <div className="w-[25%]">
        <AsideChecklist />
      </div>
      <div className="w-[75%]">
        <Todos />
      </div>
    </section>
  );
}
