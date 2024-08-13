import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Switch_Theme from "./Component/Switch_Theme/Switch_Theme";

function App() {

  return (
    <>
      <header>
        
      </header>
      <main>
        <Switch_Theme></Switch_Theme>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
