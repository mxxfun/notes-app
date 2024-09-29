import React from "react";
import ReactDOM from "react-dom/client";
import Homepage from "./homepage";
import NoteContextMenu from "./note-context-menu";

const showHomepage = false;
const showContextMenu = true;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {showHomepage && <Homepage />}
    {showContextMenu && <NoteContextMenu />}
  </React.StrictMode>,
);
