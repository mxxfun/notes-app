import React from "react";
import ReactDOM from "react-dom/client";
import Homepage from "./homepage";
import { NoteProvider } from "./NoteContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NoteProvider>
      <Homepage />
    </NoteProvider>
  </React.StrictMode>,
);